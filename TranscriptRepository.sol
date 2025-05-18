// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EcoToken is ERC20, AccessControl {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    // Mapping of user => total eco-actions approved
    mapping(address => uint256) public actionsApproved;

    // Event when a user is rewarded
    event TokensMinted(address indexed user, uint256 amount, string activityType);

    constructor() ERC20("EcoToken", "ECO") {
        // Grant admin role to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Grant validator role to deployer
        _grantRole(VALIDATOR_ROLE, msg.sender);
    }

    /**
     * @dev Validator mints tokens to user after verifying eco-friendly activity
     * @param user address of user who performed the activity
     * @param amount number of tokens to mint
     * @param activityType description of activity (e.g. "Recycling", "Biking")
     */
    function rewardUser(address user, uint256 amount, string calldata activityType) external onlyRole(VALIDATOR_ROLE) {
        require(user != address(0), "Invalid address");
        require(amount > 0, "Invalid amount");

        _mint(user, amount);
        actionsApproved[user] += 1;

        emit TokensMinted(user, amount, activityType);
    }

    /**
     * @dev Admin can assign validator role
     */
    function addValidator(address validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, validator);
    }

    /**
     * @dev Admin can revoke validator role
     */
    function removeValidator(address validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VALIDATOR_ROLE, validator);
    }
}
