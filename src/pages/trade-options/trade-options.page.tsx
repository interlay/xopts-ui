import React, { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import Page from "../page/page";
import { useDispatch } from "react-redux";
import { addOptionsAction } from "../../common/actions/options.actions";
// import { getOptions } from "../../mock-data/mock-api";
import { AppState, Option } from "../../common/types/util.types";
import { filterUniqueOptions } from "../../common/utils/utils";
import OptionsTable from "./options-table/options-table";
import { useParams } from "react-router";
import TradeModal from "./trade-modal/trade-modal";
import OptionTabs from "./option-tabs/option-tabs";
import { XOpts, SignerOrProvider, Currency, ERC20 } from "@interlay/xopts/";

import "./trade-options.page.scss";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

const filterOptions = (
  selectedPage: string,
  options: Option<Currency, ERC20>[]
): Option<Currency, ERC20>[] => {
  let optionsToShow: Option<Currency, ERC20>[] = [];
  const uniqueOptions = filterUniqueOptions(options);
  if (selectedPage === "all-expirations") {
    optionsToShow = uniqueOptions;
  } else {
    uniqueOptions.forEach((option): void => {
      if (option.expiry.toString() === selectedPage) {
        optionsToShow.push(option);
      }
    });
  }
  return optionsToShow;
};

export default function TradeOptionsPage(): ReactElement {
  const dispatch = useDispatch();
  const options = useSelector((state: AppState) => state.options);
  const selectedPage = useSelector((state: AppState) => state.ui.selectedPage);
  const optionsToShow = filterOptions(selectedPage, options);
  const { currency } = useParams();
  const btcPrice = useSelector((state: AppState) => state.prices.btc);

  // this function will be removed after real options are pulled from contracts
  useEffect(() => {
    const fetchOptions = async () => {
      const provider: SignerOrProvider = await detectEthereumProvider();
      const xopts: XOpts<SignerOrProvider> = await XOpts.load(provider);
      const options = (await xopts.options.list()) as Option<Currency, ERC20>[];
      // TODO: call to lib -
      //const options = await getOptions<Option[]>();
      // const test = await xopts.options.list();
      console.log(xopts);
      console.log(options);
      dispatch(addOptionsAction(options));
    };
    fetchOptions();
  }, [currency, dispatch]);

  // these objects will be removed once we have real data
  const li1 =
    (Math.floor(Math.random() + 1) / 100) * (Math.random() > 0.5 ? 1 : -1);
  const li2 =
    (Math.floor(Math.random() + 1) / 100) * (Math.random() > 0.5 ? 1 : -1);
  const po1 =
    (Math.floor(Math.random() + 1) / 100) * (Math.random() > 0.5 ? 1 : -1);
  const po2 =
    (Math.floor(Math.random() + 1) / 100) * (Math.random() > 0.5 ? 1 : -1);
  const pe1 =
    (Math.floor(Math.random() + 1) / 100) * (Math.random() > 0.5 ? 1 : -1);
  const pe2 =
    (Math.floor(Math.random() + 1) / 100) * (Math.random() > 0.5 ? 1 : -1);

  return (
    <Page>
      <div className="trade-options-page">
        <div className="main-title">BTC Options</div>
        <TradeModal currency={currency}></TradeModal>
        <section id="options-section">
          <OptionTabs></OptionTabs>
          {optionsToShow.map((option, index) => {
            return (
              <OptionsTable
                expiry={option.expiry.toString()}
                options={options}
                key={index}
              ></OptionsTable>
            );
          })}
        </section>
        <section id="positions-section">
          <div className="table-box">
            <div className="table-wrapper">
              <div className="data-table">
                <div className="positions-title">Positions</div>
                <table>
                  <thead>
                    <tr>
                      <th>Expiry Date</th>
                      <th>Strike Price</th>
                      <th>Liquidity</th>
                      <th>Positions</th>
                      <th>
                        Performance &nbsp;&nbsp;
                        <i
                          className="fas fa-info-circle"
                          data-tip="Earned/paid premium + option performance"
                        ></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {new Date(1603598437527).toDateString().slice(4, 15)}
                      </td>
                      <td>10500</td>
                      <td>
                        <p>{li1}</p>
                        <p>{(li1 * btcPrice).toFixed(2)}$</p>
                      </td>
                      <td className={po1 >= 0 ? "green-text" : "red-text"}>
                        <p>{po1}</p>
                        <p>{(po1 * btcPrice).toFixed(2)}$</p>
                      </td>
                      <td className={li1 >= 0 ? "green-text" : "red-text"}>
                        <p>{pe1}</p>
                        <p>{(pe1 * btcPrice).toFixed(2)}$</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {new Date(1603598437527).toDateString().slice(4, 15)}
                      </td>
                      <td>11000</td>
                      <td>
                        <p>{li2}</p>
                        <p>{(li2 * btcPrice).toFixed(2)}$</p>
                      </td>
                      <td className={po2 >= 0 ? "green-text" : "red-text"}>
                        <p>{po2}</p>
                        <p>{(po2 * btcPrice).toFixed(2)}$</p>
                      </td>
                      <td className={pe2 >= 0 ? "green-text" : "red-text"}>
                        <p>{pe2}</p>
                        <p>{(pe2 * btcPrice).toFixed(2)}$</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
