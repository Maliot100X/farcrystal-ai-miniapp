// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GameManager
 * @dev Manages play-to-earn games
 */
contract GameManager is Ownable, ReentrancyGuard {
    
    struct Game {
        bytes32 id;
        string gameType;
        string title;
        uint256 rewardPool;
        uint256 entryFee;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 participantCount;
    }
    
    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 gamesWon;
        uint256 totalEarnings;
        uint256 currentStreak;
    }
    
    // State
    mapping(bytes32 => Game) public games;
    mapping(address => PlayerStats) public playerStats;
    mapping(bytes32 => mapping(address => bool)) public hasParticipated;
    mapping(bytes32 => address[]) public gameParticipants;
    
    bytes32[] public activeGames;
    
    uint256 public platformFee = 5; // 5%
    uint256 public minEntryFee = 0.001 ether;
    
    address public rewardToken;
    
    // Events
    event GameCreated(bytes32 indexed gameId, string gameType, uint256 reward);
    event GameJoined(bytes32 indexed gameId, address indexed player);
    event RewardClaimed(bytes32 indexed gameId, address indexed player, uint256 amount);
    event PlayerStatsUpdated(address indexed player, uint256 earnings);
    
    constructor(address rewardToken_) {
        rewardToken = rewardToken_;
    }
    
    /**
     * @dev Create new game
     */
    function createGame(
        string memory gameType,
        string memory title,
        uint256 rewardPool,
        uint256 entryFee,
        uint256 duration
    ) external onlyOwner returns (bytes32 gameId) {
        require(entryFee >= minEntryFee, "Entry fee too low");
        require(rewardPool > 0, "Reward pool required");
        
        gameId = keccak256(abi.encodePacked(
            gameType,
            title,
            block.timestamp,
            block.number
        ));
        
        games[gameId] = Game({
            id: gameId,
            gameType: gameType,
            title: title,
            rewardPool: rewardPool,
            entryFee: entryFee,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            active: true,
            participantCount: 0
        });
        
        activeGames.push(gameId);
        
        emit GameCreated(gameId, gameType, rewardPool);
        
        return gameId;
    }
    
    /**
     * @dev Join a game
     */
    function joinGame(bytes32 gameId) external payable nonReentrant {
        Game storage game = games[gameId];
        
        require(game.active, "Game not active");
        require(block.timestamp < game.endTime, "Game ended");
        require(!hasParticipated[gameId][msg.sender], "Already joined");
        require(msg.value >= game.entryFee, "Insufficient entry fee");
        
        hasParticipated[gameId][msg.sender] = true;
        gameParticipants[gameId].push(msg.sender);
        game.participantCount++;
        
        // Refund excess
        if (msg.value > game.entryFee) {
            payable(msg.sender).transfer(msg.value - game.entryFee);
        }
        
        emit GameJoined(gameId, msg.sender);
    }
    
    /**
     * @dev Distribute rewards (called by oracle/backend)
     */
    function distributeRewards(
        bytes32 gameId,
        address[] memory winners,
        uint256[] memory amounts
    ) external onlyOwner nonReentrant {
        Game storage game = games[gameId];
        require(!game.active, "Game still active");
        require(winners.length == amounts.length, "Length mismatch");
        
        uint256 totalDistributed = 0;
        
        for (uint256 i = 0; i < winners.length; i++) {
            address winner = winners[i];
            uint256 amount = amounts[i];
            
            // Update player stats
            PlayerStats storage stats = playerStats[winner];
            stats.gamesWon++;
            stats.totalEarnings += amount;
            stats.currentStreak++;
            
            totalDistributed += amount;
            
            // Transfer reward
            (bool success, ) = payable(winner).call{value: amount}("");
            require(success, "Transfer failed");
            
            emit RewardClaimed(gameId, winner, amount);
            emit PlayerStatsUpdated(winner, stats.totalEarnings);
        }
        
        require(totalDistributed <= game.rewardPool, "Exceeds pool");
    }
    
    /**
     * @dev Get player rank on leaderboard
     */
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory players,
        uint256[] memory earnings
    ) {
        // Simplified: return top players by earnings
        // In production, use merkle proofs or off-chain indexing
        players = new address[](limit);
        earnings = new uint256[](limit);
        
        // Placeholder implementation
        return (players, earnings);
    }
    
    /**
     * @dev Get player stats
     */
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    /**
     * @dev End game
     */
    function endGame(bytes32 gameId) external onlyOwner {
        Game storage game = games[gameId];
        game.active = false;
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        payable(owner()).transfer(balance);
    }
    
    receive() external payable {}
}
