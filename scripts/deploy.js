const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contract with account: ${deployer.address}`);

  const EcoToken = await ethers.getContractFactory("EcoToken");
  const ecoToken = await EcoToken.deploy();

  await ecoToken.waitForDeployment();

  console.log(`EcoToken deployed to: ${ecoToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
