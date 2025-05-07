import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

// Contract Artifacts
import DFIDTokenArtifact from '../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json';
import DFIREStakingArtifact from '../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json';
import DFIRETokenArtifact from '../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json';
import MockPriceOracleArtifact from '../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json';
import OrderedDoublyLinkedListArtifact from '../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json';
import StabilityPoolArtifact from '../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json';
import StableBaseCDPArtifact from '../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json';

interface DeploymentInstruction {
  type: string;
  contract: string;
  function: string;
  ref_name: string;
  params: { name: string; value: string; type: string }[];
}

const deploymentInstructions: { sequence: DeploymentInstruction[] } = {
  "sequence": [
    { "type": "deploy", "contract": "DFIDToken", "function": "constructor", "ref_name": "dfidToken", "params": [] },
    { "type": "deploy", "contract": "DFIREToken", "function": "constructor", "ref_name": "dfireToken", "params": [] },
    { "type": "deploy", "contract": "MockPriceOracle", "function": "constructor", "ref_name": "mockPriceOracle", "params": [] },
    { "type": "deploy", "contract": "DFIREStaking", "function": "constructor", "ref_name": "dfireStaking", "params": [{ "name": "_rewardSenderActive", "value": "true", "type": "val" }] },
    { "type": "deploy", "contract": "OrderedDoublyLinkedList", "function": "constructor", "ref_name": "liquidationQueue", "params": [] },
    { "type": "deploy", "contract": "OrderedDoublyLinkedList", "function": "constructor", "ref_name": "redemptionQueue", "params": [] },
    { "type": "deploy", "contract": "StabilityPool", "function": "constructor", "ref_name": "stabilityPool", "params": [{ "name": "_rewardSenderActive", "value": "true", "type": "val" }] },
    { "type": "deploy", "contract": "StableBaseCDP", "function": "constructor", "ref_name": "stableBaseCDP", "params": [] },
    { "type": "call", "contract": "StableBaseCDP", "function": "setAddresses", "ref_name": "stableBase_setAddresses", "params": [{ "name": "_sbdToken", "value": "dfidToken", "type": "ref" }, { "name": "_priceOracle", "value": "mockPriceOracle", "type": "ref" }, { "name": "_stabilityPool", "value": "stabilityPool", "type": "ref" }, { "name": "_dfireTokenStaking", "value": "dfireStaking", "type": "ref" }, { "name": "_safesOrderedForLiquidation", "value": "liquidationQueue", "type": "ref" }, { "name": "_safesOrderedForRedemption", "value": "redemptionQueue", "type": "ref" }] },
    { "type": "call", "contract": "DFIDToken", "function": "setAddresses", "ref_name": "dfidToken_setAddresses", "params": [{ "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }] },
    { "type": "call", "contract": "DFIREToken", "function": "setAddresses", "ref_name": "dfireToken_setAddresses", "params": [{ "name": "_stabilityPool", "value": "stabilityPool", "type": "ref" }] },
    { "type": "call", "contract": "DFIREStaking", "function": "setAddresses", "ref_name": "dfireStaking_setAddresses", "params": [{ "name": "_stakingToken", "value": "dfireToken", "type": "ref" }, { "name": "_rewardToken", "value": "dfireToken", "type": "ref" }, { "name": "_stableBaseContract", "value": "stableBaseCDP", "type": "ref" }] },
    { "type": "call", "contract": "StabilityPool", "function": "setAddresses", "ref_name": "stabilityPool_setAddresses", "params": [{ "name": "_stakingToken", "value": "dfidToken", "type": "ref" }, { "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }, { "name": "_sbrToken", "value": "dfireToken", "type": "ref" }] },
    { "type": "call", "contract": "OrderedDoublyLinkedList", "function": "setAddresses", "ref_name": "liquidationQueue_setAddresses", "params": [{ "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }] },
    { "type": "call", "contract": "OrderedDoublyLinkedList", "function": "setAddresses", "ref_name": "redemptionQueue_setAddresses", "params": [{ "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }] }
  ]
};

export async function deployContracts(): Promise<{ [key: string]: Contract }> {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const contracts: { [key: string]: Contract } = {};

  for (const instruction of deploymentInstructions.sequence) {
    try {
      if (instruction.type === "deploy") {
        let contractFactory: ContractFactory;

        switch (instruction.contract) {
          case "DFIDToken":
            contractFactory = new ethers.ContractFactory(
              DFIDTokenArtifact.abi,
              DFIDTokenArtifact.bytecode,
              deployer
            );
            break;
          case "DFIREToken":
            contractFactory = new ethers.ContractFactory(
              DFIRETokenArtifact.abi,
              DFIRETokenArtifact.bytecode,
              deployer
            );
            break;
          case "MockPriceOracle":
            contractFactory = new ethers.ContractFactory(
              MockPriceOracleArtifact.abi,
              MockPriceOracleArtifact.bytecode,
              deployer
            );
            break;
          case "DFIREStaking":
            contractFactory = new ethers.ContractFactory(
              DFIREStakingArtifact.abi,
              DFIREStakingArtifact.bytecode,
              deployer
            );
            break;
          case "OrderedDoublyLinkedList":
            contractFactory = new ethers.ContractFactory(
              OrderedDoublyLinkedListArtifact.abi,
              OrderedDoublyLinkedListArtifact.bytecode,
              deployer
            );
            break;
          case "StabilityPool":
            contractFactory = new ethers.ContractFactory(
              StabilityPoolArtifact.abi,
              StabilityPoolArtifact.bytecode,
              deployer
            );
            break;
          case "StableBaseCDP":
            contractFactory = new ethers.ContractFactory(
              StableBaseCDPArtifact.abi,
              StableBaseCDPArtifact.bytecode,
              deployer
            );
            break;
          default:
            throw new Error(`Unknown contract: ${instruction.contract}`);
        }

        let deploymentParams: any[] = [];
        if (instruction.params) {
          deploymentParams = instruction.params.map(param => {
            if (param.type === "val") {
              if (param.value === "true") {
                return true;
              } else if (param.value === "false") {
                return false;
              } else if (!isNaN(Number(param.value))) {
                return Number(param.value);
              } else {
                return param.value;
              }
            } else {
              return contracts[param.value].target;
            }
          });
        }

        const contract = await contractFactory.deploy(...deploymentParams);
        await contract.waitForDeployment();
        console.log(`${instruction.contract} deployed to:`, contract.target);
        contracts[instruction.ref_name] = contract;
      } else if (instruction.type === "call") {
        const contract = contracts[instruction.contract];
        if (!contract) {
          throw new Error(`Contract ${instruction.contract} not found`);
        }

        let callParams: any[] = [];
        if (instruction.params) {
          callParams = instruction.params.map(param => {
            if (param.type === "val") {
              if (param.value === "true") {
                return true;
              } else if (param.value === "false") {
                return false;
              } else if (!isNaN(Number(param.value))) {
                return Number(param.value);
              } else {
                return param.value;
              }
            } else {
              return contracts[param.value].target;
            }
          });
        }

        console.log(`Calling ${instruction.function} on ${instruction.contract}`);
        const tx = await contract[instruction.function](...callParams);
        await tx.wait();
        console.log(`${instruction.function} on ${instruction.contract} completed`);
      }
    } catch (error) {
      console.error(`Error deploying or calling contract ${instruction.contract}:`, error);
      throw error; // Re-throw the error to halt deployment
    }
  }

  return contracts;
}
