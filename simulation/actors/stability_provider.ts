import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { StakeAction } from "./stake";

import { UnstakeAction } from "./unstake";

import { ClaimAction } from "./claim";


export function createStabilityProviderActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new StakeAction(contracts.);
    actions.push({action: action, probability: 0.7});
    
    action = new UnstakeAction(contracts.);
    actions.push({action: action, probability: 0.6});
    
    action = new ClaimAction(contracts.);
    actions.push({action: action, probability: 0.8});
    
    actor = new Actor(
        "StabilityProvider",
        account,
        contracts,
        actions,
    );
    return actor;
}