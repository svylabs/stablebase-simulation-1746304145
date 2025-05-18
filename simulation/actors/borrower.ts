import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { OpenSafeAction } from "./open_safe";

import { CloseSafeAction } from "./close_safe";

import { BorrowAction } from "./borrow";

import { RepayAction } from "./repay";

import { AddCollateralAction } from "./add_collateral";

import { WithdrawCollateralAction } from "./withdraw_collateral";

import { FeeTopupAction } from "./fee_topup";

import { RedeemAction } from "./redeem";


export function createBorrowerActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new OpenSafeAction(contracts.);
    actions.push({action: action, probability: 0.6});
    
    action = new CloseSafeAction(contracts.);
    actions.push({action: action, probability: 0.4});
    
    action = new BorrowAction(contracts.);
    actions.push({action: action, probability: 0.7});
    
    action = new RepayAction(contracts.);
    actions.push({action: action, probability: 0.8});
    
    action = new AddCollateralAction(contracts.);
    actions.push({action: action, probability: 0.5});
    
    action = new WithdrawCollateralAction(contracts.);
    actions.push({action: action, probability: 0.3});
    
    action = new FeeTopupAction(contracts.);
    actions.push({action: action, probability: 0.1});
    
    action = new RedeemAction(contracts.);
    actions.push({action: action, probability: 0.2});
    
    actor = new Actor(
        "Borrower",
        account,
        contracts,
        actions,
    );
    return actor;
}