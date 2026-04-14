// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @dev Registry for all AI agents
 */
contract AgentRegistry {
    
    struct Agent {
        bytes32 id;
        address owner;
        string name;
        string agentType;
        string strategy;
        address tokenAddress;
        bool active;
        uint256 createdAt;
        uint256 lastAction;
        uint256 totalTrades;
        int256 totalProfit;
    }
    
    // State
    mapping(bytes32 => Agent) public agents;
    mapping(address => bytes32[]) public ownerAgents;
    bytes32[] public allAgentIds;
    
    address public factory;
    address public owner;
    
    // Events
    event AgentRegistered(bytes32 indexed agentId, address indexed owner);
    event AgentUpdated(bytes32 indexed agentId, string field);
    event AgentStatusChanged(bytes32 indexed agentId, bool active);
    
    modifier onlyFactory() {
        require(msg.sender == factory, "Not factory");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function setFactory(address factory_) external onlyOwner {
        factory = factory_;
    }
    
    /**
     * @dev Register new agent
     */
    function registerAgent(
        bytes32 id,
        address owner_,
        string memory name,
        string memory agentType,
        string memory strategy,
        address tokenAddress
    ) external onlyFactory {
        require(agents[id].id == bytes32(0), "Agent exists");
        
        Agent memory agent = Agent({
            id: id,
            owner: owner_,
            name: name,
            agentType: agentType,
            strategy: strategy,
            tokenAddress: tokenAddress,
            active: true,
            createdAt: block.timestamp,
            lastAction: block.timestamp,
            totalTrades: 0,
            totalProfit: 0
        });
        
        agents[id] = agent;
        ownerAgents[owner_].push(id);
        allAgentIds.push(id);
        
        emit AgentRegistered(id, owner_);
    }
    
    /**
     * @dev Update agent stats
     */
    function updateAgentStats(
        bytes32 agentId,
        uint256 trades,
        int256 profit
    ) external {
        Agent storage agent = agents[agentId];
        require(agent.id != bytes32(0), "Agent not found");
        
        agent.totalTrades += trades;
        agent.totalProfit += profit;
        agent.lastAction = block.timestamp;
    }
    
    /**
     * @dev Toggle agent status
     */
    function setAgentStatus(bytes32 agentId, bool active) external {
        Agent storage agent = agents[agentId];
        require(agent.owner == msg.sender, "Not owner");
        
        agent.active = active;
        emit AgentStatusChanged(agentId, active);
    }
    
    /**
     * @dev Get agent details
     */
    function getAgent(bytes32 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }
    
    /**
     * @dev Get agents by owner
     */
    function getOwnerAgents(address owner_) external view returns (bytes32[] memory) {
        return ownerAgents[owner_];
    }
    
    /**
     * @dev Get all active agents
     */
    function getActiveAgents() external view returns (bytes32[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < allAgentIds.length; i++) {
            if (agents[allAgentIds[i]].active) {
                activeCount++;
            }
        }
        
        bytes32[] memory active = new bytes32[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allAgentIds.length; i++) {
            if (agents[allAgentIds[i]].active) {
                active[index] = allAgentIds[i];
                index++;
            }
        }
        
        return active;
    }
}
