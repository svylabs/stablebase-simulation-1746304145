import { ethers } from "hardhat";
// import { upgrades } from "hardhat";

import DFIDToken_json from "../artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREToken_json from "../artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracle_json from "../artifacts/contracts/MockPriceOracle.sol/MockPriceOracle.json";
import DFIREStaking_json from "../artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import OrderedDoublyLinkedList_json from "../artifacts/contracts/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPool_json from "../artifacts/contracts/StabilityPool.sol/StabilityPool.json";
import StableBaseCDP_json from "../artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";



async function deployContracts(): Promise<{[key: string]: string}> {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy DFIDToken
  const DFIDToken_factory = new ethers.ContractFactory(
    DFIDToken_json.abi,
    DFIDToken_json.bytecode,
    deployer
  );
  const dfidToken = await DFIDToken_factory.deploy();
  await dfidToken.waitForDeployment();
  console.log("DFIDToken address:", dfidToken.target);

  // Deploy DFIREToken
  const DFIREToken_factory = new ethers.ContractFactory(
    DFIREToken_json.abi,
    DFIREToken_json.bytecode,
    deployer
  );
  const dfireToken = await DFIREToken_factory.deploy();
  await dfireToken.waitForDeployment();
  console.log("DFIREToken address:", dfireToken.target);

  // Deploy MockPriceOracle
  const MockPriceOracle_factory = new ethers.ContractFactory(
    MockPriceOracle_json.abi,
    MockPriceOracle_json.bytecode,
    deployer
  );
  const mockPriceOracle = await MockPriceOracle_factory.deploy();
  await mockPriceOracle.waitForDeployment();
  console.log("MockPriceOracle address:", mockPriceOracle.target);

  // Deploy DFIREStaking
  const DFIREStaking_factory = new ethers.ContractFactory(
    DFIREStaking_json.abi,
    DFIREStaking_json.bytecode,
    deployer
  );
  const dfireStaking = await DFIREStaking_factory.deploy(true);
  await dfireStaking.waitForDeployment();
  console.log("DFIREStaking address:", dfireStaking.target);

  // Deploy OrderedDoublyLinkedList (liquidationQueue)
  let OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
    OrderedDoublyLinkedList_json.abi,
    OrderedDoublyLinkedList_json.bytecode,
    deployer
  );
  const liquidationQueue = await OrderedDoublyLinkedList_factory.deploy();
  await liquidationQueue.waitForDeployment();
  console.log("LiquidationQueue address:", liquidationQueue.target);

  // Deploy OrderedDoublyLinkedList (redemptionQueue)
  OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
    OrderedDoublyLinkedList_json.abi,
    OrderedDoublyLinkedList_json.bytecode,
    deployer
  );
  const redemptionQueue = await OrderedDoublyLinkedList_factory.deploy();
  await redemptionQueue.waitForDeployment();
  console.log("RedemptionQueue address:", redemptionQueue.target);

  // Deploy StabilityPool
  const StabilityPool_factory = new ethers.ContractFactory(
    StabilityPool_json.abi,
    StabilityPool_json.bytecode,
    deployer
  );
  const stabilityPool = await StabilityPool_factory.deploy(true);
  await stabilityPool.waitForDeployment();
  console.log("StabilityPool address:", stabilityPool.target);

  // Deploy StableBaseCDP
  const StableBaseCDP_factory = new ethers.ContractFactory(
    StableBaseCDP_json.abi,
    StableBaseCDP_json.bytecode,
    deployer
  );
  const stableBaseCDP = await StableBaseCDP_factory.deploy();
  await stableBaseCDP.waitForDeployment();
  console.log("StableBaseCDP address:", stableBaseCDP.target);

  // Set addresses on StableBaseCDP
  await stableBaseCDP.setAddresses(
    dfidToken.target,
    mockPriceOracle.target,
    stabilityPool.target,
    dfireStaking.target,
    liquidationQueue.target,
    redemptionQueue.target
  );
  console.log("StableBaseCDP setAddresses completed");

  // Set addresses on DFIDToken
  await dfidToken.setAddresses(stableBaseCDP.target);
  console.log("DFIDToken setAddresses completed");

  // Set addresses on DFIREToken
  await dfireToken.setAddresses(stabilityPool.target);
  console.log("DFIREToken setAddresses completed");

  // Set addresses on DFIREStaking
  await dfireStaking.setAddresses(
    dfireToken.target,
    dfireToken.target,
    stableBaseCDP.target
  );
  console.log("DFIREStaking setAddresses completed");

  // Set addresses on StabilityPool
  await stabilityPool.setAddresses(
    dfidToken.target,
    stableBaseCDP.target,
    dfireToken.target
  );
  console.log("StabilityPool setAddresses completed");

  // Set addresses on liquidationQueue
  await liquidationQueue.setAddresses(stableBaseCDP.target);
  console.log("LiquidationQueue setAddresses completed");

  // Set addresses on redemptionQueue
  await redemptionQueue.setAddresses(stableBaseCDP.target);
  console.log("RedemptionQueue setAddresses completed");

  return {
    dfidToken: dfidToken.target as string,
    dfireToken: dfireToken.target as string,
    mockPriceOracle: mockPriceOracle.target as string,
    dfireStaking: dfireStaking.target as string,
    liquidationQueue: liquidationQueue.target as string,
    redemptionQueue: redemptionQueue.target as string,
    stabilityPool: stabilityPool.target as string,
    stableBaseCDP: stableBaseCDP.target as string,
  };
}

export default deployContracts;