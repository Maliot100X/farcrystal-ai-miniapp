import { expect } from "chai";
import { ethers } from "hardhat";
import { FarcrystalToken } from "../typechain-types";

describe("FarcrystalToken", function () {
  let token: FarcrystalToken;
  let owner: any;
  let agent: any;
  let user: any;

  beforeEach(async function () {
    [owner, agent, user] = await ethers.getSigners();

    const FarcrystalToken = await ethers.getContractFactory("FarcrystalToken");
    token = await FarcrystalToken.deploy(
      "Test Token",
      "TEST",
      1000000, // 1M supply
      "Test token description",
      "https://example.com/image.png",
      agent.address,
      "hodl"
    );
    
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct metadata", async function () {
      expect(await token.name()).to.equal("Test Token");
      expect(await token.symbol()).to.equal("TEST");
      expect(await token.tokenDescription()).to.equal("Test token description");
      expect(await token.imageURI()).to.equal("https://example.com/image.png");
    });

    it("Should mint initial supply to owner", async function () {
      const balance = await token.balanceOf(owner.address);
      expect(balance).to.equal(ethers.parseEther("1000000"));
    });

    it("Should set AI agent correctly", async function () {
      const agentInfo = await token.getAgentInfo();
      expect(agentInfo.agentAddress).to.equal(agent.address);
      expect(agentInfo.strategy).to.equal("hodl");
      expect(agentInfo.isActive).to.be.true;
    });
  });

  describe("AI Agent", function () {
    it("Should allow owner to toggle agent", async function () {
      await token.toggleAgent(false);
      const agentInfo = await token.getAgentInfo();
      expect(agentInfo.isActive).to.be.false;
    });

    it("Should allow agent to call functions", async function () {
      // Test agent-specific logic
      const tx = await token.connect(agent).transfer(user.address, ethers.parseEther("100"));
      await tx.wait();
      
      const agentInfo = await token.getAgentInfo();
      expect(agentInfo.tradesExecuted).to.equal(1);
    });
  });
});
