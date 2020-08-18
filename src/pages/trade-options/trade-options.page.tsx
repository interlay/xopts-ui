import React, { ReactElement, useEffect } from "react";
import Page from "../page/page";
import { useDispatch } from "react-redux";
import { addOptionsAction } from "../../common/actions/options.actions";

export default function TradeOptionsPage (): ReactElement {
    const dispatch = useDispatch();

    // this function will be removed after real options are pulled from backend
    useEffect(()=>{
        const options = [{
            contract: "some contract",
            expiry: 1559514940161,
            strikePrice: "450",
            spotPrice: 309,
            liquidity: "dsaf"
        },
        {
            contract: "some contract",
            expiry: 1559754750161,
            strikePrice: "450",
            spotPrice: 309,
            liquidity: "dsaf"
        },
        {
            contract: "some contract",
            expiry: 1559994770161,
            strikePrice: "450",
            spotPrice: 309,
            liquidity: "dsaf"
        }
        ];
        dispatch(addOptionsAction(options));
    });
    return <Page>
        <div> data tables goes here 
        </div>
    </Page>;
}