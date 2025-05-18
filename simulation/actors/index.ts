import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { createBorrowerActor } from "./borrower";

import { createStabilityProviderActor } from "./stability_provider";

import { createDfireStakerActor } from "./dfire_staker";

import { createProtocolActor } from "./protocol";

import { createRewardSenderActor } from "./reward_sender";

import { createRedeemerActor } from "./redeemer";

import { createAdminActor } from "./admin";

import { createChainlinkPriceFeedActor } from "./chainlink_price_feed";


export function setupActors(config: any, accounts: Account[], contracts: Record<string, Contract>): Actor[] {
   let idx = 0;
   const actors: Actor[] = [];

   
    for (let i = 0; i < config.actors.Borrower; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createBorrowerActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.StabilityProvider; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createStabilityProviderActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.DfireStaker; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createDfireStakerActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.Protocol; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createProtocolActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.RewardSender; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createRewardSenderActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.Redeemer; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createRedeemerActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.Admin; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createAdminActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.ChainlinkPriceFeed; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createChainlinkPriceFeedActor(account, contracts);
        actors.push(actor);
    }
   
   return actors;
}