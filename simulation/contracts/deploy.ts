import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

import DFIDToken_json from "../artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREToken_json from "../artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracle_json from "../artifacts/contracts/MockPriceOracle.sol/MockPriceOracle.json";
import DFIREStaking_json from "../artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import OrderedDoublyLinkedList_json from "../artifacts/contracts/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPool_json from "../artifacts/contracts/StabilityPool.sol/StabilityPool.json";
import StableBaseCDP_json from "../artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";

async function deployContracts(): Promise<{
  [contractName: string]: Contract;
}> {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const deployedContracts: { [contractName: string]: Contract } = {};

  // Deploy DFIDToken
  const DFIDToken_factory = new ethers.ContractFactory(
    DFIDToken_json.abi,
    DFIDToken_json.bytecode,
    deployer
  );
  const dfidToken = await DFIDToken_factory.deploy();
  await dfidToken.waitForDeployment();
  console.log("DFIDToken deployed to:", dfidToken.target);
  deployedContracts['dfidToken'] = dfidToken;

  // Deploy DFIREToken
  const DFIREToken_factory = new ethers.ContractFactory(
    DFIREToken_json.abi,
    DFIREToken_json.bytecode,
    deployer
  );
  const dfireToken = await DFIREToken_factory.deploy();
  await dfireToken.waitForDeployment();
  console.log("DFIREToken deployed to:", dfireToken.target);
  deployedContracts['dfireToken'] = dfireToken;

  // Deploy MockPriceOracle
  const MockPriceOracle_factory = new ethers.ContractFactory(
    MockPriceOracle_json.abi,
    MockPriceOracle_json.bytecode,
    deployer
  );
  const mockPriceOracle = await MockPriceOracle_factory.deploy();
  await mockPriceOracle.waitForDeployment();
  console.log("MockPriceOracle deployed to:", mockPriceOracle.target);
  deployedContracts['mockPriceOracle'] = mockPriceOracle;

  // Deploy DFIREStaking
  const DFIREStaking_factory = new ethers.ContractFactory(
    DFIREStaking_json.abi,
    DFIREStaking_json.bytecode,
    deployer
  );
  const dfireStaking = await DFIREStaking_factory.deploy(true);
  await dfireStaking.waitForDeployment();
  console.log("DFIREStaking deployed to:", dfireStaking.target);
  deployedContracts['dfireStaking'] = dfireStaking;

  // Deploy OrderedDoublyLinkedList (liquidationQueue)
  const LiquidationQueue_factory = new ethers.ContractFactory(
    OrderedDoublyLinkedList_json.abi,
    OrderedDoublyLinkedList_json.bytecode,
    deployer
  );
  const liquidationQueue = await LiquidationQueue_factory.deploy();
  await liquidationQueue.waitForDeployment();
  console.log("LiquidationQueue deployed to:", liquidationQueue.target);
  deployedContracts['liquidationQueue'] = liquidationQueue;

  // Deploy OrderedDoublyLinkedList (redemptionQueue)
  const RedemptionQueue_factory = new ethers.ContractFactory(
    OrderedDoublyLinkedList_json.abi,
    OrderedDoublyLinkedList_json.bytecode,
    deployer
  );
  const redemptionQueue = await RedemptionQueue_factory.deploy();
  await redemptionQueue.waitForDeployment();
  console.log("RedemptionQueue deployed to:", redemptionQueue.target);
  deployedContracts['redemptionQueue'] = redemptionQueue;

  // Deploy StabilityPool
  const StabilityPool_factory = new ethers.ContractFactory(
    StabilityPool_json.abi,
    StabilityPool_json.bytecode,
    deployer
  );
  const stabilityPool = await StabilityPool_factory.deploy(true);
  await stabilityPool.waitForDeployment();
  console.log("StabilityPool deployed to:", stabilityPool.target);
  deployedContracts['stabilityPool'] = stabilityPool;

  // Deploy StableBaseCDP
  const StableBaseCDP_factory = new ethers.ContractFactory(
    StableBaseCDP_json.abi,
    StableBaseCDP_json.bytecode,
    deployer
  );
  const stableBaseCDP = await StableBaseCDP_factory.deploy();
  await stableBaseCDP.waitForDeployment();
  console.log("StableBaseCDP deployed to:", stableBaseCDP.target);
  deployedContracts['stableBaseCDP'] = stableBaseCDP;

  // Call setAddresses functions
  await stableBaseCDP.setAddresses(
    dfidToken.target,
    mockPriceOracle.target,
    stabilityPool.target,
    dfireStaking.target,
    liquidationQueue.target,
    redemptionQueue.target
  );
  console.log("StableBaseCDP setAddresses called");

  await dfidToken.setAddresses(stableBaseCDP.target);
  console.log("DFIDToken setAddresses called");

  await dfireToken.setAddresses(stabilityPool.target);
  console.log("DFIREToken setAddresses called");

  await dfireStaking.setAddresses(
    dfireToken.target,
    dfireToken.target,
    stableBaseCDP.target
  );
  console.log("DFIREStaking setAddresses called");

  await stabilityPool.setAddresses(
    dfidToken.target,
    stableBaseCDP.target,
    dfireToken.target
  );
  console.log("StabilityPool setAddresses called");

  await liquidationQueue.setAddresses(stableBaseCDP.target);
  console.log("LiquidationQueue setAddresses called");

  await redemptionQueue.setAddresses(stableBaseCDP.target);
  console.log("RedemptionQueue setAddresses called");

  return deployedContracts;
}

export default deployContracts;