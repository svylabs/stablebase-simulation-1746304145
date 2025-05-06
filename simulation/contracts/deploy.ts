import { ethers } from "hardhat";
// import { upgrades } from "@openzeppelin/hardhat-upgrades";
import DFIDToken_json from "../artifacts/contracts/DFIDToken.sol/DFIDToken.json";
import DFIREToken_json from "../artifacts/contracts/DFIREToken.sol/DFIREToken.json";
import MockPriceOracle_json from "../artifacts/contracts/MockPriceOracle.sol/MockPriceOracle.json";
import DFIREStaking_json from "../artifacts/contracts/DFIREStaking.sol/DFIREStaking.json";
import OrderedDoublyLinkedList_json from "../artifacts/contracts/OrderedDoublyLinkedList.sol/OrderedDoublyLinkedList.json";
import StabilityPool_json from "../artifacts/contracts/StabilityPool.sol/StabilityPool.json";
import StableBaseCDP_json from "../artifacts/contracts/StableBaseCDP.sol/StableBaseCDP.json";


async function deployContracts() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy DFIDToken
    const DFIDToken_factory = new ethers.ContractFactory(
        DFIDToken_json.abi,
        DFIDToken_json.bytecode,
        deployer
    );
    const dfidToken = await DFIDToken_factory.deploy();
    await dfidToken.waitForDeployment();
    console.log("DFIDToken address:", dfidToken.target);

    // Deploy DFIREToken
    const DFIREToken_factory = new ethers.ContractFactory(
        DFIREToken_json.abi,
        DFIREToken_json.bytecode,
        deployer
    );
    const dfireToken = await DFIREToken_factory.deploy();
    await dfireToken.waitForDeployment();
    console.log("DFIREToken address:", dfireToken.target);

    // Deploy MockPriceOracle
    const MockPriceOracle_factory = new ethers.ContractFactory(
        MockPriceOracle_json.abi,
        MockPriceOracle_json.bytecode,
        deployer
    );
    const mockPriceOracle = await MockPriceOracle_factory.deploy();
    await mockPriceOracle.waitForDeployment();
    console.log("MockPriceOracle address:", mockPriceOracle.target);

    // Deploy DFIREStaking
    const DFIREStaking_factory = new ethers.ContractFactory(
        DFIREStaking_json.abi,
        DFIREStaking_json.bytecode,
        deployer
    );
    const dfireStaking = await DFIREStaking_factory.deploy(true);
    await dfireStaking.waitForDeployment();
    console.log("DFIREStaking address:", dfireStaking.target);

    // Deploy OrderedDoublyLinkedList (for liquidation queue)
    let OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
        OrderedDoublyLinkedList_json.abi,
        OrderedDoublyLinkedList_json.bytecode,
        deployer
    );
    const liquidationQueue = await OrderedDoublyLinkedList_factory.deploy();
    await liquidationQueue.waitForDeployment();
    console.log("LiquidationQueue address:", liquidationQueue.target);

    // Deploy OrderedDoublyLinkedList (for redemption queue)
    OrderedDoublyLinkedList_factory = new ethers.ContractFactory(
        OrderedDoublyLinkedList_json.abi,
        OrderedDoublyLinkedList_json.bytecode,
        deployer
    );
    const redemptionQueue = await OrderedDoublyLinkedList_factory.deploy();
    await redemptionQueue.waitForDeployment();
    console.log("RedemptionQueue address:", redemptionQueue.target);

    // Deploy StabilityPool
    const StabilityPool_factory = new ethers.ContractFactory(
        StabilityPool_json.abi,
        StabilityPool_json.bytecode,
        deployer
    );
    const stabilityPool = await StabilityPool_factory.deploy(true);
    await stabilityPool.waitForDeployment();
    console.log("StabilityPool address:", stabilityPool.target);

    // Deploy StableBaseCDP
    const StableBaseCDP_factory = new ethers.ContractFactory(
        StableBaseCDP_json.abi,
        StableBaseCDP_json.bytecode,
        deployer
    );
    const stableBaseCDP = await StableBaseCDP_factory.deploy();
    await stableBaseCDP.waitForDeployment();
    console.log("StableBaseCDP address:", stableBaseCDP.target);

    // Set addresses on StableBaseCDP
    await stableBaseCDP.setAddresses(
        dfidToken.target,
        mockPriceOracle.target,
        stabilityPool.target,
        dfireStaking.target,
        liquidationQueue.target,
        redemptionQueue.target
    );
    console.log("StableBaseCDP setAddresses called");

    // Set address on DFIDToken
    await dfidToken.setAddresses(stableBaseCDP.target);
    console.log("DFIDToken setAddresses called");

    // Set address on DFIREToken
    await dfireToken.setAddresses(stabilityPool.target);
    console.log("DFIREToken setAddresses called");

    // Set addresses on DFIREStaking
    await dfireStaking.setAddresses(
        dfireToken.target,
        dfireToken.target,
        stableBaseCDP.target
    );
    console.log("DFIREStaking setAddresses called");

    // Set addresses on StabilityPool
    await stabilityPool.setAddresses(
        dfidToken.target,
        stableBaseCDP.target,
        dfireToken.target
    );
    console.log("StabilityPool setAddresses called");

    // Set addresses on LiquidationQueue
    await liquidationQueue.setAddresses(stableBaseCDP.target);
    console.log("LiquidationQueue setAddresses called");

    // Set addresses on RedemptionQueue
    await redemptionQueue.setAddresses(stableBaseCDP.target);
    console.log("RedemptionQueue setAddresses called");

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

export default deployContracts;