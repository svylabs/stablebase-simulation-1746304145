import { ethers } from "hardhat";
import fs from "fs";

// Import contract artifact paths from the provided mapping
const artifactPaths = {
  "DFIDToken": "../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json",
  "DFIREStaking": "../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json",
  "DFIREToken": "../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json",
  "MockPriceOracle": "../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json",
  "OrderedDoublyLinkedList": "../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json",
  "StabilityPool": "../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json",
  "StableBaseCDP": "../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json",
};

// Dynamically import contract ABIs using artifact paths
const loadContractArtifact = async (contractName: string) => {
  const artifactPath = artifactPaths[contractName];
  if (!artifactPath) {
    throw new Error(`Artifact path not found for contract: ${contractName}`);
  }
  const artifact = JSON.parse(
    fs.readFileSync(artifactPath, 'utf8')
  );
  return artifact;
};


export async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contracts: { [name: string]: any } = {};

  // Deploy DFIDToken
  const DFIDTokenArtifact = await loadContractArtifact("DFIDToken");
  const DFIDTokenFactory = new ethers.ContractFactory(
    DFIDTokenArtifact.abi,
    DFIDTokenArtifact.bytecode,
    deployer
  );
  contracts['dfidToken'] = await DFIDTokenFactory.deploy();
  await contracts['dfidToken'].waitForDeployment();
  console.log("DFIDToken deployed to:", contracts['dfidToken'].target);

  // Deploy DFIREToken
  const DFIRETokenArtifact = await loadContractArtifact("DFIREToken");
  const DFIRETokenFactory = new ethers.ContractFactory(
    DFIRETokenArtifact.abi,
    DFIRETokenArtifact.bytecode,
    deployer
  );
  contracts['dfireToken'] = await DFIRETokenFactory.deploy();
  await contracts['dfireToken'].waitForDeployment();
  console.log("DFIREToken deployed to:", contracts['dfireToken'].target);

  // Deploy MockPriceOracle
  const MockPriceOracleArtifact = await loadContractArtifact("MockPriceOracle");
  const MockPriceOracleFactory = new ethers.ContractFactory(
    MockPriceOracleArtifact.abi,
    MockPriceOracleArtifact.bytecode,
    deployer
  );
  contracts['mockPriceOracle'] = await MockPriceOracleFactory.deploy();
  await contracts['mockPriceOracle'].waitForDeployment();
  console.log("MockPriceOracle deployed to:", contracts['mockPriceOracle'].target);

  // Deploy DFIREStaking
  const DFIREStakingArtifact = await loadContractArtifact("DFIREStaking");
  const DFIREStakingFactory = new ethers.ContractFactory(
    DFIREStakingArtifact.abi,
    DFIREStakingArtifact.bytecode,
    deployer
  );
  contracts['dfireStaking'] = await DFIREStakingFactory.deploy(true);
  await contracts['dfireStaking'].waitForDeployment();
  console.log("DFIREStaking deployed to:", contracts['dfireStaking'].target);

  // Deploy OrderedDoublyLinkedList (Liquidation Queue)
  const OrderedDoublyLinkedListArtifact = await loadContractArtifact("OrderedDoublyLinkedList");
  const LiquidationQueueFactory = new ethers.ContractFactory(
    OrderedDoublyLinkedListArtifact.abi,
    OrderedDoublyLinkedListArtifact.bytecode,
    deployer
  );
  contracts['liquidationQueue'] = await LiquidationQueueFactory.deploy();
  await contracts['liquidationQueue'].waitForDeployment();
  console.log("LiquidationQueue deployed to:", contracts['liquidationQueue'].target);

  // Deploy OrderedDoublyLinkedList (Redemption Queue)
  const RedemptionQueueFactory = new ethers.ContractFactory(
    OrderedDoublyLinkedListArtifact.abi,
    OrderedDoublyLinkedListArtifact.bytecode,
    deployer
  );
  contracts['redemptionQueue'] = await RedemptionQueueFactory.deploy();
  await contracts['redemptionQueue'].waitForDeployment();
  console.log("RedemptionQueue deployed to:", contracts['redemptionQueue'].target);

  // Deploy StabilityPool
  const StabilityPoolArtifact = await loadContractArtifact("StabilityPool");
    const StabilityPoolFactory = new ethers.ContractFactory(
        StabilityPoolArtifact.abi,
        StabilityPoolArtifact.bytecode,
        deployer
    );
  contracts['stabilityPool'] = await StabilityPoolFactory.deploy(true);
  await contracts['stabilityPool'].waitForDeployment();
  console.log("StabilityPool deployed to:", contracts['stabilityPool'].target);

  // Deploy StableBaseCDP
  const StableBaseCDPArtifact = await loadContractArtifact("StableBaseCDP");
  const StableBaseCDPFactory = new ethers.ContractFactory(
    StableBaseCDPArtifact.abi,
    StableBaseCDPArtifact.bytecode,
    deployer
  );
  contracts['stableBaseCDP'] = await StableBaseCDPFactory.deploy();
  await contracts['stableBaseCDP'].waitForDeployment();
  console.log("StableBaseCDP deployed to:", contracts['stableBaseCDP'].target);

  // Set Addresses on StableBaseCDP
  let tx = await contracts['stableBaseCDP'].connect(deployer).setAddresses(
    contracts['dfidToken'].target,
    contracts['mockPriceOracle'].target,
    contracts['stabilityPool'].target,
    contracts['dfireStaking'].target,
    contracts['liquidationQueue'].target,
    contracts['redemptionQueue'].target
  );
  await tx.wait();
  console.log("StableBaseCDP setAddresses completed");

  // Set Addresses on DFIDToken
  tx = await contracts['dfidToken'].connect(deployer).setAddresses(contracts['stableBaseCDP'].target);
  await tx.wait();
  console.log("DFIDToken setAddresses completed");

  // Set Addresses on DFIREToken
  tx = await contracts['dfireToken'].connect(deployer).setAddresses(contracts['stabilityPool'].target);
  await tx.wait();
  console.log("DFIREToken setAddresses completed");

  // Set Addresses on DFIREStaking
  tx = await contracts['dfireStaking'].connect(deployer).setAddresses(
    contracts['dfireToken'].target,
    contracts['dfireToken'].target,
    contracts['stableBaseCDP'].target
  );
  await tx.wait();
  console.log("DFIREStaking setAddresses completed");

  // Set Addresses on StabilityPool
  tx = await contracts['stabilityPool'].connect(deployer).setAddresses(
    contracts['dfidToken'].target,
    contracts['stableBaseCDP'].target,
    contracts['dfireToken'].target
  );
  await tx.wait();
  console.log("StabilityPool setAddresses completed");

  // Set Addresses on LiquidationQueue
  tx = await contracts['liquidationQueue'].connect(deployer).setAddresses(contracts['stableBaseCDP'].target);
  await tx.wait();
  console.log("LiquidationQueue setAddresses completed");

  // Set Addresses on RedemptionQueue
  tx = await contracts['redemptionQueue'].connect(deployer).setAddresses(contracts['stableBaseCDP'].target);
  await tx.wait();
  console.log("RedemptionQueue setAddresses completed");

  return contracts;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.  Not needed for corrected code.
async function main() {
  try {
    await deployContracts();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
