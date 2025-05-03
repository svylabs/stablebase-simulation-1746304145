import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

import ChainlinkPriceFeed_artifact from '../../../stablebase/artifacts/contracts/dependencies/price-oracle/ChainlinkPriceOracle.sol/ChainlinkPriceFeed.json';
import Constants_artifact from '../../../stablebase/artifacts/contracts/Constants.sol/Constants.json';
import DFIDToken_artifact from '../../../stablebase/artifacts/contracts/DFIDToken.sol/DFIDToken.json';
import DFIREStaking_artifact from '../../../stablebase/artifacts/contracts/DFIREStaking.sol/DFIREStaking.json';
import DFIREToken_artifact from '../../../stablebase/artifacts/contracts/DFIREToken.sol/DFIREToken.json';
import MockPriceOracle_artifact from '../../../stablebase/artifacts/contracts/dependencies/price-oracle/MockPriceOracle.sol/MockPriceOracle.json';
import OrderedDoublyLinkedList_artifact from '../../../stablebase/artifacts/contracts/library/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json';
import StabilityPool_artifact from '../../../stablebase/artifacts/contracts/test/ReenterStabilityPool.sol/ReenterStabilityPool.json';
import StableBase_artifact from '../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json';
import StableBaseCDP_artifact from '../../../stablebase/artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json';
if (!ChainlinkPriceFeed_artifact) {
                    throw new Error(`Missing artifact for ChainlinkPriceFeed`);
                }
                    if (!Constants_artifact) {
                    throw new Error(`Missing artifact for Constants`);
                }
                    if (!DFIDToken_artifact) {
                    throw new Error(`Missing artifact for DFIDToken`);
                }
                    if (!DFIREStaking_artifact) {
                    throw new Error(`Missing artifact for DFIREStaking`);
                }
                    if (!DFIREToken_artifact) {
                    throw new Error(`Missing artifact for DFIREToken`);
                }
                    if (!MockPriceOracle_artifact) {
                    throw new Error(`Missing artifact for MockPriceOracle`);
                }
                    if (!OrderedDoublyLinkedList_artifact) {
                    throw new Error(`Missing artifact for OrderedDoublyLinkedList`);
                }
                    if (!StabilityPool_artifact) {
                    throw new Error(`Missing artifact for StabilityPool`);
                }
                    if (!StableBase_artifact) {
                    throw new Error(`Missing artifact for StableBase`);
                }
                    if (!StableBaseCDP_artifact) {
                    throw new Error(`Missing artifact for StableBaseCDP`);
                }

interface DeployedContracts {
  [contractName: string]: Contract;
}

