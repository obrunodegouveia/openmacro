// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {OpenMacroRewards} from "../src/OpenMacroRewards.sol";
import {MockEURC} from "./OpenMacroRewards.t.sol";

/// @dev Drives random deposits, caps, claims and withdrawals by three teachers.
contract Handler is Test {
    uint256 internal constant EUR = 1e6;

    OpenMacroRewards internal rewards;
    MockEURC internal eurc;
    uint256 internal signerKey;

    address[3] public teachers;
    bytes32[3] public students = [keccak256("s0"), keccak256("s1"), keccak256("s2")];
    address public payee = makeAddr("payee");

    uint256 public deposited;
    uint256 public paidOut;
    uint256 public withdrawn;
    mapping(address => uint256) public depositedBy;
    mapping(address => uint256) public outflowOf;

    constructor(OpenMacroRewards rewards_, MockEURC eurc_, uint256 signerKey_) {
        rewards = rewards_;
        eurc = eurc_;
        signerKey = signerKey_;
        teachers = [makeAddr("t0"), makeAddr("t1"), makeAddr("t2")];
    }

    function deposit(uint256 who, uint256 amount) external {
        address t = teachers[who % 3];
        amount = bound(amount, 1, 1_000 * EUR);
        eurc.mint(t, amount);
        vm.startPrank(t);
        eurc.approve(address(rewards), amount);
        rewards.deposit(amount);
        vm.stopPrank();
        deposited += amount;
        depositedBy[t] += amount;
    }

    function setCap(uint256 who, uint256 cap) external {
        vm.prank(teachers[who % 3]);
        rewards.setDailyCap(bound(cap, 0, 500 * EUR));
    }

    function claim(uint256 who, uint256 studentIndex, uint256 extra) external {
        address t = teachers[who % 3];
        bytes32 s = students[studentIndex % 3];
        uint256 cumulative = rewards.claimed(t, s) + bound(extra, 0, 300 * EUR);
        OpenMacroRewards.Statement memory st = OpenMacroRewards.Statement({
            teacher: t, student: s, recipient: payee, cumulative: cumulative, deadline: block.timestamp + 1 hours
        });
        (uint8 v, bytes32 r, bytes32 sg) = vm.sign(signerKey, rewards.statementDigest(st));
        try rewards.claim(st, abi.encodePacked(r, sg, v)) returns (uint256 paid) {
            paidOut += paid;
            outflowOf[t] += paid;
        } catch {}
    }

    function requestWithdrawal(uint256 who, uint256 amount) external {
        address t = teachers[who % 3];
        (uint256 balance,,,,,,) = rewards.teacher(t);
        if (balance == 0) return;
        vm.prank(t);
        rewards.requestWithdrawal(bound(amount, 1, balance));
    }

    function executeWithdrawal(uint256 who) external {
        address t = teachers[who % 3];
        uint256 before = eurc.balanceOf(t);
        vm.prank(t);
        try rewards.executeWithdrawal() {
            uint256 got = eurc.balanceOf(t) - before;
            withdrawn += got;
            outflowOf[t] += got;
        } catch {}
    }

    function passTime(uint256 seconds_) external {
        vm.warp(block.timestamp + bound(seconds_, 1, 3 days));
    }
}

contract OpenMacroRewardsInvariantTest is Test {
    OpenMacroRewards internal rewards;
    MockEURC internal eurc;
    Handler internal handler;

    function setUp() public {
        uint256 signerKey = 0xA11CE;
        eurc = new MockEURC();
        rewards = new OpenMacroRewards(eurc, vm.addr(signerKey), makeAddr("owner"));
        handler = new Handler(rewards, eurc, signerKey);
        targetContract(address(handler));
    }

    /// The contract holds exactly what teachers still have in escrow.
    function invariant_holdsExactlyTheSumOfBalances() public view {
        uint256 sum;
        for (uint256 i; i < 3; i++) {
            (uint256 balance,,,,,,) = rewards.teacher(handler.teachers(i));
            sum += balance;
        }
        assertEq(eurc.balanceOf(address(rewards)), sum);
    }

    /// Nothing leaves that did not come in.
    function invariant_conservation() public view {
        assertEq(handler.deposited(), eurc.balanceOf(address(rewards)) + handler.paidOut() + handler.withdrawn());
    }

    /// No teacher ever pays out more than they deposited.
    function invariant_noTeacherPaysForAnother() public view {
        for (uint256 i; i < 3; i++) {
            address t = handler.teachers(i);
            assertLe(handler.outflowOf(t), handler.depositedBy(t));
        }
    }
}
