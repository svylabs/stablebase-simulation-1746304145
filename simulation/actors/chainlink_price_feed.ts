import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { FetchPriceAction } from "../actions/chainlinkpricefeed_fetch_price";


export function createChainlinkPriceFeedActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new FetchPriceAction(contracts.ChainlinkPriceFeed);
    actions.push({action: action, probability: 0.9});
    
    actor = new Actor(
        "ChainlinkPriceFeed",
        account,
        contracts,
        actions,
    );
    return actor;
}