import React, { Component } from "react";
import { Col, Row, Table, Card, Spinner, Button } from "react-bootstrap";
import * as utils from '../utils/utils';
import BuyWizard from './wizards/Buy';
import SellWizard from './wizards/Sell';
import CreateWizard from './wizards/Create';
import { ButtonTool } from "./ButtonTool";
import { ToastContainer, toast } from 'react-toastify';
import { AppProps } from "../types/App";
import { Big } from 'big.js';


interface OptionProps {
    expiry: number;
    premium: Big;
    strikePrice: Big;
    totalSupply: Big;
    totalSupplyLocked: Big;
    totalSupplyUnlocked: Big;
    hasSellers: boolean;
    spotPrice: number;
    contract: string;
}

class PersistableOption {
    private _option: OptionProps;

    constructor(option: OptionProps) {
        this._option = option;
    }

    toJSON(): object {
        return {
            expiry: this.option.expiry,
            premium: this.option.premium.toString(),
            strikePrice: this.option.strikePrice.toString(),
            totalSupply: this.option.totalSupply.toString(),
            totalSupplyLocked: this.option.totalSupplyLocked.toString(),
            totalSupplyUnlocked: this.option.totalSupplyUnlocked.toString(),
            hasSellers: this.option.hasSellers,
            spotPrice: this.option.spotPrice,
            contract: this.option.contract,
        };
    }

    static fromJSON(option: any): PersistableOption {
        return new PersistableOption({
            expiry: option.expiry,
            premium: utils.newBig(option.premium),
            strikePrice: utils.newBig(option.strikePrice.toString()),
            totalSupply: utils.newBig(option.totalSupply.toString()),
            totalSupplyLocked: utils.newBig(option.totalSupplyLocked.toString()),
            totalSupplyUnlocked: utils.newBig(option.totalSupplyUnlocked.toString()),
            hasSellers: option.hasSellers,
            spotPrice: option.spotPrice,
            contract: option.contract,
        });
    }

    get option() {
        return this._option;
    }
}


interface State {
    loaded: boolean
    loading: boolean,
    options: OptionProps[],
    totalInsured: Big,
    insuranceAvailable: Big,
    avgPremium: Big,
    showBuyModal: boolean,
    showSellModal: boolean,
    showCreateModal: boolean,
    contractAddress: string,
}

export default class OptionList extends Component<AppProps, State> {
    state: State = {
        loaded: false,
        loading: false,
        options: [],
        totalInsured: utils.newBig(0),
        insuranceAvailable: utils.newBig(0),
        avgPremium: utils.newBig(0),
        showBuyModal: false,
        showSellModal: false,
        showCreateModal: false,
        contractAddress: '',
    }

    constructor(props: AppProps) {
        super(props);

        this.showBuyModal = this.showBuyModal.bind(this);
        this.showSellModal = this.showSellModal.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);

