import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { SetStabilityPoolRewardsAction } from "../actions/set_stability_pool_rewards";

import { SetSbrStakingPoolRewardsAction } from "../actions/set_sbr_staking_pool_rewards";


export function createRewardSenderActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new SetStabilityPoolRewardsAction(contracts.StableBase);
    actions.push({action: action, probability: 0.05});
    
    action = new SetSbrStakingPoolRewardsAction(contracts.StableBase);
    actions.push({action: action, probability: 0.05});
    
    actor = new Actor(
        "RewardSender",
        account,
        contracts,
        actions,
    );
    return actor;
}