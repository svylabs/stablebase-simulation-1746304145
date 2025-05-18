import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { LiquidateSafesAction } from "./liquidate_safes";

import { ExecuteLiquidationAction } from "./execute_liquidation";

import { MintDfidAction } from "./mint_dfid";

import { BurnDfidAction } from "./burn_dfid";

import { MintDfireAction } from "./mint_dfire";

import { BurnDfireAction } from "./burn_dfire";


export function createProtocolActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new LiquidateSafesAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.2});
    
    action = new ExecuteLiquidationAction(contracts.stabilityPool);
    actions.push({action: action, probability: 0.3});
    
    action = new MintDfidAction(contracts.dfidToken);
    actions.push({action: action, probability: 0.05});
    
    action = new BurnDfidAction(contracts.dfidToken);
    actions.push({action: action, probability: 0.05});
    
    action = new MintDfireAction(contracts.dfireToken);
    actions.push({action: action, probability: 0.05});
    
    action = new BurnDfireAction(contracts.dfireToken);
    actions.push({action: action, probability: 0.05});
    
    actor = new Actor(
        "Protocol",
        account,
        contracts,
        actions,
    );
    return actor;
}