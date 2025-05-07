import { ethers } from "hardhat";
import DFIDToken_json from "../artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREToken_json from "../artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracle_json from "../artifacts/contracts/MockPriceOracle.sol/MockPriceOracle.json";
import DFIREStaking_json from "../artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import OrderedDoublyLinkedList_json from "../artifacts/contracts/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPool_json from "../artifacts/contracts/StabilityPool.sol/StabilityPool.json";
import StableBaseCDP_json from "../artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const dfidToken_factory = new ethers.ContractFactory(
    DFIDToken_json.abi,
    DFIDToken_json.bytecode,
    deployer
  );
  const dfidToken = await dfidToken_factory.deploy();
  await dfidToken.waitForDeployment();
  console.log("DFIDToken deployed to:", dfidToken.target);

  const dfireToken_factory = new ethers.ContractFactory(
    DFIREToken_json.abi,
    DFIREToken_json.bytecode,
    deployer
  );
  const dfireToken = await dfireToken_factory.deploy();
  await dfireToken.waitForDeployment();
  console.log("DFIREToken deployed to:", dfireToken.target);

  const mockPriceOracle_factory = new ethers.ContractFactory(
    MockPriceOracle_json.abi,
    MockPriceOracle_json.bytecode,
    deployer
  );
  const mockPriceOracle = await mockPriceOracle_factory.deploy();
  await mockPriceOracle.waitForDeployment();
  console.log("MockPriceOracle deployed to:", mockPriceOracle.target);

  const dfireStaking_factory = new ethers.ContractFactory(
    DFIREStaking_json.abi,
    DFIREStaking_json.bytecode,
    deployer
  );
  const dfireStaking = await dfireStaking_factory.deploy(true);
  await dfireStaking.waitForDeployment();
  console.log("DFIREStaking deployed to:", dfireStaking.target);

  const liquidationQueue_factory = new ethers.ContractFactory(
    OrderedDoublyLinkedList_json.abi,
    OrderedDoublyLinkedList_json.bytecode,
    deployer
  );
  const liquidationQueue = await liquidationQueue_factory.deploy();
  await liquidationQueue.waitForDeployment();
  console.log("LiquidationQueue deployed to:", liquidationQueue.target);

  const redemptionQueue_factory = new ethers.ContractFactory(
    OrderedDoublyLinkedList_json.abi,
    OrderedDoublyLinkedList_json.bytecode,
    deployer
  );
  const redemptionQueue = await redemptionQueue_factory.deploy();
  await redemptionQueue.waitForDeployment();
  console.log("RedemptionQueue deployed to:", redemptionQueue.target);

  const stabilityPool_factory = new ethers.ContractFactory(
    StabilityPool_json.abi,
    StabilityPool_json.bytecode,
    deployer
  );
  const stabilityPool = await stabilityPool_factory.deploy(true);
  await stabilityPool.waitForDeployment();
  console.log("StabilityPool deployed to:", stabilityPool.target);

  const stableBaseCDP_factory = new ethers.ContractFactory(
    StableBaseCDP_json.abi,
    StableBaseCDP_json.bytecode,
    deployer
  );
  const stableBaseCDP = await stableBaseCDP_factory.deploy();
  await stableBaseCDP.waitForDeployment();
  console.log("StableBaseCDP deployed to:", stableBaseCDP.target);

  // Set Addresses
  await stableBaseCDP
    .setAddresses(
      dfidToken.target,
      mockPriceOracle.target,
      stabilityPool.target,
      dfireStaking.target,
      liquidationQueue.target,
      redemptionQueue.target
    )
    .then((tx) => tx.wait());
  console.log("StableBaseCDP setAddresses completed");

  await dfidToken.setAddresses(stableBaseCDP.target).then((tx) => tx.wait());
  console.log("DFIDToken setAddresses completed");

  await dfireToken.setAddresses(stabilityPool.target).then((tx) => tx.wait());
  console.log("DFIREToken setAddresses completed");

  await dfireStaking
    .setAddresses(dfireToken.target, dfireToken.target, stableBaseCDP.target)
    .then((tx) => tx.wait());
  console.log("DFIREStaking setAddresses completed");

  await stabilityPool
    .setAddresses(dfidToken.target, stableBaseCDP.target, dfireToken.target)
    .then((tx) => tx.wait());
  console.log("StabilityPool setAddresses completed");

  await liquidationQueue.setAddresses(stableBaseCDP.target).then((tx) => tx.wait());
  console.log("LiquidationQueue setAddresses completed");

  await redemptionQueue.setAddresses(stableBaseCDP.target).then((tx) => tx.wait());
  console.log("RedemptionQueue setAddresses completed");

  return {
    dfidToken: dfidToken,
    dfireToken: dfireToken,
    mockPriceOracle: mockPriceOracle,
    dfireStaking: dfireStaking,
    liquidationQueue: liquidationQueue,
    redemptionQueue: redemptionQueue,
    stabilityPool: stabilityPool,
    stableBaseCDP: stableBaseCDP,
  };
}

export default deployContracts;
