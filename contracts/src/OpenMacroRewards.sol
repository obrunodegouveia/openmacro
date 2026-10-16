// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Ownable, Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OpenMacroRewards
 * @notice Teachers escrow EURC here and their students are paid from it for
 *         what they learn on OpenMacro.
 *
 * Who can do what
 * ---------------
 * - A teacher deposits from their own wallet and is the only one who can take
 *   their money back out, after WITHDRAWAL_DELAY.
 * - OpenMacro's signer states, off-chain, "teacher T owes student S a running
 *   total of X, payable to address A". Anyone may submit that statement; the
 *   contract pays A the part of X not paid yet. OpenMacro relays it and pays
 *   the gas, because a Coinbase deposit address cannot send transactions.
 * - The owner can only replace the signer. It has no way to move, freeze or
 *   redirect a teacher's money. Setting the signer to address(0) stops new
 *   claims everywhere; teachers can still withdraw.
 *
 * What bounds a leaked signer key
 * -------------------------------
 * Each teacher sets a daily cap. A signer that signs anything it likes can
 * still pay out at most that cap per teacher per UTC day, until the owner
 * rotates it.
 *
 * What protects a student from their teacher
 * ------------------------------------------
 * Money a student has earned stays claimable for at least WITHDRAWAL_DELAY:
 * a teacher's withdrawal and a lowered cap both wait that long before they
 * take effect. A teacher can always stop future earnings off-chain; they
 * cannot take back what was already earned without that notice.
 *
 * Amounts are EURC base units (6 decimals). The token is fixed at deployment.
 */
