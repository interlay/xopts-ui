import React, { Component } from "react";
import { Col, Row, Table, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import * as utils from '../utils/utils';
import { ButtonTool } from "./ButtonTool";
import { RefundModal } from "./RefundModal";
import {AppProps} from "../types/App";
import { OptionSoldAmount } from "../types/Contracts";
import { Big } from 'big.js';
import { BigNumber } from "ethers/utils";

interface UserSoldOptionsState {
    soldLoaded: boolean
    soldOptions: {
        expiry: number;
        premium: Big;
        strikePrice: Big;
        totalSupply: Big;
        unsoldOptions: Big;
        totalSupplyLocked: Big;
        soldOptions: Big;
        spotPrice: Big;
        contract: string;
        percentSold: Big;
        btcInsured: Big;
        premiumEarned: Big;
        income: Big;
    }[]
    totalInsured: Big
    totalBtcInsured: Big
    percentSold: Big
    insuranceAvailable: Big
    totalPremium: Big
    totalIncome : Big
    showRefundModal: false
    refundOption: {
        contract: string
        totalSupplyLocked: Big
    }
    totalLocked: Big
}

export default class UserSoldOptions extends Component<AppProps> {
    state: UserSoldOptionsState = {
        soldLoaded: false,
        soldOptions: [],
        totalInsured: utils.newBig(0),
        totalBtcInsured: utils.newBig(0),
        percentSold: utils.newBig(0),
        insuranceAvailable: utils.newBig(0),
        totalPremium: utils.newBig(0),
        totalIncome: utils.newBig(0),
        showRefundModal: false,
        refundOption: {
            contract: '',
            totalSupplyLocked: utils.newBig(0),
        },
        totalLocked: utils.newBig(0),
    }

    constructor(props: AppProps) {
        super(props);

        this.showRefundModal = this.showRefundModal.bind(this);
        this.hideRefundModal = this.hideRefundModal.bind(this);
        this.reloadSold = this.reloadSold.bind(this);
    }

    componentDidUpdate() {
        if (this.props.contracts && this.props.address) {
            if (!this.state.soldLoaded) {
                this.getCurrentOptions();
            }
        }
    }

    async getCurrentOptions() {
        if (this.props.contracts && this.props.address) {
            let optionContracts = await this.props.contracts.getUserSoldOptions(this.props.address);
            let soldOptions = await this.getOptions(optionContracts)
            this.setState({
                soldOptions: soldOptions,
                soldLoaded: true
            });
        }
    }

    async getOptions(optionAmounts: OptionSoldAmount[]) {
        // Remove 0-value contracts
        optionAmounts = optionAmounts.filter(o => !o.unsoldAmount.eq(0));

        let options = [];
        let totalLocked = utils.newBig(0);
        let totalInsured = utils.newBig(0);
        let totalPremium = utils.newBig(0);
        let totalBtcInsured = utils.newBig(0);
        let totalIncome = utils.newBig(0);
        for (const optionAmount of optionAmounts) {
            let addr = optionAmount.address;
            let optionContract = this.props.contracts?.attachOption(addr);
            let optionRes = await optionContract.getDetails();
            let option = {
                expiry: parseInt(optionRes.expiry.toString()),
                premium: utils.weiDaiToBtc(utils.newBig(optionRes.premium.toString())),
                strikePrice: utils.weiDaiToBtc(utils.newBig(optionRes.strikePrice.toString())),
                totalSupply: utils.weiDaiToDai(utils.newBig(optionRes.total.toString())),

                // User's unsold options & total locked DAI
                unsoldOptions: utils.weiDaiToDai(optionAmount.unsoldAmount),
                totalSupplyLocked: utils.weiDaiToDai(optionAmount.totalAmount),

                soldOptions: utils.newBig(0),
                spotPrice: utils.newBig(0),
                contract: '',
                percentSold: utils.newBig(0),
                btcInsured: utils.newBig(0),
                premiumEarned: utils.newBig(0),
                income: utils.newBig(0),
            }
            option.soldOptions = option.totalSupplyLocked.sub(option.unsoldOptions);
            option.spotPrice = utils.newBig(this.props.btcPrices.dai);
            option.contract = addr;
            option.percentSold = ((option.totalSupplyLocked.lte(0)) ? utils.newBig(0) : (option.soldOptions.div(option.totalSupplyLocked)).mul(100));
            option.btcInsured = option.soldOptions.div(option.strikePrice);
            option.premiumEarned = option.premium.mul(option.btcInsured);
            option.income = option.btcInsured.mul((option.spotPrice.sub(option.strikePrice)).add(option.premium));
            (option.premium.add(option.strikePrice)).sub(option.spotPrice)
            options.push(option);

            totalLocked = totalLocked.add(option.totalSupplyLocked);
            totalInsured = totalInsured.add(option.soldOptions);
            totalBtcInsured = totalBtcInsured.add(option.btcInsured);
            totalPremium = totalPremium.add(option.premium.mul(option.btcInsured));
            totalIncome = totalIncome.add(option.income);
        }

        let percentSold = ((totalLocked.lte(0)) ? utils.newBig(0) : (totalInsured.div(totalLocked)).mul(100));
        this.setState({
            totalLocked: totalLocked,
            totalPremium: totalPremium,
            totalInsured: totalInsured,
            totalBtcInsured: totalBtcInsured,
            percentSold: percentSold,
            totalIncome: totalIncome
        });
        return options;
    }

    showRefundModal(index: number) {
        this.setState({
            refundOption: this.state.soldOptions[index],
            showRefundModal: true
        });
    }

    hideRefundModal() {
        this.setState({
            refundOption: {
                totalSupplyLocked: utils.newBig(0),
            },
            showRefundModal: false
        });
    }

    reloadSold() {
        this.getCurrentOptions();
    }

    renderTableData() {
        if (this.state.soldLoaded) {
            if (this.state.soldOptions.length > 0) {
                return this.state.soldOptions.map((option, index) => {
                    const { expiry, premium, strikePrice, spotPrice, totalSupply, totalSupplyLocked, soldOptions, percentSold, income, premiumEarned, contract } = option;
                    const id = utils.btcPutOptionId(expiry, strikePrice.toString());
                    let percentInsured = ((totalSupply.lte(0)) ? 0 : (totalSupplyLocked.div(totalSupply)).mul(100));
                    let currentDate = Math.floor(Date.now() / 1000);
                    return (
                        <tr key={contract}>
                            <td>{id}</td>
                            <td>{new Date(expiry * 1000).toLocaleString()}</td>
                            <td>{strikePrice.round(2, 0).toString()} DAI</td>
                            <td><span className={(income.gte(0) ? "text-success": "text-danger")}>{spotPrice.toString()}</span> DAI</td>
                            <td><strong>{soldOptions.round(2, 0).toString()}</strong> / {totalSupplyLocked.round(2, 0).toString()} DAI <br/>({percentSold.toFixed(0)}%) </td>
                            <td>{totalSupplyLocked.round(2, 0).toString()} / {totalSupply.round(2, 0).toString()} DAI <br/> ({percentInsured.toFixed(0)}%)</td>
                            <td><strong className={"text-success"}>{premiumEarned.round(2, 0).toString()}</strong> DAI <br/> ({premium.round(2, 0).toString()} DAI/BTC)</td>
                            <td><strong className={(income.gte(0) ? "text-success": "text-danger")}>{income.round(2, 0).toString()}</strong> DAI </td>

                            <td>
                                <ButtonTool
                                    disable={(expiry >= currentDate)}
                                    reason={(expiry >= currentDate) ? "Not Expired" : ""}
                                    placement={"right"}
                                    text={"Refund"}
                                    variant={"outline-danger"}
                                    show={this.showRefundModal}
                                    showValue={index}
                                />
                            </td>
                        </tr>
                    )
                })
            } else {
                return <tr><td className="text-center" colSpan={9}>No Options</td></tr>
            }
        } else {
            return <tr><td colSpan={7} className="text-center"><Spinner animation="border" /></td></tr>
        }
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
                            <h2 className="text-center">Sold BTC/DAI Put Option Contracts</h2>
                            {!this.state.soldLoaded &&
                                <Row>
                                    <Col className="text-center">
                                        <Spinner animation="border" />
                                    </Col>
                                </Row>
                            }
                            {this.state.soldLoaded &&
                                <Row className="text-center">
                                    <Col>
                                        <h3>{this.state.totalInsured.round(2, 0).toString()} DAI ({this.state.percentSold.round(2, 0).toString()}%)</h3>
                                        <h6>Insurance Sold</h6>
                                        <h6>({this.state.totalBtcInsured.round(2, 0).toString()} BTC)</h6>
                                    </Col>
                                    <Col>
                                        <h3>{this.state.totalLocked.round(2, 0).toString()} DAI</h3>
                                        <h6>Locked</h6>
                                    </Col>
                                    <Col>
                                        <h3 className={(this.state.totalPremium.gt(0) ? "text-success": (this.state.totalPremium.lt(0) ? "text-danger" : ""))}>{this.state.totalPremium.round(2, 0).toString()} DAI</h3>
                                        <h6>Premium Earned</h6>
                                    </Col>
                                    <Col>
                                        <h3 className={(this.state.totalIncome.gt(0) ? "text-success": (this.state.totalIncome.lt(0) ? "text-danger" : ""))}>{this.state.totalIncome.round(2, 0).toString()} DAI</h3>
                                        <h6>(Potential) Income</h6>
                                    </Col>
                                </Row>
                            }
                        </Card.Title>
                    </Card.Header>
                    {this.state.soldLoaded &&
                        <Card.Body>
                            <Row>
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Expiry</th>
                                            <th>Strike Price</th>
                                            <th>Current Price</th>
                                            <th>Your Sold</th>
                                            <th>Total Sold</th>
                                            <th>Premium Earned</th>
                                            <th>Potential Earnings</th>
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
                <RefundModal
                    showRefundModal={this.state.showRefundModal}
                    hideRefundModal={this.hideRefundModal}
                    refundOption={this.state.refundOption}
                    reloadSold={this.reloadSold}
                    toast={toast}
                    {...this.props}
                />

            </Col>
        </div>;
    }
}