export async function deployContracts(): Promise<DeployedContracts> {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);
    
    const contracts: DeployedContracts = {};
    
    // Deploy ChainlinkPriceFeed
        const ChainlinkPriceFeed_factory = new ethers.ContractFactory(
            ChainlinkPriceFeed_artifact.abi,
            ChainlinkPriceFeed_artifact.bytecode,
            deployer
        );
        contracts.ChainlinkPriceFeed = await ChainlinkPriceFeed_factory.deploy(11155111);
        await contracts.ChainlinkPriceFeed.waitForDeployment();
        console.log(`ChainlinkPriceFeed deployed to: ${await contracts.ChainlinkPriceFeed.getAddress()}`);
    
        // Deploy Constants
        const Constants_factory = new ethers.ContractFactory(
            Constants_artifact.abi,
            Constants_artifact.bytecode,
            deployer
        );
        contracts.Constants = await Constants_factory.deploy();
        await contracts.Constants.waitForDeployment();
        console.log(`Constants deployed to: ${await contracts.Constants.getAddress()}`);
    
        // Deploy DFIDToken
        const DFIDToken_factory = new ethers.ContractFactory(
            DFIDToken_artifact.abi,
            DFIDToken_artifact.bytecode,
            deployer
        );
        contracts.DFIDToken = await DFIDToken_factory.deploy();
        await contracts.DFIDToken.waitForDeployment();
        console.log(`DFIDToken deployed to: ${await contracts.DFIDToken.getAddress()}`);
    
        // Deploy DFIREToken
        const DFIREToken_factory = new ethers.ContractFactory(
            DFIREToken_artifact.abi,
            DFIREToken_artifact.bytecode,
            deployer
        );
        contracts.DFIREToken = await DFIREToken_factory.deploy();
        await contracts.DFIREToken.waitForDeployment();
        console.log(`DFIREToken deployed to: ${await contracts.DFIREToken.getAddress()}`);
    
        // Deploy DFIREStaking
        const DFIREStaking_factory = new ethers.ContractFactory(
            DFIREStaking_artifact.abi,
            DFIREStaking_artifact.bytecode,
            deployer
        );
        contracts.DFIREStaking = await DFIREStaking_factory.deploy(true);
        await contracts.DFIREStaking.waitForDeployment();
        console.log(`DFIREStaking deployed to: ${await contracts.DFIREStaking.getAddress()}`);
    
        // Deploy StabilityPool
        const StabilityPool_factory = new ethers.ContractFactory(
            StabilityPool_artifact.abi,
            StabilityPool_artifact.bytecode,
            deployer
        );
        contracts.StabilityPool = await StabilityPool_factory.deploy(true);
        await contracts.StabilityPool.waitForDeployment();
        console.log(`StabilityPool deployed to: ${await contracts.StabilityPool.getAddress()}`);
    
        // Deploy MockPriceOracle
        const MockPriceOracle_factory = new ethers.ContractFactory(
            MockPriceOracle_artifact.abi,
            MockPriceOracle_artifact.bytecode,
            deployer
        );
        contracts.MockPriceOracle = await MockPriceOracle_factory.deploy();
        await contracts.MockPriceOracle.waitForDeployment();
        console.log(`MockPriceOracle deployed to: ${await contracts.MockPriceOracle.getAddress()}`);
    
        // Deploy StableBase
        const StableBase_factory = new ethers.ContractFactory(
            StableBase_artifact.abi,
            StableBase_artifact.bytecode,
            deployer
        );
        contracts.StableBase = await StableBase_factory.deploy();
        await contracts.StableBase.waitForDeployment();
        console.log(`StableBase deployed to: ${await contracts.StableBase.getAddress()}`);
    
        // Deploy StableBaseCDP
        const StableBaseCDP_factory = new ethers.ContractFactory(
            StableBaseCDP_artifact.abi,
            StableBaseCDP_artifact.bytecode,
            deployer
        );
        contracts.StableBaseCDP = await StableBaseCDP_factory.deploy();
        await contracts.StableBaseCDP.waitForDeployment();
        console.log(`StableBaseCDP deployed to: ${await contracts.StableBaseCDP.getAddress()}`);
    
        // Deploy OrderedDoublyLinkedList
        const OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
            OrderedDoublyLinkedList_artifact.abi,
            OrderedDoublyLinkedList_artifact.bytecode,
            deployer
        );
        contracts.OrderedDoublyLinkedList = await OrderedDoublyLinkedList_factory.deploy();
        await contracts.OrderedDoublyLinkedList.waitForDeployment();
        console.log(`OrderedDoublyLinkedList deployed to: ${await contracts.OrderedDoublyLinkedList.getAddress()}`);
    
        // Deploy OrderedDoublyLinkedList
        const OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
            OrderedDoublyLinkedList_artifact.abi,
            OrderedDoublyLinkedList_artifact.bytecode,
            deployer
        );
        contracts.OrderedDoublyLinkedList = await OrderedDoublyLinkedList_factory.deploy();
        await contracts.OrderedDoublyLinkedList.waitForDeployment();
        console.log(`OrderedDoublyLinkedList deployed to: ${await contracts.OrderedDoublyLinkedList.getAddress()}`);
    
    // Configure DFIDToken.setAddresses
        await contracts.DFIDToken.setAddresses(contracts.stableBaseCDP.address);
        console.log(`DFIDToken.setAddresses configured`);
    
        // Configure DFIREToken.setAddresses
        await contracts.DFIREToken.setAddresses(contracts.stabilityPool.address);
        console.log(`DFIREToken.setAddresses configured`);
    
        // Configure DFIREStaking.setAddresses
        await contracts.DFIREStaking.setAddresses(contracts.dfireToken.address, contracts.dfidToken.address, contracts.stableBaseCDP.address);
        console.log(`DFIREStaking.setAddresses configured`);
    
        // Configure StabilityPool.setAddresses
        await contracts.StabilityPool.setAddresses(contracts.dfidToken.address, contracts.stableBaseCDP.address, contracts.dfireToken.address);
        console.log(`StabilityPool.setAddresses configured`);
    
        // Configure StableBase.setAddresses
        await contracts.StableBase.setAddresses(contracts.dfidToken.address, contracts.chainlinkPriceFeed.address, contracts.stabilityPool.address, contracts.dfireStaking.address, contracts.liquidationQueue.address, contracts.redemptionQueue.address);
        console.log(`StableBase.setAddresses configured`);
    
        // Configure OrderedDoublyLinkedList.setAddresses
        await contracts.OrderedDoublyLinkedList.setAddresses(contracts.stableBaseCDP.address);
        console.log(`OrderedDoublyLinkedList.setAddresses configured`);
    
        // Configure OrderedDoublyLinkedList.setAddresses
        await contracts.OrderedDoublyLinkedList.setAddresses(contracts.stableBaseCDP.address);
        console.log(`OrderedDoublyLinkedList.setAddresses configured`);
    
    // Final contract addresses
        console.log("\n=== Deployment Summary ===");
        for (const [name, contract] of Object.entries(contracts)) {
            console.log(`${name}: ${await contract.getAddress()}`);
        }
    
    return contracts;
}