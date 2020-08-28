import React, { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import Page from "../page/page";
import { useDispatch } from "react-redux";
import { addOptionsAction } from "../../common/actions/options.actions";
import { getOptions } from "../../mock-data/mock-api";
import { Option, AppState } from "../../common/types/util.types";
import { filterUniqueOptions } from "../../common/utils/utils";
import OptionsTable from "./options-tabe";

import "./trade-options.page.scss";

const filterOptions = (selectedPage: string, options: Option[]): Option[] => {
    let optionsToShow: Option[] = [];
    const uniqueOptions = filterUniqueOptions(options);
    if (selectedPage === "all-expirations") {
        optionsToShow = uniqueOptions;
    } else {
        uniqueOptions.map((option):void => {
            if (option.expiry.toString() === selectedPage){
                optionsToShow.push(option);
            }
        });
    }
    return optionsToShow;
};

export default function TradeOptionsPage (): ReactElement {
    const dispatch = useDispatch();
    const options = useSelector((state: AppState) => state.options);
    const selectedPage = useSelector((state: AppState) => state.ui.selectedPage);
    const optionsToShow = filterOptions(selectedPage,options);
    // this function will be removed after real options are pulled from backend
    useEffect(()=>{
        const fetchOptions = async () => {
            const options = await getOptions<Option[]>();
            dispatch(addOptionsAction(options));
        };
        fetchOptions();
    },[]);



    return <Page>
        <div className="trade-options-page">
            <section id="options-section">
                {optionsToShow.map((option,index)=>{
                    return <OptionsTable expiry={option.expiry.toString()} key={index}></OptionsTable>;
                })}
            </section>
            <section id="positions-section">
                Positions
            </section>
        </div>
    </Page>;
}
