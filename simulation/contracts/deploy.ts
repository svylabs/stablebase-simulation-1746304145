import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

// Import contract artifacts
import DFIDToken_json from "../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREStaking_json from "../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import DFIREToken_json from "../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracle_json from "../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json";
import OrderedDoublyLinkedList_json from "../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPool_json from "../../../stablebase/artifacts/contracts/StabilityPool.sol/StabilityPool.json";
import StableBaseCDP_json from "../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";

interface DeploymentInstruction {
  sequence: {
    type: string;
    contract: string;
    constructor: string;
    function: string;
    ref_name: string;
    params: { name: string; value: string; type: string }[];
  }[];
}

export async function deployContracts(): Promise<{ [key: string]: Contract }> {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const deploymentInstructions: DeploymentInstruction = {
    "sequence": [
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
    ]
  };

  const deployedContracts: { [key: string]: Contract } = {};

  // Iterate through deployment instructions
  for (const instruction of deploymentInstructions.sequence) {
    try {
      if (instruction.type === "deploy") {
        let contractFactory: ContractFactory;

        // Determine the contract factory based on the contract name
        switch (instruction.contract) {
          case "DFIDToken":
            contractFactory = new ethers.ContractFactory(
              DFIDToken_json.abi,
              DFIDToken_json.bytecode,
              deployer
            );
            break;
          case "DFIREToken":
            contractFactory = new ethers.ContractFactory(
              DFIREToken_json.abi,
              DFIREToken_json.bytecode,
              deployer
            );
            break;
          case "MockPriceOracle":
            contractFactory = new ethers.ContractFactory(
              MockPriceOracle_json.abi,
              MockPriceOracle_json.bytecode,
              deployer
            );
            break;
          case "DFIREStaking":
            contractFactory = new ethers.ContractFactory(
              DFIREStaking_json.abi,
              DFIREStaking_json.bytecode,
              deployer
            );
            break;
          case "OrderedDoublyLinkedList":
            contractFactory = new ethers.ContractFactory(
              OrderedDoublyLinkedList_json.abi,
              OrderedDoublyLinkedList_json.bytecode,
              deployer
            );
            break;
          case "StabilityPool":
            contractFactory = new ethers.ContractFactory(
              StabilityPool_json.abi,
              StabilityPool_json.bytecode,
              deployer
            );
            break;
          case "StableBaseCDP":
            contractFactory = new ethers.ContractFactory(
              StableBaseCDP_json.abi,
              StableBaseCDP_json.bytecode,
              deployer
            );
            break;
          default:
            throw new Error(`Unknown contract: ${instruction.contract}`);
        }

        let contract: Contract;
        // Deploy the contract
        if (instruction.params && instruction.params.length > 0) {
          const params = instruction.params.map((param) => {
            if (param.value.toLowerCase() === "true" || param.value.toLowerCase() === "false") {
              return param.value.toLowerCase() === "true";
            } else {
              return param.value;
            }
          });
          contract = await contractFactory.deploy(...params);
        } else {
          contract = await contractFactory.deploy();
        }

        await contract.waitForDeployment();
        deployedContracts[instruction.ref_name] = contract;

        console.log(`${instruction.contract} deployed to: ${contract.target}`);
      } else if (instruction.type === "call") {
        // Call a function on a deployed contract
        const contract = deployedContracts[instruction.contract];
        if (!contract) {
          throw new Error(`Contract ${instruction.contract} not deployed`);
        }

        // Prepare the parameters for the function call
        const params = instruction.params.map((param) => {
          if (param.type === "ref") {
            if (!deployedContracts[param.value]) {
              throw new Error(`Referenced contract ${param.value} not deployed`);
            }
            return deployedContracts[param.value].target;
          } else {
            return param.value;
          }
        });

        console.log(`Calling ${instruction.function} on ${instruction.contract} with params:`, params);

        // Check if the function exists on the contract
        if (typeof contract[instruction.function] !== 'function') {
          throw new Error(`Function ${instruction.function} not found on contract ${instruction.contract}`);
        }

        // Call the function
        const tx = await contract.connect(deployer)[instruction.function](...params);
        await tx.wait();

        console.log(`Transaction for ${instruction.function} on ${instruction.contract} confirmed`);
      }
    } catch (error: any) {
      console.error(`Error deploying or calling contract ${instruction.contract}:`, error.message);
      throw error; // Re-throw the error to stop the deployment
    }
  }

  console.log("All contracts deployed and configured successfully!");
  return deployedContracts;
}