contract OpenMacroRewards is EIP712, Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ---------------------------------------------------------------------
    // Types and constants
    // ---------------------------------------------------------------------

    /// @notice How long a teacher's withdrawal or cap reduction waits.
    uint256 public constant WITHDRAWAL_DELAY = 7 days;

    bytes32 public constant STATEMENT_TYPEHASH =
        keccak256("Statement(address teacher,bytes32 student,address recipient,uint256 cumulative,uint256 deadline)");

    /**
     * @notice What the signer attests. `cumulative` is everything this teacher
     *         has ever owed this student, so a statement can be replayed
     *         harmlessly: it never pays the same euro twice.
     * @param teacher    Whose deposit pays.
     * @param student    Stable id for the learner (a hash of their account id),
     *                   so a new payout address does not reset what was paid.
     * @param recipient  Where this claim is paid.
     * @param cumulative Running total owed, in EURC base units.
     * @param deadline   Unix time after which the statement is refused.
     */
    struct Statement {
        address teacher;
        bytes32 student;
        address recipient;
        uint256 cumulative;
        uint256 deadline;
    }

    struct Teacher {
        uint256 balance;
        uint256 dailyCap;
        uint256 spentToday;
        uint256 day;
        uint256 pendingCap;
        uint256 pendingCapAt;
        uint256 pendingWithdrawal;
        uint256 withdrawableAt;
    }

    // ---------------------------------------------------------------------
    // State
    // ---------------------------------------------------------------------

    IERC20 public immutable token;
    address public signer;

    mapping(address teacher => Teacher) internal _teachers;
    mapping(address teacher => mapping(bytes32 student => uint256)) public claimed;

    // ---------------------------------------------------------------------
    // Events and errors
    // ---------------------------------------------------------------------

    event Deposited(address indexed teacher, uint256 amount);
    event DailyCapSet(address indexed teacher, uint256 cap, uint256 effectiveAt);
    event WithdrawalRequested(address indexed teacher, uint256 amount, uint256 withdrawableAt);
    event WithdrawalCancelled(address indexed teacher);
    event Withdrawn(address indexed teacher, uint256 amount);
    event Claimed(
        address indexed teacher, bytes32 indexed student, address indexed recipient, uint256 amount, uint256 cumulative
    );
    event SignerChanged(address indexed previous, address indexed next);

    error ZeroAmount();
    error ZeroAddress();
    error StatementExpired();
    error InvalidSignature();
    error NothingToClaim();
    error DailyCapExceeded(uint256 available);
    error InsufficientBalance(uint256 available);
    error NoPendingWithdrawal();
    error WithdrawalNotReady(uint256 withdrawableAt);

    // ---------------------------------------------------------------------
    // Construction
    // ---------------------------------------------------------------------

    /**
     * @param token_  The EURC contract on this chain.
     * @param signer_ The key the web server signs statements with.
     * @param owner_  Who may rotate the signer. Should be a multisig.
     */
    constructor(IERC20 token_, address signer_, address owner_) EIP712("OpenMacroRewards", "1") Ownable(owner_) {
        if (address(token_) == address(0) || signer_ == address(0)) revert ZeroAddress();
        token = token_;
        signer = signer_;
        emit SignerChanged(address(0), signer_);
    }

    // ---------------------------------------------------------------------
    // Teachers
    // ---------------------------------------------------------------------

    /**
     * @notice Add EURC to the caller's deposit. Requires a prior `approve`.
     * @param amount EURC base units to pull from the caller.
     */
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        // Credit what actually arrived, not what was asked for.
        uint256 before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = token.balanceOf(address(this)) - before;
        _teachers[msg.sender].balance += received;
        emit Deposited(msg.sender, received);
    }

    /**
     * @notice Set the most the caller's students can claim per UTC day, in total.
     *         Raising it applies now. Lowering it applies after WITHDRAWAL_DELAY,
     *         so it cannot be used to strand what students already earned.
     *         A new cap replaces any reduction still waiting.
     * @param cap EURC base units per day. Zero, once effective, stops claims.
     */
    function setDailyCap(uint256 cap) external {
        Teacher storage t = _teachers[msg.sender];
        _applyPendingCap(t);

        uint256 effectiveAt;
        if (cap >= t.dailyCap) {
            t.dailyCap = cap;
            t.pendingCap = 0;
            t.pendingCapAt = 0;
            effectiveAt = block.timestamp;
        } else {
            effectiveAt = block.timestamp + WITHDRAWAL_DELAY;
            t.pendingCap = cap;
            t.pendingCapAt = effectiveAt;
        }
        emit DailyCapSet(msg.sender, cap, effectiveAt);
    }

    /**
     * @notice Start taking money back. It stays claimable by students until
     *         executed. A new request replaces the previous one and restarts
     *         the delay.
     * @param amount EURC base units, at most the current balance.
     */
    function requestWithdrawal(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        Teacher storage t = _teachers[msg.sender];
        if (amount > t.balance) revert InsufficientBalance(t.balance);
        t.pendingWithdrawal = amount;
        t.withdrawableAt = block.timestamp + WITHDRAWAL_DELAY;
        emit WithdrawalRequested(msg.sender, amount, t.withdrawableAt);
    }

    /// @notice Drop a pending withdrawal.
    function cancelWithdrawal() external {
        Teacher storage t = _teachers[msg.sender];
        if (t.pendingWithdrawal == 0) revert NoPendingWithdrawal();
        t.pendingWithdrawal = 0;
        t.withdrawableAt = 0;
        emit WithdrawalCancelled(msg.sender);
    }

    /**
     * @notice Complete a withdrawal once its delay has passed. Pays the amount
     *         requested or whatever is left after claims, whichever is less.
     */
    function executeWithdrawal() external nonReentrant {
        Teacher storage t = _teachers[msg.sender];
        if (t.pendingWithdrawal == 0) revert NoPendingWithdrawal();
        if (block.timestamp < t.withdrawableAt) revert WithdrawalNotReady(t.withdrawableAt);

        uint256 amount = t.pendingWithdrawal < t.balance ? t.pendingWithdrawal : t.balance;
        t.pendingWithdrawal = 0;
        t.withdrawableAt = 0;
        t.balance -= amount;

        emit Withdrawn(msg.sender, amount);
        token.safeTransfer(msg.sender, amount);
    }

    // ---------------------------------------------------------------------
    // Students
    // ---------------------------------------------------------------------

    /**
     * @notice Pay a statement. Callable by anyone; the money can only go to
     *         the recipient the signer named.
     * @param s         The statement.
     * @param signature The signer's EIP-712 signature over it.
     * @return amount   EURC base units paid by this call.
     */
    function claim(Statement calldata s, bytes calldata signature) external nonReentrant returns (uint256 amount) {
        if (block.timestamp > s.deadline) revert StatementExpired();
        if (s.recipient == address(0)) revert ZeroAddress();

        address recovered = ECDSA.recover(_hashTypedDataV4(_structHash(s)), signature);
        // signer == address(0) means claims are switched off; recover never returns 0.
        if (recovered != signer) revert InvalidSignature();

        uint256 already = claimed[s.teacher][s.student];
        if (s.cumulative <= already) revert NothingToClaim();
        amount = s.cumulative - already;

        Teacher storage t = _teachers[s.teacher];
        _applyPendingCap(t);
        uint256 today = block.timestamp / 1 days;
        if (t.day != today) {
            t.day = today;
            t.spentToday = 0;
        }
        uint256 capLeft = t.dailyCap > t.spentToday ? t.dailyCap - t.spentToday : 0;
        if (amount > capLeft) revert DailyCapExceeded(capLeft);
        if (amount > t.balance) revert InsufficientBalance(t.balance);

        claimed[s.teacher][s.student] = s.cumulative;
        t.spentToday += amount;
        t.balance -= amount;

        emit Claimed(s.teacher, s.student, s.recipient, amount, s.cumulative);
        token.safeTransfer(s.recipient, amount);
    }

    // ---------------------------------------------------------------------
    // Owner
    // ---------------------------------------------------------------------

    /**
     * @notice Replace the statement signer. Every statement signed by the old
     *         key stops working at once. address(0) switches claims off.
     * @param next The new signer.
     */
    function setSigner(address next) external onlyOwner {
        emit SignerChanged(signer, next);
        signer = next;
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------

    /**
     * @notice A teacher's escrow as it stands now, with any matured cap
     *         reduction and day rollover already applied.
     * @return balance          EURC still in escrow.
     * @return dailyCap         Cap in force now.
     * @return availableToday   What students can still claim today.
     * @return pendingCap       A lower cap waiting to apply (0 if none).
     * @return pendingCapAt     When it applies (0 if none).
     * @return pendingWithdrawal Amount the teacher has asked to take back.
     * @return withdrawableAt   When they can (0 if none).
     */
    function teacher(address who)
        external
        view
        returns (
            uint256 balance,
            uint256 dailyCap,
            uint256 availableToday,
            uint256 pendingCap,
            uint256 pendingCapAt,
            uint256 pendingWithdrawal,
            uint256 withdrawableAt
        )
    {
        Teacher memory t = _teachers[who];
        if (t.pendingCapAt != 0 && block.timestamp >= t.pendingCapAt) {
            t.dailyCap = t.pendingCap;
            t.pendingCap = 0;
            t.pendingCapAt = 0;
        }
        uint256 spent = t.day == block.timestamp / 1 days ? t.spentToday : 0;
        uint256 capLeft = t.dailyCap > spent ? t.dailyCap - spent : 0;
        uint256 available = capLeft < t.balance ? capLeft : t.balance;
        return (t.balance, t.dailyCap, available, t.pendingCap, t.pendingCapAt, t.pendingWithdrawal, t.withdrawableAt);
    }

    /**
     * @notice The digest the signer signs, for off-chain tooling and tests.
     * @param s The statement.
     * @return The EIP-712 digest.
     */
    function statementDigest(Statement calldata s) external view returns (bytes32) {
        return _hashTypedDataV4(_structHash(s));
    }

    // ---------------------------------------------------------------------
    // Internals
    // ---------------------------------------------------------------------

    function _structHash(Statement calldata s) private pure returns (bytes32) {
        return keccak256(abi.encode(STATEMENT_TYPEHASH, s.teacher, s.student, s.recipient, s.cumulative, s.deadline));
    }

    function _applyPendingCap(Teacher storage t) private {
        if (t.pendingCapAt != 0 && block.timestamp >= t.pendingCapAt) {
            t.dailyCap = t.pendingCap;
            t.pendingCap = 0;
            t.pendingCapAt = 0;
        }
    }
}
