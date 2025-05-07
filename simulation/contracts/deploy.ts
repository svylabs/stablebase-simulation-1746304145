import { ethers } from "hardhat";

// Import contract artifacts
import DFIDToken_json from "../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREStaking_json from "../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import DFIREToken_json from "../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracle_json from "../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json";
import OrderedDoublyLinkedList_json from "../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPool_json from "../../../stablebase/artifacts/contracts/StabilityPool.sol/StabilityPool.json";
import StableBaseCDP_json from "../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";


async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const deploymentData = {
    "sequence": [
      {
        "type": "deploy",
        "contract": "DFIDToken",
        "constructor": "constructor() Ownable(msg.sender) ERC20(\"D.FI Dollar\", \"DFID\") {}",
        "function": "constructor",
        "ref_name": "dfidToken",
        "params": []
      },
      {
        "type": "deploy",
        "contract": "DFIREToken",
        "constructor": "constructor() Ownable(msg.sender) ERC20(\"D.FIRE\", \"DFIRE\") { Initializes the contract, setting the deployer as the owner and initializing the ERC20 token with the name \"D.FIRE\" and symbol \"DFIRE\". }",
        "function": "constructor",
        "ref_name": "dfireToken",
        "params": []
      },
      {
        "type": "deploy",
        "contract": "MockPriceOracle",
        "constructor": "constructor() Ownable(msg.sender) {}",
        "function": "constructor",
        "ref_name": "mockPriceOracle",
        "params": []
      },
      {
        "type": "deploy",
        "contract": "DFIREStaking",
        "constructor": "constructor(bool _rewardSenderActive) Ownable(msg.sender) {\n        rewardSenderActive = _rewardSenderActive;\n    }",
        "function": "constructor",
        "ref_name": "dfireStaking",
        "params": [{
          "name": "_rewardSenderActive",
          "value": "true",
          "type": "val"
        }]
      },
      {
        "type": "deploy",
        "contract": "OrderedDoublyLinkedList",
        "constructor": "constructor() Ownable(msg.sender) {\n        head = 0;\n        tail = 0;\n    }",
        "function": "constructor",
        "ref_name": "liquidationQueue",
        "params": []
      },
      {
        "type": "deploy",
        "contract": "OrderedDoublyLinkedList",
        "constructor": "constructor() Ownable(msg.sender) {\n        head = 0;\n        tail = 0;\n    }",
        "function": "constructor",
        "ref_name": "redemptionQueue",
        "params": []
      },
      {
        "type": "deploy",
        "contract": "StabilityPool",
        "constructor": "constructor(bool _rewardSenderActive) Ownable(msg.sender) {\n        rewardSenderActive = _rewardSenderActive;\n    }",
        "function": "constructor",
        "ref_name": "stabilityPool",
        "params": [{
          "name": "_rewardSenderActive",
          "value": "true",
          "type": "val"
        }]
      },
      {
        "type": "deploy",
        "contract": "StableBaseCDP",
        "constructor": "constructor() StableBase() {}",
        "function": "constructor",
        "ref_name": "stableBaseCDP",
        "params": []
      },
      {
        "type": "call",
        "contract": "StableBaseCDP",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "stableBase_setAddresses",
        "params": [{
          "name": "_sbdToken",
          "value": "dfidToken",
          "type": "ref"
        }, {
          "name": "_priceOracle",
          "value": "mockPriceOracle",
          "type": "ref"
        }, {
          "name": "_stabilityPool",
          "value": "stabilityPool",
          "type": "ref"
        }, {
          "name": "_dfireTokenStaking",
          "value": "dfireStaking",
          "type": "ref"
        }, {
          "name": "_safesOrderedForLiquidation",
          "value": "liquidationQueue",
          "type": "ref"
        }, {
          "name": "_safesOrderedForRedemption",
          "value": "redemptionQueue",
          "type": "ref"
        }]
      },
      {
        "type": "call",
        "contract": "DFIDToken",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "dfidToken_setAddresses",
        "params": [{
          "name": "_stableBaseCDP",
          "value": "stableBaseCDP",
          "type": "ref"
        }]
      },
      {
        "type": "call",
        "contract": "DFIREToken",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "dfireToken_setAddresses",
        "params": [{
          "name": "_stabilityPool",
          "value": "stabilityPool",
          "type": "ref"
        }]
      },
      {
        "type": "call",
        "contract": "DFIREStaking",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "dfireStaking_setAddresses",
        "params": [{
          "name": "_stakingToken",
          "value": "dfireToken",
          "type": "ref"
        }, {
          "name": "_rewardToken",
          "value": "dfireToken",
          "type": "ref"
        }, {
          "name": "_stableBaseContract",
          "value": "stableBaseCDP",
          "type": "ref"
        }]
      },
      {
        "type": "call",
        "contract": "StabilityPool",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "stabilityPool_setAddresses",
        "params": [{
          "name": "_stakingToken",
          "value": "dfidToken",
          "type": "ref"
        }, {
          "name": "_stableBaseCDP",
          "value": "stableBaseCDP",
          "type": "ref"
        }, {
          "name": "_sbrToken",
          "value": "dfireToken",
          "type": "ref"
        }]
      },
      {
        "type": "call",
        "contract": "OrderedDoublyLinkedList",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "liquidationQueue_setAddresses",
        "params": [{
          "name": "_stableBaseCDP",
          "value": "stableBaseCDP",
          "type": "ref"
        }]
      },
      {
        "type": "call",
        "contract": "OrderedDoublyLinkedList",
        "constructor": "",
        "function": "setAddresses",
        "ref_name": "redemptionQueue_setAddresses",
        "params": [{
          "name": "_stableBaseCDP",
          "value": "stableBaseCDP",
          "type": "ref"
        }]
      }
    ]
  };

  const deployedContracts: { [key: string]: string } = {};

  for (const step of deploymentData.sequence) {
    if (step.type === "deploy") {
      console.log(`Deploying ${step.contract} as ${step.ref_name}`);

      let contractArtifact: any;
      switch (step.contract) {
        case "DFIDToken":
          contractArtifact = DFIDToken_json;
          break;
        case "DFIREToken":
          contractArtifact = DFIREToken_json;
          break;
        case "MockPriceOracle":
          contractArtifact = MockPriceOracle_json;
          break;
        case "DFIREStaking":
          contractArtifact = DFIREStaking_json;
          break;
        case "OrderedDoublyLinkedList":
          contractArtifact = OrderedDoublyLinkedList_json;
          break;
        case "StabilityPool":
          contractArtifact = StabilityPool_json;
          break;
        case "StableBaseCDP":
          contractArtifact = StableBaseCDP_json;
          break;
        default:
          throw new Error(`Unknown contract: ${step.contract}`);
      }

      const factory = new ethers.ContractFactory(
        contractArtifact.abi,
        contractArtifact.bytecode,
        deployer
      );

      const params = step.params.map((param) => {
        if (param.type === "ref") {
          return deployedContracts[param.value];
        } else {
          return param.value;
        }
      });

      const contract = await factory.deploy(...params);
      await contract.waitForDeployment();

      console.log(`${step.contract} deployed to: ${contract.target}`);
      deployedContracts[step.ref_name] = contract.target;

    } else if (step.type === "call") {
      console.log(`Calling ${step.function} on ${step.contract}`);

      let contractArtifact: any;
      switch (step.contract) {
          case "DFIDToken":
            contractArtifact = DFIDToken_json;
            break;
          case "DFIREToken":
            contractArtifact = DFIREToken_json;
            break;
          case "DFIREStaking":
            contractArtifact = DFIREStaking_json;
            break;
          case "StabilityPool":
            contractArtifact = StabilityPool_json;
            break;
          case "StableBaseCDP":
            contractArtifact = StableBaseCDP_json;
            break;
          case "OrderedDoublyLinkedList":
            contractArtifact = OrderedDoublyLinkedList_json;
            break;
          default:
            throw new Error(`Unknown contract: ${step.contract}`);
        }

      const contract = new ethers.Contract(
        deployedContracts[step.contract],
        contractArtifact.abi,
        deployer
      );

      const params = step.params.map((param) => {
        if (param.type === "ref") {
          return deployedContracts[param.value];
        } else {
          return param.value;
        }
      });

      const tx = await contract[step.function](...params);
      await tx.wait();

      console.log(`${step.function} on ${step.contract} completed`);
    }
  }

  console.log("All contracts deployed and configured!");
  console.log("Deployed contract addresses:", JSON.stringify(deployedContracts, null, 2));
  return deployedContracts;
}

export { deployContracts };