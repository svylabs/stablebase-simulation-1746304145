import { ethers } from "hardhat";

// Define the mapping type for contract addresses
interface ContractAddresses {
  [key: string]: string;
}

async function deployContracts(): Promise<ContractAddresses> {
  const contractAddresses: ContractAddresses = {};

  try {
    // Deploy DFIDToken
    const DFIDToken = await ethers.getContractFactory("DFIDToken");
    const dfidToken = await DFIDToken.deploy();
    await dfidToken.waitForDeployment();
    contractAddresses["dfidToken"] = await dfidToken.getAddress();

    // Deploy DFIREToken
    const DFIREToken = await ethers.getContractFactory("DFIREToken");
    const dfireToken = await DFIREToken.deploy();
    await dfireToken.waitForDeployment();
    contractAddresses["dfireToken"] = await dfireToken.getAddress();

    // Deploy MockPriceOracle
    const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
    const mockPriceOracle = await MockPriceOracle.deploy();
    await mockPriceOracle.waitForDeployment();
    contractAddresses["mockPriceOracle"] = await mockPriceOracle.getAddress();

    // Deploy DFIREStaking
    const DFIREStaking = await ethers.getContractFactory("DFIREStaking");
    const rewardSenderActive = true; // Set rewardSenderActive dynamically if needed
    const dfireStaking = await DFIREStaking.deploy(rewardSenderActive);
    await dfireStaking.waitForDeployment();
    contractAddresses["dfireStaking"] = await dfireStaking.getAddress();

    // Deploy OrderedDoublyLinkedList (liquidationQueue)
    const OrderedDoublyLinkedListLiquidation = await ethers.getContractFactory("OrderedDoublyLinkedList");
    const liquidationQueue = await OrderedDoublyLinkedListLiquidation.deploy();
    await liquidationQueue.waitForDeployment();
    contractAddresses["liquidationQueue"] = await liquidationQueue.getAddress();

    // Deploy OrderedDoublyLinkedList (redemptionQueue)
    const OrderedDoublyLinkedListRedemption = await ethers.getContractFactory("OrderedDoublyLinkedList");
    const redemptionQueue = await OrderedDoublyLinkedListRedemption.deploy();
    await redemptionQueue.waitForDeployment();
    contractAddresses["redemptionQueue"] = await redemptionQueue.getAddress();

    // Deploy StabilityPool
    const StabilityPool = await ethers.getContractFactory("StabilityPool");
    const stabilityPool = await StabilityPool.deploy(true);
    await stabilityPool.waitForDeployment();
    contractAddresses["stabilityPool"] = await stabilityPool.getAddress();

    // Deploy StableBaseCDP
    const StableBaseCDP = await ethers.getContractFactory("StableBaseCDP");
    const stableBaseCDP = await StableBaseCDP.deploy();
    await stableBaseCDP.waitForDeployment();
    contractAddresses["stableBaseCDP"] = await stableBaseCDP.getAddress();

    // Set Addresses on StableBaseCDP
    await stableBaseCDP.setAddresses(
      contractAddresses["dfidToken"],
      contractAddresses["mockPriceOracle"],
      contractAddresses["stabilityPool"],
      contractAddresses["dfireStaking"],
      contractAddresses["liquidationQueue"],
      contractAddresses["redemptionQueue"]
    );

    // Set Addresses on DFIDToken
    await dfidToken.setAddresses(contractAddresses["stableBaseCDP"]);

    // Set Addresses on DFIREToken
    await dfireToken.setAddresses(contractAddresses["stabilityPool"]);

    // Set Addresses on DFIREStaking
    await dfireStaking.setAddresses(
      contractAddresses["dfireToken"],
      contractAddresses["dfireToken"],
      contractAddresses["stableBaseCDP"]
    );

    // Set Addresses on StabilityPool
    await stabilityPool.setAddresses(
      contractAddresses["dfidToken"],
      contractAddresses["stableBaseCDP"],
      contractAddresses["dfireToken"]
    );

    // Set Addresses on liquidationQueue
    await liquidationQueue.setAddresses(contractAddresses["stableBaseCDP"]);

    // Set Addresses on redemptionQueue
    await redemptionQueue.setAddresses(contractAddresses["stableBaseCDP"]);

    return contractAddresses;
  } catch (error) {
    console.error("Deployment error:", error);
    throw error; // Re-throw the error to fail the deployment
  }
}

async function main() {
  try {
    const contractAddresses = await deployContracts();
    console.log("Contract Addresses:", contractAddresses);
  } catch (error) {
    console.error("Failed to deploy contracts", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export { deployContracts };