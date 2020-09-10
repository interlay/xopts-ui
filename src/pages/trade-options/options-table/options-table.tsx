import React, { ReactElement, MouseEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../../common/types/util.types";
import { useParams } from "react-router";
import {Option} from "../../../common/types/util.types";
import { findObjByProperty } from "../../../common/utils/utils";
import {changeClickedOptionAction} from "../../../common/actions/ui.actions";

import "./options-table.scss";

type TablePropsType = {
    expiry: string,
    options: Option[]
}

export default function OptionsTable(props: TablePropsType): ReactElement{
    const btcPrice = useSelector((state: AppState) => state.prices.btc);
    const optionsToShow = props.options.filter((option) => option.expiry.toString() === props.expiry);
    const dispatch = useDispatch();
    const { currency } = useParams();
    

    const calculateExpiry = () => {
        const period = optionsToShow[0].expiry - Date.now();
        const days = Math.floor(period/(1000*60*60*24));
        const hours = Math.floor(period/(1000*60*60) - days*24);
        const minutes = Math.floor(period/(1000*60) - (days*24*60 + hours*60));
        return days + " days " + hours + " hours " + minutes + " minutes";
    };

    const createId = (prefix: string,index: number, option: Option): string => {
        return prefix + index + currency + "-" + option.expiry + "-" + option.strikePrice;
    };

    const greenCell = (option: Option):string => {
        return btcPrice < option.strikePrice ? "green-cell" : "";
    };

    const openTradeModal = (event: MouseEvent) => {
        const strikePrice = Number(((event.target as HTMLElement).id).split("-")[2]);
        const clickedOption = findObjByProperty(optionsToShow,strikePrice,"strikePrice");
        dispatch(changeClickedOptionAction(clickedOption));
    };

    return <div className="table-box">
        <div className="table-wrapper">
            <div className="title">
                <b>{new Date(Number(props.expiry)).toDateString().slice(4,15)}</b>
            </div>
            <div className="data-table">
                <div className="row table-heading justify-content-right">
                    <div className="col-xl-6 option-type">Puts</div>
                    <div className="col-xl-6 expires-in">Expires in {calculateExpiry()}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Strike Price</th>
                            <th>Liquidity</th>
                            <th>Last Price</th>
                            <th>Your Obligations ({currency.toUpperCase()})</th>
                            <th>Your Options ({currency.toUpperCase()})</th>
                        </tr>
                    </thead>
                    <tbody onClick={(event)=>openTradeModal(event)} data-toggle="modal"  data-target="#trade-modal">
                        {optionsToShow.map((option,index) => {
                            const oblig = Math.floor(Math.random() * 3)/100;
                            const opt = Math.floor(Math.random() * 5)/100;
                            return <tr id={createId("tr",index,option)} key={index}>
                                <td id={createId("td1",index,option)} className="highlight-col">
                                    {option.strikePrice}
                                </td>
                                <td id={createId("td2",index,option)} className={greenCell(option)}>
                                    <p id={createId("td2p1",index,option)}>
                                        {option.liquidity}
                                    </p>
                                    <p id={createId("td2p2",index,option)}>
                                        $ {(option.liquidity * btcPrice).toFixed(2)}
                                    </p>
                                </td>
                                <td id={createId("td3",index,option)} className={greenCell(option)}>
                                    {Math.floor(Math.random() * 10000)}$
                                </td>
                                <td id={createId("td4",index,option)} className={greenCell(option)}>
                                    <p id={createId("td4p1",index,option)}>
                                        {oblig}
                                    </p>
                                    <p id={createId("td4p2",index,option)}>
                                        $ {(oblig*btcPrice).toFixed(2)}
                                    </p>
                                </td>
                                <td id={createId("td5",index,option)} className={greenCell(option)}>
                                    <p id={createId("td5p1",index,option)}>
                                        {opt}
                                    </p>
                                    <p id={createId("td5p2",index,option)}>
                                        $ {(opt*btcPrice).toFixed(2)}
                                    </p>
                                </td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}
