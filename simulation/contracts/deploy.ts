import { ethers } from "hardhat";
import { Contract } from "ethers";

async function deployContracts(): Promise<{[contractName: string]: string}> {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DFIDToken = await ethers.getContractFactory("DFIDToken");
  const dfidToken = await DFIDToken.connect(deployer).deploy();
  await dfidToken.waitForDeployment();
  console.log("DFIDToken address:", dfidToken.target);

  const DFIREToken = await ethers.getContractFactory("DFIREToken");
  const dfireToken = await DFIREToken.connect(deployer).deploy();
  await dfireToken.waitForDeployment();
  console.log("DFIREToken address:", dfireToken.target);

  const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
  const mockPriceOracle = await MockPriceOracle.connect(deployer).deploy();
  await mockPriceOracle.waitForDeployment();
  console.log("MockPriceOracle address:", mockPriceOracle.target);

  const DFIREStaking = await ethers.getContractFactory("DFIREStaking");
  const dfireStaking = await DFIREStaking.connect(deployer).deploy(true);
  await dfireStaking.waitForDeployment();
  console.log("DFIREStaking address:", dfireStaking.target);

  const OrderedDoublyLinkedList = await ethers.getContractFactory("OrderedDoublyLinkedList");
  const liquidationQueue = await OrderedDoublyLinkedList.connect(deployer).deploy();
  await liquidationQueue.waitForDeployment();
  console.log("LiquidationQueue address:", liquidationQueue.target);

  const redemptionQueue = await ethers.getContractFactory("OrderedDoublyLinkedList");
  const redemptionQueueInstance = await redemptionQueue.connect(deployer).deploy();
  await redemptionQueueInstance.waitForDeployment();
  console.log("RedemptionQueue address:", redemptionQueueInstance.target);

  const StabilityPool = await ethers.getContractFactory("StabilityPool");
  const stabilityPool = await StabilityPool.connect(deployer).deploy(true);
  await stabilityPool.waitForDeployment();
  console.log("StabilityPool address:", stabilityPool.target);

  const StableBaseCDP = await ethers.getContractFactory("StableBaseCDP");
  const stableBaseCDP = await StableBaseCDP.connect(deployer).deploy();
  await stableBaseCDP.waitForDeployment();
  console.log("StableBaseCDP address:", stableBaseCDP.target);

  // Set Addresses
  await stableBaseCDP.setAddresses(
    dfidToken.target,
    mockPriceOracle.target,
    stabilityPool.target,
    dfireStaking.target,
    liquidationQueue.target,
    redemptionQueueInstance.target
  );
  console.log("StableBaseCDP setAddresses done");

  await dfidToken.setAddresses(stableBaseCDP.target);
  console.log("DFIDToken setAddresses done");

  await dfireToken.setAddresses(stabilityPool.target);
  console.log("DFIREToken setAddresses done");

  await dfireStaking.setAddresses(dfireToken.target, dfireToken.target, stableBaseCDP.target);
  console.log("DFIREStaking setAddresses done");

  await stabilityPool.setAddresses(dfidToken.target, stableBaseCDP.target, dfireToken.target);
  console.log("StabilityPool setAddresses done");

  await liquidationQueue.setAddresses(stableBaseCDP.target);
  console.log("LiquidationQueue setAddresses done");

  await redemptionQueueInstance.setAddresses(stableBaseCDP.target);
  console.log("RedemptionQueue setAddresses done");

  return {
      DFIDToken: dfidToken.target,
      DFIREToken: dfireToken.target,
      MockPriceOracle: mockPriceOracle.target,
      DFIREStaking: dfireStaking.target,
      liquidationQueue: liquidationQueue.target,
      redemptionQueue: redemptionQueueInstance.target,
      StabilityPool: stabilityPool.target,
      StableBaseCDP: stableBaseCDP.target
  };
}

export default deployContracts;