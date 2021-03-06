import React, { ReactElement, ChangeEvent } from "react";
import Big from "big.js";
import { useSelector, useDispatch } from "react-redux";
import { AppState, Option } from "../../../common/types/util.types";
import { useParams } from "react-router";
import { Currency, ERC20 } from "@interlay/xopts";
import { updateIsUserConnectedAction } from "../../../common/actions/user.actions";

import "./options-table.scss";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

type TablePropsType = {
  expiry: string;
  options: Option<Currency, ERC20>[];
};

export default function OptionsTable(props: TablePropsType): ReactElement {
    const btcPrice = useSelector((state: AppState) => state.prices.btc);
    const optionsToShow = props.options.filter(
        (option) => {
            return option.expiry.toString() === props.expiry;
        }
    );
    const isConnected = useSelector((state: AppState) => state.user.isConnected);
    const { currency } = useParams();
    const dispatch = useDispatch();
    const price = useSelector((state: AppState) => state.prices.btc);

    const calculateExpiry = () => {
        const period = optionsToShow[0].expiry.getTime() - Date.now();
        const days = Math.floor(period / (1000 * 60 * 60 * 24));
        const hours = Math.floor(period / (1000 * 60 * 60) - days * 24);
        const minutes = Math.floor(
            period / (1000 * 60) - (days * 24 * 60 + hours * 60)
        );
        return days + " days " + hours + " hours " + minutes + " minutes";
    };

    const createId = (
        prefix: string,
        index: number,
        option: Option<Currency, ERC20>
    ): string => {
        return (
            prefix +
      index +
      currency +
      "-" +
      option.expiry.getTime() +
      "-" +
      option.strikeNum.toString()
        );
    };

    const greenCell = (option: Option<Currency, ERC20>): string => {
        return new Big(btcPrice) <
            option.strikeNum
            ? "green-cell"
            : "";
    };

    const connectWallet = async (activeLogin: boolean) => {
        const etherProvider = await detectEthereumProvider();
        const isUnlocked = await etherProvider._metamask.isUnlocked();

        if (etherProvider && (activeLogin || isUnlocked)) {
            try {
                const account = await etherProvider.request({
                    method: "eth_requestAccounts",
                });
                console.log(account[0]);
                dispatch(updateIsUserConnectedAction(true, account[0]));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const onChange = (
        event: ChangeEvent,
        index: number,
        option: Option<Currency, ERC20>
    ) => {
        const target = event.target as HTMLInputElement;
        const value = Number(target.value);
        const errorDiv = (target.parentElement as HTMLElement)
            .nextSibling as HTMLElement;
        const buyElement = document.getElementById(
            createId("buy", index, option)
        ) as HTMLElement;
        const sellElement = document.getElementById(
            createId("sell", index, option)
        ) as HTMLElement;

        if (value === 0) {
            buyElement.innerHTML = "Buy";
            sellElement.innerHTML = "Sell";
            buyElement.classList.remove("active");
            sellElement.classList.remove("active");
            target.classList.remove("error-borders");
            errorDiv.innerHTML = "";
            return;
        }
        if (value < option.liquidity && value > 0) {
            buyElement.innerHTML =
        "Buy &nbsp;&nbsp; <span>" + (value * price).toFixed(2) + " USDT</span>";
            sellElement.innerHTML =
        "Sell &nbsp;&nbsp; <span>" +
        (value * price).toFixed(2) +
        " USDT</span>";
            buyElement.classList.add("active");
            sellElement.classList.add("active");
            target.classList.remove("error-borders");
            errorDiv.innerHTML = "";
        } else {
            target.classList.add("error-borders");
            errorDiv.innerHTML = "Quantity exceeds available liquidity";
            buyElement.innerHTML = "Buy";
            sellElement.innerHTML = "Sell";
            buyElement.classList.remove("active");
            sellElement.classList.remove("active");
        }
        console.log(event, option);
    };

    const buyClick = () => {
        if (!isConnected) {
            connectWallet(true);
            return;
        } else {
            // TODO: call to lib -
        }
    };

    const sellClick = () => {
        if (!isConnected) {
            connectWallet(true);
            return;
        } else {
            // TODO: call to lib -
        }
    };

    // const openTradeModal = (event: MouseEvent) => {
    //     const strikePrice = Number(((event.target as HTMLElement).id).split("-")[2]);
    //     const clickedOption = findObjByProperty(optionsToShow,strikePrice,"strikePrice");
    //     dispatch(changeClickedOptionAction(clickedOption));
    // };

    return (
        <div className="table-box">
            <div className="table-wrapper">
                <div className="data-table">
                    <div className="row table-heading justify-content-right">
                        <div className="title">
                            <b>
                                {new Date(props.expiry).toDateString().slice(4, 15)}
                            </b>
                        </div>
                        <div className="col-6 option-type">
                            <p>Puts</p>
                        </div>
                        <div className="col-6 expires-in">
                            <p>
                                <span>Expires in</span> {calculateExpiry()}
                            </p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Strike Price</th>
                                <th>Liquidity</th>
                                <th>Last Price</th>
                                <th>Positions</th>
                                <th>Trade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {optionsToShow.map((option, index) => {
                                const positive = Math.random() > 0.5 ? 1 : -1;
                                const oblig = (Math.floor(Math.random() * 3) / 100) * positive;

                                return (
                                    <tr id={createId("tr", index, option)} key={index}>
                                        <td
                                            id={createId("td1", index, option)}
                                            className="highlight-col"
                                        >
                                            {option.strikeNum.toString()}
                                        </td>
                                        <td
                                            id={createId("td2", index, option)}
                                            className={greenCell(option)}
                                        >
                                            <p id={createId("td2p1", index, option)}>
                                                {option.liquidity.toFixed(2)}
                                            </p>
                                            <p id={createId("td2p2", index, option)}>
                        $ {(option.liquidity * btcPrice).toFixed(2)}
                                            </p>
                                        </td>
                                        <td
                                            id={createId("td3", index, option)}
                                            className={greenCell(option)}
                                        >
                      $ &nbsp;{Math.floor(Math.random() * 10000).toFixed(2)}
                                        </td>
                                        <td
                                            id={createId("td4", index, option)}
                                            className={
                                                greenCell(option) +
                        (oblig >= 0 ? " green-text" : " red-text")
                                            }
                                        >
                                            <p id={createId("td4p1", index, option)}>
                                                {oblig.toFixed(2)}
                                            </p>
                                            <p id={createId("td4p2", index, option)}>
                        $ {(oblig * btcPrice).toFixed(2)}
                                            </p>
                                        </td>
                                        <td
                                            id={createId("td5", index, option)}
                                            className={greenCell(option)}
                                        >
                                            <div className="row">
                                                <div className="col-12 table-input">
                                                    <div className="quantity-label">Quantity:</div>
                                                    <div className="quantity-wrapper">
                                                        <input
                                                            id={createId("quantity", index, option)}
                                                            name="quanity"
                                                            className="quantity-input"
                                                            type="number"
                                                            onChange={(val) => {
                                                                onChange(val, index, option);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="input-error"></div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <button
                                                        id={createId("buy", index, option)}
                                                        className="buy-button"
                                                        onClick={() => buyClick()}
                                                    >
                            Buy
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <button
                                                        id={createId("sell", index, option)}
                                                        className="sell-button"
                                                        onClick={() => sellClick()}
                                                    >
                            Sell
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
