import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { StakeAction } from "../actions/stake";

import { UnstakeAction } from "../actions/unstake";

import { ClaimAction } from "../actions/claim";


export function createStabilityProviderActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new StakeAction(contracts.stabilityPool);
    actions.push({action: action, probability: 0.7});
    
    action = new UnstakeAction(contracts.stabilityPool);
    actions.push({action: action, probability: 0.6});
    
    action = new ClaimAction(contracts.stabilityPool);
    actions.push({action: action, probability: 0.8});
    
    actor = new Actor(
        "StabilityProvider",
        account,
        contracts,
        actions,
    );
    return actor;
}