// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FarcrystalToken
 * @dev ERC20 token with integrated AI agent management
 */
contract FarcrystalToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    
    // Token metadata
    string public tokenDescription;
    string public imageURI;
    
    // AI Agent configuration
    struct AIAgent {
        address agentAddress;
        string strategy;
        bool isActive;
        uint256 activationTime;
        uint256 tradesExecuted;
        uint256 profitLoss;
    }
    
    AIAgent public aiAgent;
    
    // Trading parameters
    uint256 public maxTransactionAmount;
    uint256 public maxWalletAmount;
    bool public tradingEnabled;
    
    // Events
    event AIAgentActivated(address indexed agent, string strategy);
    event AIAgentDeactivated(address indexed agent);
    event AIAgentTrade(address indexed agent, string action, uint256 amount);
    event TradingEnabled();
    event TradingDisabled();
    
    // Modifiers
    modifier onlyAgent() {
        require(msg.sender == aiAgent.agentAddress, "Only AI agent");
        _;
    }
    
    modifier onlyOwnerOrAgent() {
        require(
            msg.sender == owner() || msg.sender == aiAgent.agentAddress,
            "Only owner or agent"
        );
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        string memory description,
        string memory image,
        address agentAddress,
        string memory strategy
    ) ERC20(name, symbol) ERC20Permit(name) Ownable(msg.sender) {
        tokenDescription = description;
        imageURI = image;
        
        // Configure AI agent
        aiAgent = AIAgent({
            agentAddress: agentAddress,
            strategy: strategy,
            isActive: true,
            activationTime: block.timestamp,
            tradesExecuted: 0,
            profitLoss: 0
        });
        
        // Mint initial supply
        _mint(msg.sender, initialSupply * 10 ** decimals());
        
        // Set default limits (5% of supply)
        maxTransactionAmount = (initialSupply * 10 ** decimals()) / 20;
        maxWalletAmount = (initialSupply * 10 ** decimals()) / 20;
        
        // Enable trading
        tradingEnabled = true;
        
        emit AIAgentActivated(agentAddress, strategy);
        emit TradingEnabled();
    }
    
    /**
     * @dev Override transfer to add AI agent trading logic
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._update(from, to, amount);
        
        // If AI agent is sending tokens, record trade
        if (from == aiAgent.agentAddress && aiAgent.isActive) {
            aiAgent.tradesExecuted++;
            emit AIAgentTrade(aiAgent.agentAddress, "sell", amount);
        }
        
        // If AI agent is receiving tokens, record trade
        if (to == aiAgent.agentAddress && aiAgent.isActive) {
            emit AIAgentTrade(aiAgent.agentAddress, "buy", amount);
        }
    }
    
    /**
     * @dev Update AI agent configuration
     */
    function updateAgent(
        address newAgent,
        string memory newStrategy
    ) external onlyOwner {
        aiAgent.agentAddress = newAgent;
        aiAgent.strategy = newStrategy;
        emit AIAgentActivated(newAgent, newStrategy);
    }
    
    /**
     * @dev Toggle AI agent active status
     */
    function toggleAgent(bool active) external onlyOwnerOrAgent {
        aiAgent.isActive = active;
        if (active) {
            emit AIAgentActivated(aiAgent.agentAddress, aiAgent.strategy);
        } else {
            emit AIAgentDeactivated(aiAgent.agentAddress);
        }
    }
    
    /**
     * @dev Update agent performance metrics
     */
    function updateAgentMetrics(
        uint256 trades,
        uint256 pnl
    ) external onlyOwner {
        aiAgent.tradesExecuted = trades;
        aiAgent.profitLoss = pnl;
    }
    
    /**
     * @dev Toggle trading
     */
    function setTradingEnabled(bool enabled) external onlyOwner {
        tradingEnabled = enabled;
        if (enabled) {
            emit TradingEnabled();
        } else {
            emit TradingDisabled();
        }
    }
    
    /**
     * @dev Update transaction limits
     */
    function setTransactionLimits(
        uint256 maxTx,
        uint256 maxWallet
    ) external onlyOwner {
        maxTransactionAmount = maxTx;
        maxWalletAmount = maxWallet;
    }
    
    /**
     * @dev Update token metadata
     */
    function updateMetadata(
        string memory newDescription,
        string memory newImage
    ) external onlyOwner {
        tokenDescription = newDescription;
        imageURI = newImage;
    }
    
    /**
     * @dev Get AI agent info
     */
    function getAgentInfo() external view returns (AIAgent memory) {
        return aiAgent;
    }
    
    /**
     * @dev Burn tokens (anyone can burn their own)
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
    }
    
    /**
     * @dev Burn from (with allowance)
     */
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
    }
}
