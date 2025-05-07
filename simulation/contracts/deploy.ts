import { ethers } from "hardhat";
import fs from "fs";

// Mapping of artifact import paths
const artifactPaths = {
  "DFIDToken": "../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json",
  "DFIREStaking": "../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json",
  "DFIREToken": "../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json",
  "MockPriceOracle": "../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json",
  "OrderedDoublyLinkedList": "../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json",
  "StabilityPool": "../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json",
  "StableBaseCDP": "../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json",
};

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contracts: { [key: string]: any } = {};

  // Helper function to deploy contracts and wait for deployment
  async function deployContract(contractName: string, constructorArgs: any[] = []) {
    console.log(`Deploying ${contractName}...`);
    const artifactPath = artifactPaths[contractName];
    if (!artifactPath) {
      throw new Error(`Artifact path not found for ${contractName}`);
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment();
    console.log(`${contractName} deployed to:`, contract.target);
    contracts[contractName] = contract;
    return contract;
  }

  // Deploy DFIDToken
  await deployContract("DFIDToken");

  // Deploy DFIREToken
  await deployContract("DFIREToken");

  // Deploy MockPriceOracle
  await deployContract("MockPriceOracle");

  // Deploy DFIREStaking
  await deployContract("DFIREStaking", [true]);

  // Deploy OrderedDoublyLinkedList (liquidationQueue)
  await deployContract("OrderedDoublyLinkedList");

  // Deploy OrderedDoublyLinkedList (redemptionQueue)
  await deployContract("OrderedDoublyLinkedList");

  // Deploy StabilityPool
  await deployContract("StabilityPool", [true]);

  // Deploy StableBaseCDP
  const stableBaseCDP = await deployContract("StableBaseCDP");

  // Call setAddresses on StableBaseCDP
  console.log("Calling setAddresses on StableBaseCDP...");
  let tx = await stableBaseCDP.setAddresses(
    contracts["DFIDToken"].target,
    contracts["MockPriceOracle"].target,
    contracts["StabilityPool"].target,
    contracts["DFIREStaking"].target,
    contracts["OrderedDoublyLinkedList"].target, // liquidationQueue
    contracts["OrderedDoublyLinkedList"].target  // redemptionQueue
  );
  await tx.wait();
  console.log("setAddresses on StableBaseCDP done.");

  // Call setAddresses on DFIDToken
  console.log("Calling setAddresses on DFIDToken...");
  tx = await contracts["DFIDToken"].setAddresses(stableBaseCDP.target);
  await tx.wait();
  console.log("setAddresses on DFIDToken done.");

  // Call setAddresses on DFIREToken
  console.log("Calling setAddresses on DFIREToken...");
  tx = await contracts["DFIREToken"].setAddresses(contracts["StabilityPool"].target);
  await tx.wait();
  console.log("setAddresses on DFIREToken done.");

  // Call setAddresses on DFIREStaking
  console.log("Calling setAddresses on DFIREStaking...");
  tx = await contracts["DFIREStaking"].setAddresses(
    contracts["DFIREToken"].target,
    contracts["DFIREToken"].target,
    stableBaseCDP.target
  );
  await tx.wait();
  console.log("setAddresses on DFIREStaking done.");

  // Call setAddresses on StabilityPool
  console.log("Calling setAddresses on StabilityPool...");
  tx = await contracts["StabilityPool"].setAddresses(
    contracts["DFIDToken"].target,
    stableBaseCDP.target,
    contracts["DFIREToken"].target
  );
  await tx.wait();
  console.log("setAddresses on StabilityPool done.");

  // Call setAddresses on liquidationQueue
  console.log("Calling setAddresses on liquidationQueue...");
  tx = await contracts["OrderedDoublyLinkedList"].setAddresses(stableBaseCDP.target);
  await tx.wait();
  console.log("setAddresses on liquidationQueue done.");

  // Call setAddresses on redemptionQueue
  console.log("Calling setAddresses on redemptionQueue...");
  tx = await contracts["OrderedDoublyLinkedList"].setAddresses(stableBaseCDP.target);
  await tx.wait();
  console.log("setAddresses on redemptionQueue done.");

  return contracts;
}

export { deployContracts };
