import React, { Component } from "react";
import { Col, Row, Table, Button, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import * as utils from '../utils/utils';
import PayWizard from './wizards/Pay';
import ConfWizard from './wizards/Confirm';
import { ButtonTool } from "./ButtonTool";
import {AppProps} from "../types/App";
import { OptionDetailsProps, OptionAmount } from "../types/Contracts";
import { Big } from 'big.js';
import { FormControlElement } from "../types/Inputs";


interface PurchasedOptionProps {
    expiry: number;
    premium: Big;
    strikePrice: Big;
    totalSupply: Big;
    totalSupplyLocked: Big;
    numSellers: number;
    contract: string;
}

class PurchasedOption {
    private props: PurchasedOptionProps;

    constructor(props: PurchasedOptionProps) {
        this.props = props;
    }

    get expiry(): number { return this.props.expiry; }
    get premium(): Big { return this.props.premium; }
    get strikePrice(): Big { return this.props.strikePrice; }
    get totalSupply(): Big { return this.props.totalSupply; }
    get totalSupplyLocked(): Big { return this.props.totalSupplyLocked; }
    get numSellers(): number { return this.props.numSellers; }
    get contract(): string { return this.props.contract; }
    get btcInsured(): Big { return this.totalSupplyLocked.div(this.strikePrice); }
    get premiumPaid(): Big { return this.premium.mul(this.btcInsured); }
    computeIncome(spotPrice: Big): Big {
        return this.btcInsured.mul(this.strikePrice.sub(spotPrice).sub(this.premium));
    }

    static fromResponse(address: string, numSellers: number,
                        totalSupplyLocked: Big, details: OptionDetailsProps): PurchasedOption {
        let props = {
            expiry: parseInt(details.expiry.toString()),
            premium: utils.weiDaiToBtc(utils.newBig(details.premium.toString())),
            strikePrice: utils.weiDaiToBtc(utils.newBig(details.strikePrice.toString())),
            totalSupply: utils.weiDaiToDai(utils.newBig(details.total.toString())),
            totalSupplyLocked: totalSupplyLocked,
            numSellers: numSellers,
            contract: address
        };
        return new PurchasedOption(props);
    }

    toJSON(): object {
        return this.props;
    }

    static fromJSON(item: any): PurchasedOption {
        return new PurchasedOption({
            expiry: item.expiry,
            premium: utils.newBig(item.premium),
            strikePrice: utils.newBig(item.strikePrice),
            totalSupply: utils.newBig(item.totalSupply),
            totalSupplyLocked: utils.newBig(item.totalSupplyLocked),
            numSellers: item.numSellers,
            contract: item.contract,
        });
    }
}

interface UserPurchasedOptionsState {
    purchasedLoaded: boolean
    purchasedOptions: PurchasedOption[]
    totalInsured: Big
    insuranceAvailable: Big
    paidPremium: Big
    totalIncome: Big
    loading: boolean
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
        loading: false,
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
                this.loadOptions();
            }
        }
    }

    async loadOptions() {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });

        let purchasedOptions = await this.getAvailableOptions(true);
        this.setState({ purchasedOptions });
        try {
            purchasedOptions = await this.getAvailableOptions(false);
        } catch (err) {
            console.error(err);
        }

        this.setState({
            purchasedOptions: purchasedOptions,
            purchasedLoaded: true,
            loading: false
        });
    }

    async getPurchasedOptions(useCache: boolean = false): Promise<OptionAmount[]> {
        const key = `user-purchased-options`;
        if (useCache) {
            const result = this.props.persistenStorage.loadItem(key, arr => {
                return arr.map((v: any) => {
                    return { address: v.address, totalAmount: utils.newBig(v.totalAmount) };
                });
            });
            return result || [];
        }
        const result = await this.props.contracts.getUserPurchasedOptions(this.props.address);
        this.props.persistenStorage.storeItem(key, result);
        return result;
    }

    async getAvailableOptions(useCache: boolean = false) {
        if (this.props.contracts && this.props.address) {
            let optionContracts = await this.getPurchasedOptions(useCache);
            return await this.getOptions(optionContracts, useCache);
        }
        return [];
    }

    async getOption(optionAmount: OptionAmount, useCache: boolean = false): Promise<PurchasedOption | null> {
        const key = `purchased-option:${optionAmount.address}`;
        if (useCache) {
            return this.props.persistenStorage.loadItem(key, PurchasedOption.fromJSON);
        }
        let optionContract = this.props.contracts?.attachOption(optionAmount.address);
        let optionRes = await optionContract.getDetails();
        const numSellers = (await optionContract.getOptionOwners()).length;
        const totalSupplyLocked = utils.weiDaiToDai(optionAmount.totalAmount);
        const option = PurchasedOption.fromResponse(optionAmount.address, numSellers, totalSupplyLocked, optionRes);
        this.props.persistenStorage.storeItem(key, option);
        return option;
    }

    async getOptions(optionAmounts: OptionAmount[], useCache: boolean = false): Promise<PurchasedOption[]> {
        // Remove 0-value contracts
        optionAmounts = optionAmounts.filter(option => !option.totalAmount.eq(0));

        let totalBtcInsured = utils.newBig(0);
        let paidPremium = utils.newBig(0);
        let totalIncome = utils.newBig(0);

        const tasks = optionAmounts.map(option => this.getOption(option, useCache));
        const options = (await Promise.all(tasks)).filter(utils.isDefined);

        for (const option of options) {
            paidPremium = paidPremium.add(option.premiumPaid);
            totalBtcInsured = totalBtcInsured.add(option.btcInsured);
            totalIncome = totalIncome.add(option.computeIncome(this.spotPrice));
        }

        this.setState({
            paidPremium: paidPremium,
            totalInsured: totalBtcInsured,
            totalIncome: totalIncome,
            totalBtcInsured: totalBtcInsured
        });

        return options;
    }

    get spotPrice() {
        return utils.newBig(this.props.btcPrices.dai);
    }

    // TODO: fetch number of sellers
    hasNonPendingSellers(contract: string, numSellers: number) {
        return this.props.storage.getPendingTransactionsFor(contract).length !== numSellers;
    }

    renderOption(option: PurchasedOption) {
        const { expiry, premium, strikePrice, totalSupply, totalSupplyLocked, premiumPaid, contract } = option;
        const id = utils.btcPutOptionId(expiry, strikePrice.toString());
        let percentInsured = ((totalSupply.lte(0)) ? utils.newBig(0) : (totalSupplyLocked.div(totalSupply)).mul(100));
        const income = option.computeIncome(this.spotPrice);
        return (
            <tr key={contract}>
                <td>{id}</td>
                <td>{new Date(expiry * 1000).toLocaleString()}</td>
                <td>{strikePrice.toString()} DAI</td>
                <td><span className={(income.gte(0.0) ? "text-success" : "text-danger")}>{this.spotPrice.toString()}</span> DAI</td>
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
    }

    renderTableData() {
        const result = [];
        if (!this.state.purchasedLoaded) {
            result.push(<tr key="spinner"><td colSpan={7} className="text-center"><Spinner animation="border" /></td></tr>);
        }

        if (this.state.purchasedOptions.length > 0) {
            const renderedOptions = this.state.purchasedOptions.map(option => this.renderOption(option));
            result.push(...renderedOptions);
        }

        return result;
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
        return <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Col xl={{ span: 8, offset: 2 }}>
                <Card border="dark">
                    <Card.Header>
                        <Card.Title>
                            <div className="text-center mb-4">
                                <h2>Purchased BTC/DAI Put Option Contracts</h2>
                            </div>
                            {
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
                        </Card.Title>
                    </Card.Header>
                    {
                        <Card.Body>
                            <Row>
                                <Table hover responsive>
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
                        </Card.Body>
                    }
                </Card>

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
            </Col>
        </div>;
    }
}
