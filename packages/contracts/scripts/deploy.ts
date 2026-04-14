import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         FARCRYSTAL CONTRACTS DEPLOYMENT                   ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`🚀 Deploying with account: ${deployer.address}`);
  console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);
  console.log(`⛓️  Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log("");

  // Deploy AgentFactory
  console.log("📦 Deploying AgentFactory...");
  const AgentFactory = await ethers.getContractFactory("AgentFactory");
  const factory = await AgentFactory.deploy(deployer.address);
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log(`✅ AgentFactory deployed: ${factoryAddress}`);
  
  // Deploy PredictionGame
  console.log("📦 Deploying PredictionGame...");
  const PredictionGame = await ethers.getContractFactory("PredictionGame");
  const game = await PredictionGame.deploy(deployer.address);
  await game.waitForDeployment();
  
  const gameAddress = await game.getAddress();
  console.log(`✅ PredictionGame deployed: ${gameAddress}`);
  
  console.log("");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("✅ DEPLOYMENT COMPLETE");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("");
  console.log("📋 Contract Addresses:");
  console.log(`   AgentFactory:    ${factoryAddress}`);
  console.log(`   PredictionGame:  ${gameAddress}`);
  console.log("");
  console.log("⚠️  IMPORTANT: Save these addresses for your frontend!");
  console.log("");
  
  // Save to file
  const fs = require("fs");
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    factory: factoryAddress,
    game: gameAddress,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
