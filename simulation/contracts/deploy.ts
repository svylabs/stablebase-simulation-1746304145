import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

// Import contract artifacts
import DFIDTokenArtifact from "../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREStakingArtifact from "../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import DFIRETokenArtifact from "../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracleArtifact from "../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json";
import OrderedDoublyLinkedListArtifact from "../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPoolArtifact from "../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json";
import StableBaseCDPArtifact from "../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";

// Import contract types
import { DFIDToken } from "../../../stablebase/typechain-types/contracts/DFIDToken";
import { DFIREStaking } from "../../../stablebase/typechain-types/contracts/DFIREStaking";
import { DFIREToken } from "../../../stablebase/typechain-types/contracts/DFIREToken";
import { MockPriceOracle } from "../../../stablebase/typechain-types/contracts/dependencies/price-oracle/MockPriceOracle";
import { OrderedDoublyLinkedList } from "../../../stablebase/typechain-types/contracts/library/OrderedDoublyLinkedList";
import { StabilityPool } from "../../../stablebase/typechain-types/contracts/test/ReenterStabilityPool";
import { StableBaseCDP } from "../../../stablebase/typechain-types/contracts/StableBaseCDP";

interface ContractArtifact {
  abi: any;
  bytecode: string;
}

interface DeployedContracts {
  [key: string]: Contract;
}

export async function deployContracts(): Promise<DeployedContracts> {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const deployedContracts: DeployedContracts = {};

  // Helper function to deploy contracts
  async function deployContract<T extends Contract>(
    artifact: ContractArtifact,
    contractName: string,
    constructorArgs: any[] = []
  ): Promise<T> {
    console.log(`Deploying ${contractName}...`);
    const factory = new ContractFactory(
      artifact.abi,
      artifact.bytecode,
      deployer
    );
    try {
      const contract = (await factory.deploy(...constructorArgs)) as T;
      await contract.waitForDeployment();
      console.log(`${contractName} deployed at: ${contract.target}`);
      deployedContracts[contractName] = contract;
      return contract;
    } catch (error) {
      console.error(`Failed to deploy ${contractName}:`, error);
      throw error; // Re-throw the error to halt the deployment
    }
  }

  // Deploy contracts in sequence
  const dfidToken = await deployContract<DFIDToken>(
    DFIDTokenArtifact,
    "DFIDToken",
    []
  );
  const dfireToken = await deployContract<DFIREToken>(
    DFIRETokenArtifact,
    "DFIREToken",
    []
  );
  const mockPriceOracle = await deployContract<MockPriceOracle>(
    MockPriceOracleArtifact,
    "MockPriceOracle",
    []
  );
  const dfireStaking = await deployContract<DFIREStaking>(
    DFIREStakingArtifact,
    "DFIREStaking",
    [true]
  );
  const liquidationQueue = await deployContract<OrderedDoublyLinkedList>(
    OrderedDoublyLinkedListArtifact,
    "OrderedDoublyLinkedList",
    []
  );
  const redemptionQueue = await deployContract<OrderedDoublyLinkedList>(
    OrderedDoublyLinkedListArtifact,
    "OrderedDoublyLinkedList",
    []
  );
  const stabilityPool = await deployContract<StabilityPool>(
    StabilityPoolArtifact,
    "StabilityPool",
    [true]
  );
  const stableBaseCDP = await deployContract<StableBaseCDP>(
    StableBaseCDPArtifact,
    "StableBaseCDP",
    []
  );

  // Call setAddresses functions
  console.log("Setting contract addresses...");

  try {
    console.log("Calling stableBaseCDP.setAddresses...");
    await stableBaseCDP.setAddresses(
      dfidToken.target,
      mockPriceOracle.target,
      stabilityPool.target,
      dfireStaking.target,
      liquidationQueue.target,
      redemptionQueue.target
    );
    console.log("stableBaseCDP.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call stableBaseCDP.setAddresses:", error);
    throw error;
  }

  try {
    console.log("Calling dfidToken.setAddresses...");
    await dfidToken.setAddresses(stableBaseCDP.target);
    console.log("dfidToken.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call dfidToken.setAddresses:", error);
    throw error;
  }

  try {
    console.log("Calling dfireToken.setAddresses...");
    await dfireToken.setAddresses(stabilityPool.target);
    console.log("dfireToken.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call dfireToken.setAddresses:", error);
    throw error;
  }

  try {
    console.log("Calling dfireStaking.setAddresses...");
    await dfireStaking.setAddresses(
      dfireToken.target,
      dfireToken.target,
      stableBaseCDP.target
    );
    console.log("dfireStaking.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call dfireStaking.setAddresses:", error);
    throw error;
  }

  try {
    console.log("Calling stabilityPool.setAddresses...");
    await stabilityPool.setAddresses(
      dfidToken.target,
      stableBaseCDP.target,
      dfireToken.target
    );
    console.log("stabilityPool.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call stabilityPool.setAddresses:", error);
    throw error;
  }

  try {
    console.log("Calling liquidationQueue.setAddresses...");
    await liquidationQueue.setAddresses(stableBaseCDP.target);
    console.log("liquidationQueue.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call liquidationQueue.setAddresses:", error);
    throw error;
  }

  try {
    console.log("Calling redemptionQueue.setAddresses...");
    await redemptionQueue.setAddresses(stableBaseCDP.target);
    console.log("redemptionQueue.setAddresses completed.");
  } catch (error) {
    console.error("Failed to call redemptionQueue.setAddresses:", error);
    throw error;
  }

  console.log("Contract deployment and setup complete!");
  return deployedContracts;
}
