// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {OpenMacroRewards} from "../src/OpenMacroRewards.sol";

/**
 * Deploy OpenMacroRewards.
 *
 *   EURC_ADDRESS     the EURC token on the target chain
 *   REWARDS_SIGNER   address of the key the web server signs statements with
 *   REWARDS_OWNER    who may rotate the signer (a multisig on mainnet)
 *
 *   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast \
 *     --private-key "$DEPLOYER_PRIVATE_KEY"
 */
contract Deploy is Script {
    /// @notice Circle's EURC on Base Sepolia and Base mainnet.
    address internal constant EURC_BASE_SEPOLIA = 0x808456652fdb597867f38412077A9182bf77359F;
    address internal constant EURC_BASE = 0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42;

    function run() external returns (OpenMacroRewards rewards) {
        address eurc = vm.envOr("EURC_ADDRESS", _defaultEurc());
        address signer = vm.envAddress("REWARDS_SIGNER");
        address owner = vm.envAddress("REWARDS_OWNER");
        require(eurc != address(0), "No EURC address for this chain; set EURC_ADDRESS.");

        vm.startBroadcast();
        rewards = new OpenMacroRewards(IERC20(eurc), signer, owner);
        vm.stopBroadcast();

        console.log("OpenMacroRewards", address(rewards));
        console.log("token", eurc);
        console.log("signer", signer);
        console.log("owner", owner);
    }

    function _defaultEurc() internal view returns (address) {
        if (block.chainid == 84532) return EURC_BASE_SEPOLIA;
        if (block.chainid == 8453) return EURC_BASE;
        return address(0);
    }
}
