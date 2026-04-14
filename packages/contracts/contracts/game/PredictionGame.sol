// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PredictionGame
 * @dev P2E game: Predict AI agent trades
 */
contract PredictionGame is Ownable, ReentrancyGuard {
    
    struct Game {
        uint256 id;
        address targetAgent;
        uint256 startTime;
        uint256 endTime;
        uint256 rewardPool;
        bool resolved;
        string winningOutcome;
        uint256 totalPredictions;
    }
    
    struct Prediction {
        address predictor;
        string outcome; // e.g., "up", "down"
        uint256 amount;
        uint256 timestamp;
    }
    
    // Games
    Game[] public games;
    mapping(uint256 => Prediction[]) public gamePredictions;
    mapping(uint256 => mapping(address => Prediction)) public userPredictions;
    
    // Fees
    uint256 public entryFee = 0.001 ether;
    uint256 public platformFee = 500; // 5%
    address public treasury;
    
    // Events
    event GameCreated(uint256 indexed gameId, address targetAgent, uint256 endTime);
    event PredictionMade(uint256 indexed gameId, address predictor, string outcome, uint256 amount);
    event GameResolved(uint256 indexed gameId, string winningOutcome);
    event RewardsClaimed(uint256 indexed gameId, address winner, uint256 amount);
    
    constructor(address _treasury) Ownable(msg.sender) {
        treasury = _treasury;
    }
    
    /**
     * @dev Create new prediction game
     */
    function createGame(
        address targetAgent,
        uint256 duration,
        uint256 initialReward
    ) external payable onlyOwner returns (uint256) {
        require(msg.value >= initialReward, "Insufficient reward");
        
        uint256 gameId = games.length;
        
        games.push(Game({
            id: gameId,
            targetAgent: targetAgent,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            rewardPool: initialReward,
            resolved: false,
            winningOutcome: "",
            totalPredictions: 0
        }));
        
        emit GameCreated(gameId, targetAgent, block.timestamp + duration);
        
        return gameId;
    }
    
    /**
     * @dev Make prediction
     */
    function predict(
        uint256 gameId,
        string memory outcome
    ) external payable nonReentrant {
        require(msg.value >= entryFee, "Insufficient entry fee");
        require(gameId < games.length, "Invalid game");
        
        Game storage game = games[gameId];
        require(block.timestamp < game.endTime, "Game ended");
        require(!game.resolved, "Game resolved");
        require(
            userPredictions[gameId][msg.sender].predictor == address(0),
            "Already predicted"
        );
        
        // Record prediction
        Prediction memory prediction = Prediction({
            predictor: msg.sender,
            outcome: outcome,
            amount: msg.value,
            timestamp: block.timestamp
        });
        
        gamePredictions[gameId].push(prediction);
        userPredictions[gameId][msg.sender] = prediction;
        game.rewardPool += msg.value;
        game.totalPredictions++;
        
        emit PredictionMade(gameId, msg.sender, outcome, msg.value);
    }
    
    /**
     * @dev Resolve game and set winner
     */
    function resolveGame(
        uint256 gameId,
        string memory winningOutcome
    ) external onlyOwner {
        require(gameId < games.length, "Invalid game");
        
        Game storage game = games[gameId];
        require(block.timestamp >= game.endTime, "Game not ended");
        require(!game.resolved, "Already resolved");
        
        game.resolved = true;
        game.winningOutcome = winningOutcome;
        
        emit GameResolved(gameId, winningOutcome);
    }
    
    /**
     * @dev Claim rewards
     */
    function claimRewards(uint256 gameId) external nonReentrant {
        require(gameId < games.length, "Invalid game");
        
        Game storage game = games[gameId];
        require(game.resolved, "Not resolved");
        
        Prediction storage userPred = userPredictions[gameId][msg.sender];
        require(userPred.predictor != address(0), "No prediction");
        
        string memory prediction = userPred.outcome;
        require(
            keccak256(bytes(prediction)) == keccak256(bytes(game.winningOutcome)),
            "Not a winner"
        );
        
        // Calculate reward share
        uint256 winnersShare = game.rewardPool * (10000 - platformFee) / 10000;
        uint256 winnerCount = 0;
        
        for (uint i = 0; i < gamePredictions[gameId].length; i++) {
            if (keccak256(bytes(gamePredictions[gameId][i].outcome)) == keccak256(bytes(game.winningOutcome))) {
                winnerCount++;
            }
        }
        
        require(winnerCount > 0, "No winners");
        
        uint256 reward = winnersShare / winnerCount;
        
        // Clear prediction to prevent re-entry
        userPred.predictor = address(0);
        
        // Send reward
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed");
        
        emit RewardsClaimed(gameId, msg.sender, reward);
    }
    
    /**
     * @dev Get game count
     */
    function getGameCount() external view returns (uint256) {
        return games.length;
    }
    
    /**
     * @dev Get predictions for a game
     */
    function getPredictions(uint256 gameId) external view returns (Prediction[] memory) {
        return gamePredictions[gameId];
    }
    
    /**
     * @dev Update entry fee
     */
    function setEntryFee(uint256 newFee) external onlyOwner {
        entryFee = newFee;
    }
    
    /**
     * @dev Update platform fee
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high");
        platformFee = newFee;
    }
    
    /**
     * @dev Emergency withdraw
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = treasury.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {}
}
