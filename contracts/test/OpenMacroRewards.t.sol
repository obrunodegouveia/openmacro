// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OpenMacroRewards} from "../src/OpenMacroRewards.sol";

/// @dev Stand-in for EURC: 6 decimals, freely mintable in tests.
contract MockEURC is ERC20 {
    constructor() ERC20("EURC", "EURC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract OpenMacroRewardsTest is Test {
    uint256 internal constant EUR = 1e6;

    MockEURC internal eurc;
    OpenMacroRewards internal rewards;

    uint256 internal signerKey = 0xA11CE;
    address internal signer;
    address internal owner = makeAddr("owner");
    address internal teacher = makeAddr("teacher");
    address internal otherTeacher = makeAddr("otherTeacher");
    address internal relayer = makeAddr("relayer");
    address internal studentWallet = makeAddr("studentWallet");
    bytes32 internal student = keccak256("student-account-id");

    function setUp() public {
        // Start on a known day boundary so day arithmetic is easy to follow.
        vm.warp(1_800_000_000 - (1_800_000_000 % 1 days));
        signer = vm.addr(signerKey);
        eurc = new MockEURC();
        rewards = new OpenMacroRewards(eurc, signer, owner);

        _fund(teacher, 100 * EUR);
        vm.prank(teacher);
        rewards.setDailyCap(20 * EUR);
    }

    // -----------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------

    function _fund(address who, uint256 amount) internal {
        eurc.mint(who, amount);
        vm.startPrank(who);
        eurc.approve(address(rewards), amount);
        rewards.deposit(amount);
        vm.stopPrank();
    }

    function _statement(address t, bytes32 s, address to, uint256 cumulative)
        internal
        view
        returns (OpenMacroRewards.Statement memory)
    {
        return OpenMacroRewards.Statement({
            teacher: t, student: s, recipient: to, cumulative: cumulative, deadline: block.timestamp + 1 hours
        });
    }

    function _sign(uint256 key, OpenMacroRewards.Statement memory st) internal view returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, rewards.statementDigest(st));
        return abi.encodePacked(r, s, v);
    }

    function _claim(OpenMacroRewards.Statement memory st) internal returns (uint256) {
        bytes memory sig = _sign(signerKey, st);
        vm.prank(relayer);
        return rewards.claim(st, sig);
    }

    function _balance(address t) internal view returns (uint256 balance) {
        (balance,,,,,,) = rewards.teacher(t);
    }

    // -----------------------------------------------------------------
    // Construction
    // -----------------------------------------------------------------

    function test_constructor_rejectsZeroAddresses() public {
        vm.expectRevert(OpenMacroRewards.ZeroAddress.selector);
        new OpenMacroRewards(MockEURC(address(0)), signer, owner);
        vm.expectRevert(OpenMacroRewards.ZeroAddress.selector);
        new OpenMacroRewards(eurc, address(0), owner);
    }

    // -----------------------------------------------------------------
    // Deposits
    // -----------------------------------------------------------------

    function test_deposit_creditsTheCaller() public {
        assertEq(_balance(teacher), 100 * EUR);
        assertEq(eurc.balanceOf(address(rewards)), 100 * EUR);
    }

    function test_deposit_rejectsZero() public {
        vm.prank(teacher);
        vm.expectRevert(OpenMacroRewards.ZeroAmount.selector);
        rewards.deposit(0);
    }

    function test_deposit_isPerTeacher() public {
        _fund(otherTeacher, 5 * EUR);
        assertEq(_balance(teacher), 100 * EUR);
        assertEq(_balance(otherTeacher), 5 * EUR);
    }

    // -----------------------------------------------------------------
    // Claims
    // -----------------------------------------------------------------

    function test_claim_paysTheRecipientNotTheRelayer() public {
        uint256 paid = _claim(_statement(teacher, student, studentWallet, 3 * EUR));
        assertEq(paid, 3 * EUR);
        assertEq(eurc.balanceOf(studentWallet), 3 * EUR);
        assertEq(eurc.balanceOf(relayer), 0);
        assertEq(_balance(teacher), 97 * EUR);
        assertEq(rewards.claimed(teacher, student), 3 * EUR);
    }

    function test_claim_paysOnlyTheDifferenceOfARunningTotal() public {
        _claim(_statement(teacher, student, studentWallet, 3 * EUR));
        uint256 paid = _claim(_statement(teacher, student, studentWallet, 5 * EUR));
        assertEq(paid, 2 * EUR);
        assertEq(eurc.balanceOf(studentWallet), 5 * EUR);
    }

    function test_claim_replayPaysNothing() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        rewards.claim(st, sig);
        vm.expectRevert(OpenMacroRewards.NothingToClaim.selector);
        rewards.claim(st, sig);
    }

    function test_claim_olderLowerStatementPaysNothing() public {
        OpenMacroRewards.Statement memory older = _statement(teacher, student, studentWallet, 2 * EUR);
        bytes memory olderSig = _sign(signerKey, older);
        _claim(_statement(teacher, student, studentWallet, 4 * EUR));
        vm.expectRevert(OpenMacroRewards.NothingToClaim.selector);
        rewards.claim(older, olderSig);
    }

    function test_claim_newAddressDoesNotResetWhatWasPaid() public {
        _claim(_statement(teacher, student, studentWallet, 3 * EUR));
        address newWallet = makeAddr("newWallet");
        uint256 paid = _claim(_statement(teacher, student, newWallet, 4 * EUR));
        assertEq(paid, 1 * EUR);
        assertEq(eurc.balanceOf(newWallet), 1 * EUR);
    }

    function test_claim_rejectsATamperedRecipient() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        st.recipient = relayer;
        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, sig);
    }

    function test_claim_rejectsATamperedAmount() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        st.cumulative = 30 * EUR;
        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, sig);
    }

    function test_claim_cannotSpendAnotherTeachersDeposit() public {
        _fund(otherTeacher, 50 * EUR);
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        st.teacher = otherTeacher;
        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, sig);
        assertEq(_balance(otherTeacher), 50 * EUR);
    }

    function test_claim_rejectsAnyOtherSigner() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(0xBAD, st);
        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, sig);
    }

    function test_claim_rejectsAnExpiredStatement() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.warp(st.deadline + 1);
        vm.expectRevert(OpenMacroRewards.StatementExpired.selector);
        rewards.claim(st, sig);
    }

    function test_claim_rejectsTheZeroRecipient() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, address(0), 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.expectRevert(OpenMacroRewards.ZeroAddress.selector);
        rewards.claim(st, sig);
    }

    function test_claim_signatureIsBoundToThisContract() public {
        OpenMacroRewards other = new OpenMacroRewards(eurc, signer, owner);
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, other.statementDigest(st));
        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, abi.encodePacked(r, s, v));
    }

    function test_claim_cannotExceedTheDeposit() public {
        address poor = makeAddr("poor");
        _fund(poor, 2 * EUR);
        vm.prank(poor);
        rewards.setDailyCap(50 * EUR);
        OpenMacroRewards.Statement memory st = _statement(poor, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.expectRevert(abi.encodeWithSelector(OpenMacroRewards.InsufficientBalance.selector, 2 * EUR));
        rewards.claim(st, sig);
    }

    // -----------------------------------------------------------------
    // Daily cap
    // -----------------------------------------------------------------

    function test_cap_zeroByDefaultMeansNoClaims() public {
        _fund(otherTeacher, 10 * EUR);
        OpenMacroRewards.Statement memory st = _statement(otherTeacher, student, studentWallet, 1 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.expectRevert(abi.encodeWithSelector(OpenMacroRewards.DailyCapExceeded.selector, 0));
        rewards.claim(st, sig);
    }

    function test_cap_isSharedByAllOfATeachersStudents() public {
        _claim(_statement(teacher, student, studentWallet, 15 * EUR));
        bytes32 second = keccak256("second-student");
        OpenMacroRewards.Statement memory st = _statement(teacher, second, studentWallet, 6 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.expectRevert(abi.encodeWithSelector(OpenMacroRewards.DailyCapExceeded.selector, 5 * EUR));
        rewards.claim(st, sig);
    }

    function test_cap_resetsAtTheNextUtcDay() public {
        _claim(_statement(teacher, student, studentWallet, 20 * EUR));
        (,, uint256 availableToday,,,,) = rewards.teacher(teacher);
        assertEq(availableToday, 0);

        vm.warp(block.timestamp + 1 days);
        uint256 paid = _claim(_statement(teacher, student, studentWallet, 35 * EUR));
        assertEq(paid, 15 * EUR);
    }

    function test_cap_raiseAppliesImmediately() public {
        vm.prank(teacher);
        rewards.setDailyCap(50 * EUR);
        assertEq(_claim(_statement(teacher, student, studentWallet, 40 * EUR)), 40 * EUR);
    }

    function test_cap_lowerWaitsForTheDelay() public {
        vm.prank(teacher);
        rewards.setDailyCap(1 * EUR);

        // Still the old cap for the whole notice period.
        assertEq(_claim(_statement(teacher, student, studentWallet, 20 * EUR)), 20 * EUR);
        (, uint256 capNow,, uint256 pendingCap, uint256 pendingCapAt,,) = rewards.teacher(teacher);
        assertEq(capNow, 20 * EUR);
        assertEq(pendingCap, 1 * EUR);
        assertEq(pendingCapAt, block.timestamp + rewards.WITHDRAWAL_DELAY());

        vm.warp(pendingCapAt);
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 22 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.expectRevert(abi.encodeWithSelector(OpenMacroRewards.DailyCapExceeded.selector, 1 * EUR));
        rewards.claim(st, sig);
    }

    function test_cap_raiseCancelsAPendingReduction() public {
        vm.startPrank(teacher);
        rewards.setDailyCap(1 * EUR);
        rewards.setDailyCap(30 * EUR);
        vm.stopPrank();
        vm.warp(block.timestamp + 8 days);
        (, uint256 capNow,, uint256 pendingCap,,,) = rewards.teacher(teacher);
        assertEq(capNow, 30 * EUR);
        assertEq(pendingCap, 0);
    }

    // -----------------------------------------------------------------
    // Withdrawals
    // -----------------------------------------------------------------

    function test_withdraw_waitsForTheDelay() public {
        vm.startPrank(teacher);
        rewards.requestWithdrawal(40 * EUR);
        uint256 readyAt = block.timestamp + rewards.WITHDRAWAL_DELAY();
        vm.expectRevert(abi.encodeWithSelector(OpenMacroRewards.WithdrawalNotReady.selector, readyAt));
        rewards.executeWithdrawal();

        vm.warp(readyAt);
        rewards.executeWithdrawal();
        vm.stopPrank();
        assertEq(eurc.balanceOf(teacher), 40 * EUR);
        assertEq(_balance(teacher), 60 * EUR);
    }

    function test_withdraw_studentsCanStillClaimDuringTheNotice() public {
        vm.prank(teacher);
        rewards.requestWithdrawal(100 * EUR);

        _claim(_statement(teacher, student, studentWallet, 20 * EUR));
        vm.warp(block.timestamp + 7 days);
        vm.prank(teacher);
        rewards.executeWithdrawal();

        assertEq(eurc.balanceOf(studentWallet), 20 * EUR);
        assertEq(eurc.balanceOf(teacher), 80 * EUR, "pays what is left, not what was asked");
        assertEq(_balance(teacher), 0);
    }

    function test_withdraw_cannotAskForMoreThanTheBalance() public {
        vm.prank(teacher);
        vm.expectRevert(abi.encodeWithSelector(OpenMacroRewards.InsufficientBalance.selector, 100 * EUR));
        rewards.requestWithdrawal(101 * EUR);
    }

    function test_withdraw_newRequestRestartsTheDelay() public {
        vm.startPrank(teacher);
        rewards.requestWithdrawal(10 * EUR);
        vm.warp(block.timestamp + 6 days);
        rewards.requestWithdrawal(20 * EUR);
        vm.warp(block.timestamp + 2 days);
        vm.expectRevert();
        rewards.executeWithdrawal();
        vm.stopPrank();
    }

    function test_withdraw_cancel() public {
        vm.startPrank(teacher);
        rewards.requestWithdrawal(10 * EUR);
        rewards.cancelWithdrawal();
        vm.warp(block.timestamp + 8 days);
        vm.expectRevert(OpenMacroRewards.NoPendingWithdrawal.selector);
        rewards.executeWithdrawal();
        vm.expectRevert(OpenMacroRewards.NoPendingWithdrawal.selector);
        rewards.cancelWithdrawal();
        vm.stopPrank();
    }

    function test_withdraw_onlyTheTeacherCanTakeTheirMoney() public {
        vm.prank(teacher);
        rewards.requestWithdrawal(10 * EUR);
        vm.warp(block.timestamp + 8 days);
        vm.prank(owner);
        vm.expectRevert(OpenMacroRewards.NoPendingWithdrawal.selector);
        rewards.executeWithdrawal();
        assertEq(_balance(teacher), 100 * EUR);
    }

    // -----------------------------------------------------------------
    // Signer rotation
    // -----------------------------------------------------------------

    function test_signer_rotationInvalidatesOldStatements() public {
        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory oldSig = _sign(signerKey, st);

        uint256 newKey = 0xB0B;
        vm.prank(owner);
        rewards.setSigner(vm.addr(newKey));

        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, oldSig);
        rewards.claim(st, _sign(newKey, st));
        assertEq(eurc.balanceOf(studentWallet), 3 * EUR);
    }

    function test_signer_zeroSwitchesClaimsOffButNotWithdrawals() public {
        vm.prank(owner);
        rewards.setSigner(address(0));

        OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, 3 * EUR);
        bytes memory sig = _sign(signerKey, st);
        vm.expectRevert(OpenMacroRewards.InvalidSignature.selector);
        rewards.claim(st, sig);

        vm.startPrank(teacher);
        rewards.requestWithdrawal(100 * EUR);
        vm.warp(block.timestamp + 7 days);
        rewards.executeWithdrawal();
        vm.stopPrank();
        assertEq(eurc.balanceOf(teacher), 100 * EUR);
    }

    function test_signer_onlyOwnerCanRotate() public {
        vm.prank(teacher);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, teacher));
        rewards.setSigner(teacher);
    }

    function test_owner_transferIsTwoStep() public {
        address next = makeAddr("next");
        vm.prank(owner);
        rewards.transferOwnership(next);
        assertEq(rewards.owner(), owner);
        vm.prank(next);
        rewards.acceptOwnership();
        assertEq(rewards.owner(), next);
    }

    // -----------------------------------------------------------------
    // Fuzz
    // -----------------------------------------------------------------

    /// A leaked signer key pays out at most the cap per day, whatever it signs.
    function testFuzz_leakedSignerIsBoundedByTheCap(uint256 cumulative, uint8 days_) public {
        cumulative = bound(cumulative, 1, 1_000 * EUR);
        uint256 dayCount = bound(days_, 1, 10);
        address thief = makeAddr("thief");
        uint256 total;
        for (uint256 i; i < dayCount; i++) {
            OpenMacroRewards.Statement memory st = _statement(teacher, student, thief, total + cumulative);
            bytes memory sig = _sign(signerKey, st);
            try rewards.claim(st, sig) returns (uint256 paid) {
                total += paid;
            } catch {}
            vm.warp(block.timestamp + 1 days);
        }
        assertLe(eurc.balanceOf(thief), dayCount * 20 * EUR);
        assertLe(eurc.balanceOf(thief), 100 * EUR);
    }

    /// Claims in any order never pay more than the highest running total.
    function testFuzz_neverPaysMoreThanTheHighestTotal(uint256 a, uint256 b, uint256 c) public {
        a = bound(a, 0, 20 * EUR);
        b = bound(b, 0, 20 * EUR);
        c = bound(c, 0, 20 * EUR);
        vm.prank(teacher);
        rewards.setDailyCap(100 * EUR);
        uint256[3] memory totals = [a, b, c];
        uint256 highest;
        for (uint256 i; i < 3; i++) {
            if (totals[i] > highest) highest = totals[i];
            OpenMacroRewards.Statement memory st = _statement(teacher, student, studentWallet, totals[i]);
            bytes memory sig = _sign(signerKey, st);
            try rewards.claim(st, sig) {} catch {}
        }
        assertEq(eurc.balanceOf(studentWallet), highest);
    }
}
