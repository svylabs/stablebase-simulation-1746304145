import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { SetContractAddressesAction } from "../actions/set_contract_addresses";

import { SetStabilityPoolAddressAction } from "../actions/set_stability_pool_address";

import { SetStablebasecdpAddressAction } from "../actions/set_stablebasecdp_address";


export function createAdminActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new SetContractAddressesAction(contracts.StableBase);
    actions.push({action: action, probability: 0.01});
    
    action = new SetStabilityPoolAddressAction(contracts.dfireToken);
    actions.push({action: action, probability: 0.01});
    
    action = new SetStablebasecdpAddressAction(contracts.dfidToken);
    actions.push({action: action, probability: 0.01});
    
    actor = new Actor(
        "Admin",
        account,
        contracts,
        actions,
    );
    return actor;
}