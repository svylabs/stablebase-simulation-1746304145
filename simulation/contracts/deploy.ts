import { ethers } from "hardhat";

const artifactPaths = {
  "DFIDToken": "../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json",
  "DFIREStaking": "../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json",
  "DFIREToken": "../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json",
  "MockPriceOracle": "../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json",
  "OrderedDoublyLinkedList": "../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json",
  "StabilityPool": "../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json",
  "StableBaseCDP": "../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json"
};

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contracts: { [key: string]: any } = {};

  // Deploy DFIDToken
  console.log("Deploying DFIDToken...");
  const DFIDTokenArtifact = require(artifactPaths.DFIDToken);
  const DFIDTokenFactory = new ethers.ContractFactory(DFIDTokenArtifact.abi, DFIDTokenArtifact.bytecode, deployer);
  const dfidToken = await DFIDTokenFactory.deploy();
  await dfidToken.waitForDeployment();
  contracts['dfidToken'] = dfidToken;
  console.log("DFIDToken deployed to:", dfidToken.target);

  // Deploy DFIREToken
  console.log("Deploying DFIREToken...");
  const DFIRETokenArtifact = require(artifactPaths.DFIREToken);
  const DFIRETokenFactory = new ethers.ContractFactory(DFIRETokenArtifact.abi, DFIRETokenArtifact.bytecode, deployer);
  const dfireToken = await DFIRETokenFactory.deploy();
  await dfireToken.waitForDeployment();
  contracts['dfireToken'] = dfireToken;
  console.log("DFIREToken deployed to:", dfireToken.target);

  // Deploy MockPriceOracle
  console.log("Deploying MockPriceOracle...");
  const MockPriceOracleArtifact = require(artifactPaths.MockPriceOracle);
  const MockPriceOracleFactory = new ethers.ContractFactory(MockPriceOracleArtifact.abi, MockPriceOracleArtifact.bytecode, deployer);
  const mockPriceOracle = await MockPriceOracleFactory.deploy();
  await mockPriceOracle.waitForDeployment();
  contracts['mockPriceOracle'] = mockPriceOracle;
  console.log("MockPriceOracle deployed to:", mockPriceOracle.target);

  // Deploy DFIREStaking
  console.log("Deploying DFIREStaking...");
  const DFIREStakingArtifact = require(artifactPaths.DFIREStaking);
  const DFIREStakingFactory = new ethers.ContractFactory(DFIREStakingArtifact.abi, DFIREStakingArtifact.bytecode, deployer);
  const dfireStaking = await DFIREStakingFactory.deploy(true);
  await dfireStaking.waitForDeployment();
  contracts['dfireStaking'] = dfireStaking;
  console.log("DFIREStaking deployed to:", dfireStaking.target);

  // Deploy OrderedDoublyLinkedList (liquidationQueue)
  console.log("Deploying liquidationQueue...");
  const OrderedDoublyLinkedListArtifact = require(artifactPaths.OrderedDoublyLinkedList);
  const OrderedDoublyLinkedListFactory = new ethers.ContractFactory(OrderedDoublyLinkedListArtifact.abi, OrderedDoublyLinkedListArtifact.bytecode, deployer);
  const liquidationQueue = await OrderedDoublyLinkedListFactory.deploy();
  await liquidationQueue.waitForDeployment();
  contracts['liquidationQueue'] = liquidationQueue;
  console.log("liquidationQueue deployed to:", liquidationQueue.target);

  // Deploy OrderedDoublyLinkedList (redemptionQueue)
  console.log("Deploying redemptionQueue...");
  const redemptionQueue = await OrderedDoublyLinkedListFactory.deploy();
  await redemptionQueue.waitForDeployment();
  contracts['redemptionQueue'] = redemptionQueue;
  console.log("redemptionQueue deployed to:", redemptionQueue.target);

  // Deploy StabilityPool
  console.log("Deploying StabilityPool...");
  const StabilityPoolArtifact = require(artifactPaths.StabilityPool);
  const StabilityPoolFactory = new ethers.ContractFactory(StabilityPoolArtifact.abi, StabilityPoolArtifact.bytecode, deployer);
  const stabilityPool = await StabilityPoolFactory.deploy(true);
  await stabilityPool.waitForDeployment();
  contracts['stabilityPool'] = stabilityPool;
  console.log("StabilityPool deployed to:", stabilityPool.target);

  // Deploy StableBaseCDP
  console.log("Deploying StableBaseCDP...");
  const StableBaseCDPArtifact = require(artifactPaths.StableBaseCDP);
  const StableBaseCDPFactory = new ethers.ContractFactory(StableBaseCDPArtifact.abi, StableBaseCDPArtifact.bytecode, deployer);
  const stableBaseCDP = await StableBaseCDPFactory.deploy();
  await stableBaseCDP.waitForDeployment();
  contracts['stableBaseCDP'] = stableBaseCDP;
  console.log("StableBaseCDP deployed to:", stableBaseCDP.target);

  // Call setAddresses functions
  console.log("Setting addresses on StableBaseCDP...");
  let tx = await stableBaseCDP.connect(deployer).setAddresses(
    dfidToken.target,
    mockPriceOracle.target,
    stabilityPool.target,
    dfireStaking.target,
    liquidationQueue.target,
    redemptionQueue.target
  );
  await tx.wait();

  console.log("Setting addresses on DFIDToken...");
  tx = await dfidToken.connect(deployer).setAddresses(stableBaseCDP.target);
  await tx.wait();

  console.log("Setting addresses on DFIREToken...");
  tx = await dfireToken.connect(deployer).setAddresses(stabilityPool.target);
  await tx.wait();

  console.log("Setting addresses on DFIREStaking...");
  tx = await dfireStaking.connect(deployer).setAddresses(dfireToken.target, dfireToken.target, stableBaseCDP.target);
  await tx.wait();

  console.log("Setting addresses on StabilityPool...");
  tx = await stabilityPool.connect(deployer).setAddresses(dfidToken.target, stableBaseCDP.target, dfireToken.target);
  await tx.wait();

  console.log("Setting addresses on liquidationQueue...");
  tx = await liquidationQueue.connect(deployer).setAddresses(stableBaseCDP.target);
  await tx.wait();

  console.log("Setting addresses on redemptionQueue...");
  tx = await redemptionQueue.connect(deployer).setAddresses(stableBaseCDP.target);
  await tx.wait();

  return contracts;
}

async function main() {
  await deployContracts();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });