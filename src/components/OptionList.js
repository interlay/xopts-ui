import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { Col, Badge, Row, Table, Button, Card, Spinner, Modal, ListGroup, ListGroupItem, FormGroup, FormControl, OverlayTrigger, Tooltip } from "react-bootstrap";
import * as utils from '../utils/utils.js'; 
import Buy from "./WizardBuy";
import Sell from "./WizardSell";
import { ButtonTool } from "./ButtonTool.js";
import { ToastContainer, toast } from 'react-toastify';

class OptionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            options: [],
            totalInsured: utils.newBig(0),
            insuranceAvailable: utils.newBig(0),
            avgPremium: utils.newBig(0),
            showBuy: false,
            showSell: false,
            buy: null,
            sell: null
        };

        this.showBuy = this.showBuy.bind(this)
        this.showSell = this.showSell.bind(this)

        this.hideBuy = this.hideBuy.bind(this)
        this.hideSell = this.hideSell.bind(this)
    }

    componentDid() {
        if (this.state.loaded == false) {
            this.getOptions();
        }
    }

    componentDidUpdate() {
        if (this.state.loaded == false) {
            this.getOptions();
        }
    }

    async getOptions() {
        if (this.props.contracts) {
            let optionContracts = await this.props.contracts.getOptions();
            let options = await this.getOptionDetails(optionContracts);
            this.setState({
                loaded: true,
                options: options
            });
        }
    }

    async getOptionDetails(optionContracts) {

        let options = [];
        var index;
        let insuranceAvailable = utils.newBig(0);
        let totalInsured = utils.newBig(0);
        let totalPremium = utils.newBig(0);
        for (index in optionContracts) {
            let addr = optionContracts[index];
            let optionContract = this.props.contracts.attachOption(addr);
            let optionRes = await optionContract.getDetails();
            let option = {
                expiry: parseInt(optionRes[0].toString()),
                premium: utils.weiDaiToBtc(utils.newBig(optionRes[1].toString())),
                strikePrice: utils.weiDaiToBtc(utils.newBig(optionRes[2].toString())),
                totalSupply: utils.weiDaiToDai(utils.newBig(optionRes[3].toString())),
                totalSupplyLocked: utils.weiDaiToDai(utils.newBig(optionRes[4].toString())),
                totalSupplyUnlocked: utils.weiDaiToDai(utils.newBig(optionRes[5].toString())),
                hasSellers: await optionContract.hasSellers(),
            }
            console.log(utils.weiDaiToDai(utils.newBig(optionRes[1].toString())).toString())
            option.spotPrice = this.props.btcPrices.dai;
            option.contract = addr;
            if (!option.strikePrice.eq(0))
                totalInsured = totalInsured.add(option.totalSupplyLocked.div(option.strikePrice));
            insuranceAvailable = insuranceAvailable.add(option.totalSupplyUnlocked);
            totalPremium = totalPremium.add(option.premium);
            options.push(option);
        }

        this.setState({
            insuranceAvailable: insuranceAvailable,
            totalInsured: totalInsured,
            avgPremium: totalPremium.div(options.length)
        })

        return options;
    }

    showBuy(contract) {
        this.setState({
            buy: contract,
            showBuy: true,
        });
    }

    hideBuy() {
        this.setState({
            showBuy: false,
        })
    }

    showSell(contract) {
        this.setState({
            sell: contract,
            showSell: true,
        });
    }

    hideSell() {
        this.setState({
            showSell: false,
        })
    }

    renderTableData() {
        if (this.state.loaded) {
            return this.state.options.map((option, index) => {
                const { expiry, premium, strikePrice, spotPrice, totalSupply, totalSupplyLocked, totalSupplyUnlocked, contract } = option;

                let percentInsured = utils.newBig(0);
                if (totalSupply > 0) {
                    percentInsured = (totalSupplyLocked.div(totalSupply)).mul(100);
                }
                let currentDate = Math.floor(Date.now() / 1000);

                return (
                    <tr key={strikePrice} disabled={expiry < currentDate}>
                        <td>{new Date(expiry*1000).toLocaleString()}
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
                                reason={(expiry < currentDate) ? "Expired" : (!option.hasSellers) ? "No Options" : null}
                                placement={"left"}
                                text={"Buy"}
                                variant={"outline-success"}
                                show={this.showBuy}
                                showValue={contract}
                            />
                            {" "}
                            <ButtonTool
                                disable={(expiry < currentDate)}
                                reason={(expiry < currentDate) ? "Expired" : null}
                                placement={"right"}
                                text={"Sell"}
                                variant={"outline-danger"}
                                show={this.showSell}
                                showValue={contract}
                            />
                        </td>
                    </tr>
                )
            })
        } else {
            return <tr><td colSpan="7" className="text-center"><Spinner animation="border" /></td></tr>
        }
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
                        <Card.Title><h2>BTC/DAI Put Option Contracts</h2>
                            <Row className="text-left">
                            
                                    <Col md={2}>
                                        <h3>{this.state.totalInsured.round(2, 0).toString()} BTC</h3>
                                        <h6>Insured</h6>
                                    </Col>
                        
                                    <Col md={2}>
                                        <h3>{this.state.insuranceAvailable.round(2, 0).toString()} DAI</h3>
                                        <h6>Insurance Available</h6>
                                    </Col>
                            
                                    <Col md={3}>
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
                    </Card.Body>
                </Card>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showBuy} onHide={() => this.setState({ showBuy: false })}>
                    <Buy contract={this.state.buy} hide={this.hideBuy} toast={toast} {...this.props}></Buy>
                </Modal>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showSell} onHide={() => this.setState({ showSell: false })}>
                    <Sell contract={this.state.sell} hide={this.hideSell} toast={toast} {...this.props}></Sell>
                </Modal>
            </Col>
        )
    }
    /*
    getDummyOptions() {
        return [
            {
                expiry: 1591012800,
                premium: 10,
                strikePrice: 9250,
                btcAddresses: {
                    "0x1CF8f0A193eeA288014c7513eA6Aa65e6997D8bE": "0xtb1qtypzfss4558ml9j5v3fu90jtd6xlxmq4ltmvp9"
                },
                insured: 0.006,
                premiumEarned: 100,
                collateral: 5000
            },
            {
                expiry: 1590795000,
                premium: 15,
                strikePrice: 9000,
                btcAddress: {
                    "0x1CF8f0A193eeA288014c7513eA6Aa65e6997D8bE": "0xtb1qtypzfss4558ml9j5v3fu90jtd6xlxmq4ltmvp9"
                },
                insured: 0.01,
                premiumEarned: 150,
                collateral: 7850
            },
            {
                expiry: 1590148800,
                premium: 5,
                strikePrice: 10000,
                btcAddress: {
                    "0x1CF8f0A193eeA288014c7513eA6Aa65e6997D8bE": "0xtb1qtypzfss4558ml9j5v3fu90jtd6xlxmq4ltmvp9"
                },
                insured: 1.2,
                premiumEarned: 500,
                collateral: 540
            },
            {
                expiry: 1590018300,
                premium: 11,
                strikePrice: 8909,
                btcAddress: {
                    "0x1CF8f0A193eeA288014c7513eA6Aa65e6997D8bE": "0xtb1qtypzfss4558ml9j5v3fu90jtd6xlxmq4ltmvp9"
                },
                insured: 4.975123,
                premiumEarned: 7700,
                collateral: 9700
            }
        ]
    }
    */
}

export default withRouter(OptionList);