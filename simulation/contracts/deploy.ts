import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

// Import contract artifacts
import DFIDTokenArtifact from '../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json';
import DFIREStakingArtifact from '../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json';
import DFIRETokenArtifact from '../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json';
import MockPriceOracleArtifact from '../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json';
import OrderedDoublyLinkedListArtifact from '../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json';
import StabilityPoolArtifact from '../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json';
import StableBaseCDPArtifact from '../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json';

interface DeployedContracts {
  [key: string]: Contract;
}

const contractArtifacts: { [key: string]: any } = {
  DFIDToken: DFIDTokenArtifact,
  DFIREStaking: DFIREStakingArtifact,
  DFIREToken: DFIRETokenArtifact,
  MockPriceOracle: MockPriceOracleArtifact,
  OrderedDoublyLinkedList: OrderedDoublyLinkedListArtifact,
  StabilityPool: StabilityPoolArtifact,
  StableBaseCDP: StableBaseCDPArtifact,
};

interface DeploymentInstruction {
  type: string;
  contract: string;
  constructor: string;
  function: string;
  ref_name: string;
  params: any[];
}

const deploymentInstructions: DeploymentInstruction[] = [
  { "type": "deploy", "contract": "DFIDToken", "constructor": "constructor() Ownable(msg.sender) ERC20(\"D.FI Dollar\", \"DFID\") {}", "function": "constructor", "ref_name": "dfidToken", "params": [] },
  { "type": "deploy", "contract": "DFIREToken", "constructor": "constructor() Ownable(msg.sender) ERC20(\"D.FIRE\", \"DFIRE\") { Initializes the contract, setting the deployer as the owner and initializing the ERC20 token with the name \"D.FIRE\" and symbol \"DFIRE\". }", "function": "constructor", "ref_name": "dfireToken", "params": [] },
  { "type": "deploy", "contract": "MockPriceOracle", "constructor": "constructor() Ownable(msg.sender) {}", "function": "constructor", "ref_name": "mockPriceOracle", "params": [] },
  { "type": "deploy", "contract": "DFIREStaking", "constructor": "constructor(bool _rewardSenderActive) Ownable(msg.sender) {\n        rewardSenderActive = _rewardSenderActive;\n    }", "function": "constructor", "ref_name": "dfireStaking", "params": [{ "name": "_rewardSenderActive", "value": "true", "type": "val" }] },
  { "type": "deploy", "contract": "OrderedDoublyLinkedList", "constructor": "constructor() Ownable(msg.sender) {\n        head = 0;\n        tail = 0;\n    }", "function": "constructor", "ref_name": "liquidationQueue", "params": [] },
  { "type": "deploy", "contract": "OrderedDoublyLinkedList", "constructor": "constructor() Ownable(msg.sender) {\n        head = 0;\n        tail = 0;\n    }", "function": "constructor", "ref_name": "redemptionQueue", "params": [] },
  { "type": "deploy", "contract": "StabilityPool", "constructor": "constructor(bool _rewardSenderActive) Ownable(msg.sender) {\n        rewardSenderActive = _rewardSenderActive;\n    }", "function": "constructor", "ref_name": "stabilityPool", "params": [{ "name": "_rewardSenderActive", "value": "true", "type": "val" }] },
  { "type": "deploy", "contract": "StableBaseCDP", "constructor": "constructor() StableBase() {}", "function": "constructor", "ref_name": "stableBaseCDP", "params": [] },
  { "type": "call", "contract": "StableBaseCDP", "constructor": "", "function": "setAddresses", "ref_name": "stableBase_setAddresses", "params": [{ "name": "_sbdToken", "value": "dfidToken", "type": "ref" }, { "name": "_priceOracle", "value": "mockPriceOracle", "type": "ref" }, { "name": "_stabilityPool", "value": "stabilityPool", "type": "ref" }, { "name": "_dfireTokenStaking", "value": "dfireStaking", "type": "ref" }, { "name": "_safesOrderedForLiquidation", "value": "liquidationQueue", "type": "ref" }, { "name": "_safesOrderedForRedemption", "value": "redemptionQueue", "type": "ref" }] },
  { "type": "call", "contract": "DFIDToken", "constructor": "", "function": "setAddresses", "ref_name": "dfidToken_setAddresses", "params": [{ "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }] },
  { "type": "call", "contract": "DFIREToken", "constructor": "", "function": "setAddresses", "ref_name": "dfireToken_setAddresses", "params": [{ "name": "_stabilityPool", "value": "stabilityPool", "type": "ref" }] },
  { "type": "call", "contract": "DFIREStaking", "constructor": "", "function": "setAddresses", "ref_name": "dfireStaking_setAddresses", "params": [{ "name": "_stakingToken", "value": "dfireToken", "type": "ref" }, { "name": "_rewardToken", "value": "dfireToken", "type": "ref" }, { "name": "_stableBaseContract", "value": "stableBaseCDP", "type": "ref" }] },
  { "type": "call", "contract": "StabilityPool", "constructor": "", "function": "setAddresses", "ref_name": "stabilityPool_setAddresses", "params": [{ "name": "_stakingToken", "value": "dfidToken", "type": "ref" }, { "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }, { "name": "_sbrToken", "value": "dfireToken", "type": "ref" }] },
  { "type": "call", "contract": "OrderedDoublyLinkedList", "constructor": "", "function": "setAddresses", "ref_name": "liquidationQueue_setAddresses", "params": [{ "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }] },
  { "type": "call", "contract": "OrderedDoublyLinkedList", "constructor": "", "function": "setAddresses", "ref_name": "redemptionQueue_setAddresses", "params": [{ "name": "_stableBaseCDP", "value": "stableBaseCDP", "type": "ref" }] }
];

export async function deployContracts(): Promise<DeployedContracts> {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const deployedContracts: DeployedContracts = {};

  // Helper function to deploy contracts
  async function deployContract(
    contractName: string,
    params: any[] = []
  ): Promise<Contract> {
    const artifact = contractArtifacts[contractName];
    if (!artifact) {
      throw new Error(`Artifact not found for contract: ${contractName}`);
    }
    const factory = new ContractFactory(
      artifact.abi,
      artifact.bytecode,
      deployer
    );
    const contract = await factory.deploy(...params);
    await contract.waitForDeployment();
    console.log(`Deployed ${contractName} at:`, contract.target);
    return contract;
  }

  // Deploy contracts based on deploymentInstructions
  for (const instruction of deploymentInstructions) {
    if (instruction.type === 'deploy') {
      try {
        const params = instruction.params.map((param: any) => {
          if (param.type === 'val') {
            return param.value === 'true' ? true : param.value === 'false' ? false : param.value;
          }
          return undefined; // Should not happen, but good to have a default
        });

        const contract = await deployContract(
          instruction.contract,
          params
        );
        deployedContracts[instruction.ref_name] = contract;
      } catch (error: any) {
        console.error(`Error deploying ${instruction.contract}:`, error.message);
        throw error; // Re-throw to halt deployment
      }
    }
  }

  // Call functions after deployment
  for (const instruction of deploymentInstructions) {
    if (instruction.type === 'call') {
      try {
        const contract = deployedContracts[instruction.contract];
        if (!contract) {
          throw new Error(`Contract ${instruction.contract} not deployed`);
        }

        const params = instruction.params.map((param: any) => {
          if (param.type === 'ref') {
            if (!deployedContracts[param.value]) {
              throw new Error(`Referenced contract ${param.value} not deployed`);
            }
            return deployedContracts[param.value].target;
          } else if (param.type === 'val') {
            return param.value === 'true' ? true : param.value === 'false' ? false : param.value;
          }
          return undefined; // Handle other parameter types if needed
        });

        console.log(`Calling ${instruction.contract}.${instruction.function} with params:`, params);
        const tx = await contract.connect(deployer)[instruction.function](...params);
        await tx.wait();
        console.log(`${instruction.contract}.${instruction.function} completed`);
      } catch (error: any) {
        console.error(`Error calling ${instruction.contract}.${instruction.function}:`, error.message);
        throw error; // Re-throw to halt deployment
      }
    }
  }

  console.log('All contract deployments and configurations complete!');
  return deployedContracts;
}
