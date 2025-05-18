import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { OpenSafeAction } from "../actions/open_safe";

import { CloseSafeAction } from "../actions/close_safe";

import { BorrowAction } from "../actions/borrow";

import { RepayAction } from "../actions/repay";

import { AddCollateralAction } from "../actions/add_collateral";

import { WithdrawCollateralAction } from "../actions/withdraw_collateral";

import { FeeTopupAction } from "../actions/fee_topup";

import { RedeemAction } from "../actions/redeem";


export function createBorrowerActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new OpenSafeAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.6});
    
    action = new CloseSafeAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.4});
    
    action = new BorrowAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.7});
    
    action = new RepayAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.8});
    
    action = new AddCollateralAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.5});
    
    action = new WithdrawCollateralAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.3});
    
    action = new FeeTopupAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.1});
    
    action = new RedeemAction(contracts.stableBaseCDP);
    actions.push({action: action, probability: 0.2});
    
    actor = new Actor(
        "Borrower",
        account,
        contracts,
        actions,
    );
    return actor;
}