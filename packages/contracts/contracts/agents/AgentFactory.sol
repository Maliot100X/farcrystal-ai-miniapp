// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../tokens/FarcrystalToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentFactory
 * @dev Factory for creating tokens with integrated AI agents
 */
contract AgentFactory is Ownable {
    
    // Token creation fee (0.01 ETH)
    uint256 public creationFee = 0.01 ether;
    
    // Platform fee (2.5% of trades)
    uint256 public platformFee = 250; // basis points
    
    // Treasury address
    address public treasury;
    
    // Deployed tokens
    struct TokenInfo {
        address token;
        address creator;
        uint256 createdAt;
        string name;
        string symbol;
        bool isActive;
    }
    
    TokenInfo[] public tokens;
    mapping(address => address[]) public creatorTokens;
    
    // Pre-registered AI agents
    struct RegisteredAgent {
        string name;
        string strategy;
        address implementation;
        bool isActive;
    }
    
    RegisteredAgent[] public registeredAgents;
    
    // Events
    event TokenCreated(
        address indexed token,
        address indexed creator,
        string name,
        string symbol
    );
    event CreationFeeUpdated(uint256 newFee);
    event PlatformFeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);
    event AgentRegistered(uint256 indexed agentId, string name, string strategy);
    
    constructor(address _treasury) Ownable(msg.sender) {
        treasury = _treasury;
        
        // Register default agents
        registeredAgents.push(RegisteredAgent({
            name: "HODL Master",
            strategy: "hodl",
            implementation: address(0),
            isActive: true
        }));
        
        registeredAgents.push(RegisteredAgent({
            name: "Day Trader",
            strategy: "trader",
            implementation: address(0),
            isActive: true
        }));
        
        registeredAgents.push(RegisteredAgent({
            name: "Growth Hacker",
            strategy: "growth",
            implementation: address(0),
            isActive: true
        }));
    }
    
    /**
     * @dev Create new token with AI agent
     */
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        string memory description,
        string memory imageURI,
        uint256 agentId
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient creation fee");
        require(agentId < registeredAgents.length, "Invalid agent");
        require(registeredAgents[agentId].isActive, "Agent not active");
        
        RegisteredAgent memory agent = registeredAgents[agentId];
        
        // Deploy token with AI agent
        FarcrystalToken token = new FarcrystalToken(
            name,
            symbol,
            initialSupply,
            description,
            imageURI,
            agent.implementation != address(0) ? agent.implementation : address(this),
            agent.strategy
        );
        
        // Transfer tokens to creator
        token.transfer(msg.sender, initialSupply * 10 ** token.decimals());
        
        // Record token info
        TokenInfo memory info = TokenInfo({
            token: address(token),
            creator: msg.sender,
            createdAt: block.timestamp,
            name: name,
            symbol: symbol,
            isActive: true
        });
        
        tokens.push(info);
        creatorTokens[msg.sender].push(address(token));
        
        // Send fee to treasury
        (bool success, ) = treasury.call{value: creationFee}("");
        require(success, "Fee transfer failed");
        
        // Refund excess
        if (msg.value > creationFee) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - creationFee}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit TokenCreated(address(token), msg.sender, name, symbol);
        
        return address(token);
    }
    
    /**
     * @dev Register new AI agent
     */
    function registerAgent(
        string memory name,
        string memory strategy,
        address implementation
    ) external onlyOwner {
        uint256 id = registeredAgents.length;
        registeredAgents.push(RegisteredAgent({
            name: name,
            strategy: strategy,
            implementation: implementation,
            isActive: true
        }));
        
        emit AgentRegistered(id, name, strategy);
    }
    
    /**
     * @dev Get token count
     */
    function getTokenCount() external view returns (uint256) {
        return tokens.length;
    }
    
    /**
     * @dev Get creator's tokens
     */
    function getCreatorTokens(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }
    
    /**
     * @dev Update creation fee
     */
    function setCreationFee(uint256 newFee) external onlyOwner {
        creationFee = newFee;
        emit CreationFeeUpdated(newFee);
    }
    
    /**
     * @dev Update platform fee
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    /**
     * @dev Update treasury
     */
    function setTreasury(address newTreasury) external onlyOwner {
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }
    
    /**
     * @dev Get all registered agents
     */
    function getRegisteredAgents() external view returns (RegisteredAgent[] memory) {
        return registeredAgents;
    }
    
    /**
     * @dev Withdraw stuck funds
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {}
}
