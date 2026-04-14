// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title FarcasterToken
 * @dev ERC20 token with Farcaster social features
 */
contract FarcasterToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    
    // Farcaster integration
    uint256 public creatorFid;
    string public farcasterUsername;
    
    // Social features
    mapping(address => uint256) public socialScore;
    mapping(bytes32 => bool) public castRewardsClaimed;
    
    // Token economics
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public rewardPool;
    
    // Events
    event SocialReward(address indexed user, uint256 amount, bytes32 castHash);
    event SocialScoreUpdated(address indexed user, uint256 newScore);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 creatorFid_,
        string memory farcasterUsername_,
        address creator
    ) ERC20(name, symbol) Ownable(creator) ERC20Permit(name) {
        require(initialSupply <= MAX_SUPPLY, "Exceeds max supply");
        
        creatorFid = creatorFid_;
        farcasterUsername = farcasterUsername_;
        
        // Mint initial supply to creator
        _mint(creator, initialSupply);
        
        // 10% of supply goes to reward pool
        rewardPool = initialSupply / 10;
    }
    
    /**
     * @dev Claim reward for viral cast
     */
    function claimCastReward(bytes32 castHash, uint256 engagementScore) external {
        require(!castRewardsClaimed[castHash], "Reward already claimed");
        require(engagementScore > 0, "Invalid score");
        
        castRewardsClaimed[castHash] = true;
        
        // Calculate reward based on engagement
        uint256 reward = calculateReward(engagementScore);
        require(reward <= rewardPool, "Insufficient reward pool");
        
        rewardPool -= reward;
        _mint(msg.sender, reward);
        
        // Update social score
        socialScore[msg.sender] += engagementScore;
        
        emit SocialReward(msg.sender, reward, castHash);
        emit SocialScoreUpdated(msg.sender, socialScore[msg.sender]);
    }
    
    /**
     * @dev Calculate reward based on engagement
     */
    function calculateReward(uint256 engagementScore) public pure returns (uint256) {
        // Logarithmic scaling for fair distribution
        if (engagementScore < 100) {
            return 1000 * 10**18; // 1K tokens
        } else if (engagementScore < 1000) {
            return 10000 * 10**18; // 10K tokens
        } else if (engagementScore < 10000) {
            return 100000 * 10**18; // 100K tokens
        } else {
            return 500000 * 10**18; // 500K tokens max
        }
    }
    
    /**
     * @dev Get social stats for user
     */
    function getSocialStats(address user) external view returns (
        uint256 score,
        uint256 balance
    ) {
        return (socialScore[user], balanceOf(user));
    }
}