        this.hideBuyModal = this.hideBuyModal.bind(this);
        this.hideSellModal = this.hideSellModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);

        this.reloadOptions = this.reloadOptions.bind(this);
    }

    componentDidUpdate() {
        if (this.state.loaded === false) {
            this.loadOptions();
        }
    }

    async loadOptions() {
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true});
        let options = await this.getOptions(true);
        this.setState({ options });
        options = await this.getOptions(false);
        this.setState({
            loaded: true,
            loading: false,
            options,
        });
    }

    async getOptionContracts(useCache: boolean = false): Promise<string[]> {
        const storageKey = 'option-contract-addresses';
        if (useCache) {
            const result = this.props.persistenStorage.loadItem(storageKey);
            return (result || []) as string[];
        }
        const result = await this.props.contracts.getOptions();
        this.props.persistenStorage.storeItem(storageKey, result)
        return result;
    }

    async getOptions(useCache: boolean = true): Promise<OptionProps[]> {
        let optionContracts = await this.getOptionContracts(useCache);
        return await this.getOptionsDetails(optionContracts, useCache);
    }

    async getOptionDetails(address: string, useCache: boolean = false): Promise<OptionProps | null> {
        const optionKey = `option-details:${address}`;
        if (useCache) {
            const result = this.props.persistenStorage.loadItem(optionKey, PersistableOption.fromJSON);
            if (!result) {
                return null;
            }
            return result.option;
        }
        const optionContract = this.props.contracts.attachOption(address);
        const optionRes = await optionContract.getDetails();
        const option = {
            expiry: parseInt(optionRes.expiry.toString()),
            premium: utils.weiDaiToBtc(utils.newBig(optionRes.premium.toString())),
            strikePrice: utils.weiDaiToBtc(utils.newBig(optionRes.strikePrice.toString())),
            totalSupply: utils.weiDaiToDai(utils.newBig(optionRes.total.toString())),
            totalSupplyLocked: utils.weiDaiToDai(utils.newBig(optionRes.totalSold.toString())),
            totalSupplyUnlocked: utils.weiDaiToDai(utils.newBig(optionRes.totalUnsold.toString())),
            hasSellers: await optionContract.hasSellers(),
            spotPrice: this.props.btcPrices.dai,
            contract: address,
        };
        this.props.persistenStorage.storeItem(optionKey, new PersistableOption(option));
        return option;
    }

    async getOptionsDetails(optionContracts: string[], useCache: boolean = false): Promise<OptionProps[]> {
        let insuranceAvailable = utils.newBig(0);
        let totalInsured = utils.newBig(0);
        let totalPremium = utils.newBig(0);
        const optionPromises = optionContracts.map(addr => this.getOptionDetails(addr, useCache));
        const options = (await Promise.all(optionPromises)).filter(utils.isDefined);
        options.forEach(option => {
            if (!option.strikePrice.eq(0))
                totalInsured = totalInsured.add(option.totalSupplyLocked.div(option.strikePrice));
            insuranceAvailable = insuranceAvailable.add(option.totalSupplyUnlocked);
            totalPremium = totalPremium.add(option.premium);
        });

        this.setState({
            insuranceAvailable: insuranceAvailable,
            totalInsured: totalInsured,
            avgPremium: options.length > 0 ? totalPremium.div(options.length) : utils.newBig(0),
        })

        return options;
    }

    async showBuyModal(contract: string) {
        if (!this.props.isLoggedIn) {
            await this.props.tryLogIn(true);
        }
        this.setState({
            contractAddress: contract,
            showBuyModal: true,
        });
    }

    hideBuyModal() {
        this.setState({
            showBuyModal: false,
        })
    }

    async showSellModal(contract: string) {
        if (!this.props.isLoggedIn) {
            await this.props.tryLogIn(true);
        }
        this.setState({
            contractAddress: contract,
            showSellModal: true,
        });
    }

    hideSellModal() {
        this.setState({
            showSellModal: false,
        })
    }

    showCreateModal() {
        this.setState({
            showCreateModal: true,
        })
    }

    hideCreateModal() {
        this.setState({
            showCreateModal: false,
        })
    }

    reloadOptions() {
        this.getOptions();
    }

    renderOption(option: OptionProps) {
        const { expiry, premium, strikePrice, spotPrice, totalSupply, totalSupplyLocked, contract } = option;
        const id = utils.btcPutOptionId(expiry, strikePrice.toString());

        let percentInsured = utils.newBig(0);
        if (totalSupply.gt(0)) {
            percentInsured = (totalSupplyLocked.div(totalSupply)).mul(100);
        }
        let currentDate = Math.floor(Date.now() / 1000);

        return (
            // Hide expired options
            <tr key={contract} hidden={expiry < currentDate}>

                <td>{id}</td>
                <td>{new Date(expiry * 1000).toLocaleString()}
                    {(expiry < currentDate) &&
                        <b> (Expired)</b>
                    }
                </td>
                <td>{strikePrice.toString()} DAI/BTC</td>
                <td>{spotPrice} DAI</td>
                <td>{totalSupplyLocked.round(0, 0).toString()} / {totalSupply.round(0, 0).toString()} DAI ({percentInsured.toFixed(0)} %)</td>
                <td>{premium.toString()} DAI/BTC</td>

                <td>
                    <ButtonTool
                        disable={(expiry < currentDate) || !option.hasSellers}
                        reason={(expiry < currentDate) ? "Expired" : (!option.hasSellers) ? "No Options" : ""}
                        placement={"left"}
                        text={"Buy"}
                        variant={"outline-success"}
                        show={this.showBuyModal}
                        showValue={contract}
                    />
                    {" "}
                    <ButtonTool
                        disable={(expiry < currentDate)}
                        reason={(expiry < currentDate) ? "Expired" : ""}
                        placement={"right"}
                        text={"Sell"}
                        variant={"outline-danger"}
                        show={this.showSellModal}
                        showValue={contract}
                    />
                </td>
            </tr>
        )
    }

    renderTableData() {
        const result = [];
        if (!this.state.loaded) {
            result.push(<tr key="spinner"><td colSpan={7} className="text-center"><Spinner animation="border" /></td></tr>);
        }
        if (this.state.options) {
            const renderedOptions = this.state.options.map(option => this.renderOption(option));
            result.push(...renderedOptions);
        }
        return result;
    }

    render() {
        return (
            <Col xl={{ span: 8, offset: 2 }}>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Card border="dark">
                    <Card.Header>
                        <Card.Title><h2 className="text-center">BTC/DAI Put Option Contracts</h2>
                            <Row className="text-center">
                                <Col>
                                    <h3>{this.state.totalInsured.round(2, 0).toString()} BTC</h3>
                                    <h6>Insured</h6>
                                </Col>

                                <Col>
                                    <h3>{this.state.insuranceAvailable.round(2, 0).toString()} DAI</h3>
                                    <h6>Insurance Available</h6>
                                </Col>

                                <Col>
                                    <h3>{this.state.avgPremium.round(2, 0).toString()} DAI/BTC</h3>
                                    <h6>Average Premium</h6>
                                </Col>
                            </Row>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Table hover responsive size={"md"}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Expiry</th>
                                        <th>Strike Price</th>
                                        <th>Current Price</th>
                                        <th>Insurance Issued</th>
                                        <th>Premium</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </Table>
                        </Row>
                        <Row className="text-center">
                            <Col>
                                <Button className="text-center" variant="success" size="lg" onClick={() => { this.showCreateModal() }}>
                                    Create
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <BuyWizard
                    contract={this.state.contractAddress}
                    toast={toast}
                    hideModal={this.hideBuyModal}
                    showModal={this.state.showBuyModal}
                    {...this.props}>
                </BuyWizard>
                <SellWizard
                    contract={this.state.contractAddress}
                    toast={toast}
                    hideModal={this.hideSellModal}
                    showModal={this.state.showSellModal}
                    {...this.props}>
                </SellWizard>
                <CreateWizard 
                    toast={toast}
                    hideModal={this.hideCreateModal}
                    showModal={this.state.showCreateModal}
                    reloadOptions={this.reloadOptions}
                    {...this.props}>
                </CreateWizard>
            </Col>
        )
    }
}
