import { ethers } from "hardhat";
import * as DFIDTokenArtifact from '../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json';
import * as DFIREStakingArtifact from '../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json';
import * as DFIRETokenArtifact from '../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json';
import * as MockPriceOracleArtifact from '../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json';
import * as OrderedDoublyLinkedListArtifact from '../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json';
import * as StabilityPoolArtifact from '../../../stablebase/artifacts/contracts/StabilityPool.sol/StabilityPool.json';
import * as StableBaseCDPArtifact from '../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json';


export async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const dfidTokenFactory = new ethers.ContractFactory(
    DFIDTokenArtifact.abi,
    DFIDTokenArtifact.bytecode,
    deployer
  );
  const dfidToken = await dfidTokenFactory.deploy();
  await dfidToken.waitForDeployment();
  console.log("DFIDToken deployed to:", dfidToken.target);

  const dfireTokenFactory = new ethers.ContractFactory(
    DFIRETokenArtifact.abi,
    DFIRETokenArtifact.bytecode,
    deployer
  );
  const dfireToken = await dfireTokenFactory.deploy();
  await dfireToken.waitForDeployment();
  console.log("DFIREToken deployed to:", dfireToken.target);

  const mockPriceOracleFactory = new ethers.ContractFactory(
    MockPriceOracleArtifact.abi,
    MockPriceOracleArtifact.bytecode,
    deployer
  );
  const mockPriceOracle = await mockPriceOracleFactory.deploy();
  await mockPriceOracle.waitForDeployment();
  console.log("MockPriceOracle deployed to:", mockPriceOracle.target);

  const dfireStakingFactory = new ethers.ContractFactory(
    DFIREStakingArtifact.abi,
    DFIREStakingArtifact.bytecode,
    deployer
  );
  const dfireStaking = await dfireStakingFactory.deploy(true);
  await dfireStaking.waitForDeployment();
  console.log("DFIREStaking deployed to:", dfireStaking.target);

  const liquidationQueueFactory = new ethers.ContractFactory(
    OrderedDoublyLinkedListArtifact.abi,
    OrderedDoublyLinkedListArtifact.bytecode,
    deployer
  );
  const liquidationQueue = await liquidationQueueFactory.deploy();
  await liquidationQueue.waitForDeployment();
  console.log("OrderedDoublyLinkedList deployed to:", liquidationQueue.target);

  const redemptionQueueFactory = new ethers.ContractFactory(
    OrderedDoublyLinkedListArtifact.abi,
    OrderedDoublyLinkedListArtifact.bytecode,
    deployer
  );
  const redemptionQueue = await redemptionQueueFactory.deploy();
  await redemptionQueue.waitForDeployment();
  console.log("OrderedDoublyLinkedList deployed to:", redemptionQueue.target);

  const stabilityPoolFactory = new ethers.ContractFactory(
    StabilityPoolArtifact.abi,
    StabilityPoolArtifact.bytecode,
    deployer
  );
  const stabilityPool = await stabilityPoolFactory.deploy(true);
  await stabilityPool.waitForDeployment();
  console.log("StabilityPool deployed to:", stabilityPool.target);

  const stableBaseCDPFactory = new ethers.ContractFactory(
    StableBaseCDPArtifact.abi,
    StableBaseCDPArtifact.bytecode,
    deployer
  );
  const stableBaseCDP = await stableBaseCDPFactory.deploy();
  await stableBaseCDP.waitForDeployment();
  console.log("StableBaseCDP deployed to:", stableBaseCDP.target);

  // Set Addresses
  let tx = await stableBaseCDP.setAddresses(
    dfidToken.target,
    mockPriceOracle.target,
    stabilityPool.target,
    dfireStaking.target,
    liquidationQueue.target,
    redemptionQueue.target
  );
  await tx.wait();
  console.log("StableBaseCDP setAddresses completed.");

  tx = await dfidToken.setAddresses(
    stableBaseCDP.target
  );
  await tx.wait();
  console.log("DFIDToken setAddresses completed.");

  tx = await dfireToken.setAddresses(
    stabilityPool.target
  );
  await tx.wait();
  console.log("DFIREToken setAddresses completed.");

  tx = await dfireStaking.setAddresses(
    dfireToken.target,
    dfireToken.target,
    stableBaseCDP.target
  );
  await tx.wait();
  console.log("DFIREStaking setAddresses completed.");

  tx = await stabilityPool.setAddresses(
    dfidToken.target,
    stableBaseCDP.target,
    dfireToken.target
  );
  await tx.wait();
  console.log("StabilityPool setAddresses completed.");

  tx = await liquidationQueue.setAddresses(
    stableBaseCDP.target
  );
  await tx.wait();
  console.log("LiquidationQueue setAddresses completed.");

  tx = await redemptionQueue.setAddresses(
    stableBaseCDP.target
  );
  await tx.wait();
  console.log("RedemptionQueue setAddresses completed.");

  return {
    dfidToken: dfidToken,
    dfireToken: dfireToken,
    mockPriceOracle: mockPriceOracle,
    dfireStaking: dfireStaking,
    liquidationQueue: liquidationQueue,
    redemptionQueue: redemptionQueue,
    stabilityPool: stabilityPool,
    stableBaseCDP: stableBaseCDP
  };
}
