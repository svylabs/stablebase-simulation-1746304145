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
    [contractName: string]: Contract
}> {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const DFIDToken_factory = new ethers.ContractFactory(
        DFIDToken_json.abi,
        DFIDToken_json.bytecode,
        deployer
    );
    const dfidToken = await DFIDToken_factory.deploy();
    await dfidToken.waitForDeployment();
    console.log("DFIDToken address:", dfidToken.target);

    const DFIREToken_factory = new ethers.ContractFactory(
        DFIREToken_json.abi,
        DFIREToken_json.bytecode,
        deployer
    );
    const dfireToken = await DFIREToken_factory.deploy();
    await dfireToken.waitForDeployment();
    console.log("DFIREToken address:", dfireToken.target);

    const MockPriceOracle_factory = new ethers.ContractFactory(
        MockPriceOracle_json.abi,
        MockPriceOracle_json.bytecode,
        deployer
    );
    const mockPriceOracle = await MockPriceOracle_factory.deploy();
    await mockPriceOracle.waitForDeployment();
    console.log("MockPriceOracle address:", mockPriceOracle.target);

    const DFIREStaking_factory = new ethers.ContractFactory(
        DFIREStaking_json.abi,
        DFIREStaking_json.bytecode,
        deployer
    );
    const dfireStaking = await DFIREStaking_factory.deploy(true);
    await dfireStaking.waitForDeployment();
    console.log("DFIREStaking address:", dfireStaking.target);

    const OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
        OrderedDoublyLinkedList_json.abi,
        OrderedDoublyLinkedList_json.bytecode,
        deployer
    );
    const liquidationQueue = await OrderedDoublyLinkedList_factory.deploy();
    await liquidationQueue.waitForDeployment();
    console.log("LiquidationQueue address:", liquidationQueue.target);

    const redemptionQueue = await OrderedDoublyLinkedList_factory.deploy();
    await redemptionQueue.waitForDeployment();
    console.log("RedemptionQueue address:", redemptionQueue.target);

    const StabilityPool_factory = new ethers.ContractFactory(
        StabilityPool_json.abi,
        StabilityPool_json.bytecode,
        deployer
    );
    const stabilityPool = await StabilityPool_factory.deploy(true);
    await stabilityPool.waitForDeployment();
    console.log("StabilityPool address:", stabilityPool.target);

    const StableBaseCDP_factory = new ethers.ContractFactory(
        StableBaseCDP_json.abi,
        StableBaseCDP_json.bytecode,
        deployer
    );
    const stableBaseCDP = await StableBaseCDP_factory.deploy();
    await stableBaseCDP.waitForDeployment();
    console.log("StableBaseCDP address:", stableBaseCDP.target);

    // Set Addresses
    await stableBaseCDP.setAddresses(
        dfidToken.target,
        mockPriceOracle.target,
        stabilityPool.target,
        dfireStaking.target,
        liquidationQueue.target,
        redemptionQueue.target
    );
    console.log("StableBaseCDP setAddresses done");

    await dfidToken.setAddresses(stableBaseCDP.target);
    console.log("DFIDToken setAddresses done");

    await dfireToken.setAddresses(stabilityPool.target);
    console.log("DFIREToken setAddresses done");

    await dfireStaking.setAddresses(
        dfireToken.target,
        dfireToken.target,
        stableBaseCDP.target
    );
    console.log("DFIREStaking setAddresses done");

    await stabilityPool.setAddresses(
        dfidToken.target,
        stableBaseCDP.target,
        dfireToken.target
    );
    console.log("StabilityPool setAddresses done");

    await liquidationQueue.setAddresses(stableBaseCDP.target);
    console.log("LiquidationQueue setAddresses done");

    await redemptionQueue.setAddresses(stableBaseCDP.target);
    console.log("RedemptionQueue setAddresses done");

    return {
        dfidToken,
        dfireToken,
        mockPriceOracle,
        dfireStaking,
        liquidationQueue,
        redemptionQueue,
        stabilityPool,
        stableBaseCDP
    };
}

export default deployContracts;
