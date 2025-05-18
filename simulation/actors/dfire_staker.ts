import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { StakeAction } from "../actions/dfirestaking_stake";

import { UnstakeAction } from "../actions/dfirestaking_unstake";

import { ClaimAction } from "../actions/dfirestaking_claim";


export function createDfireStakerActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new StakeAction(contracts.dfireStaking);
    actions.push({action: action, probability: 0.6});
    
    action = new UnstakeAction(contracts.dfireStaking);
    actions.push({action: action, probability: 0.5});
    
    action = new ClaimAction(contracts.dfireStaking);
    actions.push({action: action, probability: 0.8});
    
    actor = new Actor(
        "DfireStaker",
        account,
        contracts,
        actions,
    );
    return actor;
}