import React, { Component } from "react";
import { Col, Row, Table, Button, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import * as utils from '../utils/utils';
import PayWizard from './wizards/Pay';
import ConfWizard from './wizards/Confirm';
import { ButtonTool } from "./ButtonTool";
import {AppProps} from "../types/App";
import { Big } from 'big.js';
import { FormControlElement } from "../types/Inputs";
import { BigNumber } from "ethers/utils";
import cx from 'classnames';
import s from './UserPurchasedOptions.module.scss';
import Widget from "./Widget/Widget";

interface UserPurchasedOptionsState {
    purchasedLoaded: boolean
    purchasedOptions: {
        expiry: number;
        premium: Big;
        strikePrice: Big;
        totalSupply: Big;
        totalSupplyLocked: Big;
        numSellers: number;
        spotPrice: Big;
        contract: string;
        btcInsured: Big;
        premiumPaid: Big;
        income: Big;    
    }[]
    totalInsured: Big
    insuranceAvailable: Big
    paidPremium: Big
    totalIncome: Big
    amount: number
    height: number
    index: number
    txid: string
    proof: string
    rawtx: string
    showPayModal: boolean
    showConfModal: boolean
    contractAddress: string
}

export default class UserPurchasedOptions extends Component<AppProps> {
    state: UserPurchasedOptionsState = {
        purchasedLoaded: false,
        purchasedOptions: [],
        totalInsured: utils.newBig(0),
        insuranceAvailable: utils.newBig(0),
        paidPremium: utils.newBig(0),
        totalIncome: utils.newBig(0),
        amount: 0,
        height: 0,
        index: 0,
        txid: '',
        proof: '',
        rawtx: '',
        showPayModal: false,
        showConfModal: false,
        contractAddress: '',
    }

    constructor(props: AppProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.showPayModal = this.showPayModal.bind(this);
        this.hidePayModal = this.hidePayModal.bind(this);
        this.hideConfModal = this.hideConfModal.bind(this);
        this.reloadPurchased = this.reloadPurchased.bind(this);
    }

    componentDidUpdate() {
        if (this.props.contracts && this.props.address) {
            if (!this.state.purchasedLoaded) {
                this.getAvailableOptions();
            }
        }
    }

    async getAvailableOptions() {
        if (this.props.contracts && this.props.address) {
            let optionContracts = await this.props.contracts.getUserPurchasedOptions(this.props.address);
            let purchasedOptions = await this.getOptions(optionContracts);
            this.setState({
                purchasedOptions: purchasedOptions,
                purchasedLoaded: true
            });
        }
    }

    async getOptions(optionContracts: {
        optionContracts: string[];
        purchasedOptions: BigNumber[];
    }) {
        // Remove 0-value contracts
        for (let i = optionContracts.purchasedOptions.length - 1; i >= 0; i--) {
            if (optionContracts.purchasedOptions[i].eq(0)) {
                optionContracts.optionContracts.splice(i, 1);
                optionContracts.purchasedOptions.splice(i, 1);
            }
        }

        let options = [];
        let totalBtcInsured = utils.newBig(0);
        let paidPremium = utils.newBig(0);
        let totalIncome = utils.newBig(0);
        try {
            for (let i = 0; i < optionContracts.optionContracts.length; i++) {
                let addr = optionContracts.optionContracts[i];
                let optionContract = this.props.contracts?.attachOption(addr);
                let optionRes = await optionContract.getDetails();
                let option = {
                    expiry: parseInt(optionRes.expiry.toString()),
                    premium: utils.weiDaiToBtc(utils.newBig(optionRes.premium.toString())),
                    strikePrice: utils.weiDaiToBtc(utils.newBig(optionRes.strikePrice.toString())),
                    totalSupply: utils.weiDaiToDai(utils.newBig(optionRes.total.toString())),
                    // User's purchased options
                    totalSupplyLocked: utils.weiDaiToDai(utils.newBig(optionContracts.purchasedOptions[i].toString())),
                    numSellers: (await optionContract.getOptionOwners()).length,

                    spotPrice: utils.newBig(0),
                    contract: '',
                    btcInsured: utils.newBig(0),
                    premiumPaid: utils.newBig(0),
                    income: utils.newBig(0),
                }
                option.spotPrice = utils.newBig(this.props.btcPrices.dai);
                option.contract = optionContracts.optionContracts[i];
                option.btcInsured = option.totalSupplyLocked.div(option.strikePrice);
                option.premiumPaid = option.premium.mul(option.btcInsured);

                let income = option.btcInsured.mul(option.strikePrice.sub(option.spotPrice).sub(option.premium));
                option.income = income;
                options.push(option);

                paidPremium = paidPremium.add(option.premiumPaid);
                totalBtcInsured = totalBtcInsured.add(option.btcInsured);
                totalIncome = totalIncome.add(option.income);
            }
            this.setState({
                paidPremium: paidPremium,
                totalInsured: totalBtcInsured,
                totalIncome: totalIncome,
                totalBtcInsured: totalBtcInsured
            });
        } catch (error) {
            console.log(error);
        }
        return options;
    }

    // TODO: fetch number of sellers
    hasNonPendingSellers(contract: string, numSellers: number) {
        return this.props.storage.getPendingTransactionsFor(contract).length !== numSellers;
    }

    renderTableData() {
        if (this.state.purchasedOptions.length > 0) {
            return this.state.purchasedOptions.map((option, index) => {
                const { expiry, premium, strikePrice, spotPrice, totalSupply, totalSupplyLocked, income, premiumPaid, contract } = option;
                const id = utils.btcPutOptionId(expiry, strikePrice.toString());
                let percentInsured = ((totalSupply.lte(0)) ? utils.newBig(0) : (totalSupplyLocked.div(totalSupply)).mul(100));
                return (
                    <tr key={contract}>
                        <td>{id}</td>
                        <td>{new Date(expiry * 1000).toLocaleString()}</td>
                        <td>{strikePrice.toString()} DAI</td>
                        <td><span className={(income.gte(0.0) ? "text-success" : "text-danger")}>{spotPrice.toString()}</span> DAI</td>
                        <td>{totalSupplyLocked.round(2, 0).toString()} / {totalSupply.round(2, 0).toString()} DAI ({percentInsured.toFixed(0)} %)</td>
                        <td>{premiumPaid.round(2, 0).toString()} DAI <br /> ({premium.round(2, 0).toString()} DAI/BTC)</td>
                        <td>
                          <strong className={(income.gte(0.0) ? "text-success" : "text-danger")}>
                            {( income.round(2,0).toString() )}
                          </strong> DAI </td>

                        <td>
                            <ButtonTool
                                // TODO: allow repeats 
                                disable={!this.hasNonPendingSellers(contract, option.numSellers)}
                                reason={"Pending"}
                                placement={"left"}
                                text={"Exercise"}
                                variant={"outline-success"}
                                show={this.showPayModal}
                                showValue={option.contract}
                            />
                            {" "}
                            {
                                this.props.storage.hasPendingTransactionsFor(option.contract) &&
                                    <Button 
                                        variant="outline-success"
                                        // disabled={!this.hasNonPendingSellers(contract, 1)}
                                        onClick={() => { this.showConfModal(option.contract) }}>
                                        Confirm
                                    </Button>
                            }
                        </td>
                    </tr>
                )
            })
        } else {
            return <tr><td className="text-center" colSpan={8}>No Options</td></tr>
        }
    }

    handleChange(event: React.ChangeEvent<FormControlElement>) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    showPayModal(contract: string) {
        this.setState({
            contractAddress: contract,
            showPayModal: true,
        });
    }

    hidePayModal() {
        this.setState({
            showPayModal: false,
        })
    }

    showConfModal(contract: string) {
        this.setState({
            contractAddress: contract,
            showConfModal: true,
        });
    }

    hideConfModal() {
        this.setState({
            showConfModal: false,
        })
    }

    reloadPurchased() {
        this.getAvailableOptions();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <Widget title="Purchased BTC/DAI Put Option Contracts">
                            <div>
                                {this.state.purchasedLoaded &&
                                    <Row className="text-center">
                                        <Col>
                                            <h3>{this.state.totalInsured.round(2, 0).toString()} BTC</h3>
                                            <h6>Insured</h6>
                                        </Col>
                                        <Col>
                                            <h3>{this.state.paidPremium.round(2, 0).toString()} DAI</h3>
                                            <h6>Premium Paid</h6>
                                        </Col>
                                        <Col>
                                            <h3 className={(this.state.totalIncome.gt(0) ? "text-success" : (this.state.totalIncome.toLocaleString() ? "text-danger" : ""))}>{this.state.totalIncome.round(2, 0).toString()} DAI</h3>
                                            <h6>(Potential) Income</h6>
                                        </Col>
                                    </Row>
                                }

                                {this.state.purchasedLoaded &&
                                    <Row>
                                        <Table responsive borderless className={cx('mb-0', s.optionsTable)}>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Expiry</th>
                                                    <th>Strike Price</th>
                                                    <th>Current Price</th>
                                                    <th>Insurance Issued</th>
                                                    <th>Premium Paid</th>
                                                    <th>Potential Earnings / Losses</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderTableData()}
                                            </tbody>
                                        </Table>
                                    </Row>
                                }
                            </div>
                            <PayWizard 
                                contract={this.state.contractAddress}
                                hide={this.hidePayModal}
                                toast={toast}
                                reloadPurchased={this.reloadPurchased}
                                showPayModal={this.state.showPayModal}
                                {...this.props}>
                            </PayWizard>
                            <ConfWizard 
                                contract={this.state.contractAddress}
                                hide={this.hideConfModal}
                                toast={toast}
                                reloadPurchased={this.reloadPurchased}
                                showConfModal={this.state.showConfModal}
                                {...this.props}>
                            </ConfWizard>
                        </Widget>
                    </Col>
                </Row>

            </div>
        );
    }
}
