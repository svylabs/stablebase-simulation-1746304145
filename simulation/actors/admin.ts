import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { SetContractAddressesAction } from "./set_contract_addresses";

import { SetStabilityPoolAddressAction } from "./set_stability_pool_address";

import { SetStablebasecdpAddressAction } from "./set_stablebasecdp_address";


export function createAdminActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new SetContractAddressesAction(contracts.);
    actions.push({action: action, probability: 0.01});
    
    action = new SetStabilityPoolAddressAction(contracts.);
    actions.push({action: action, probability: 0.01});
    
    action = new SetStablebasecdpAddressAction(contracts.);
    actions.push({action: action, probability: 0.01});
    
    actor = new Actor(
        "Admin",
        account,
        contracts,
        actions,
    );
    return actor;
}