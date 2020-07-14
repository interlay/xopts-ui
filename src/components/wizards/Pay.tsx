import React, { Component } from "react";
import { Col, ListGroup, ListGroupItem, Row, Form, Button, Modal, FormGroup, Container, Image, Card } from "react-bootstrap";
import { ethers } from 'ethers';
import QRCode from "react-qr-code";
import * as utils from '../../utils/utils';
import { showSuccessToast, showFailureToast } from '../../controllers/toast';
import { pollAndUpdateConfirmations } from '../../utils/poll';
import { AppProps } from "../../types/App";
import { Big } from 'big.js';
import { FormControlElement } from "../../types/Inputs";
import { Option } from "../../types/Storage";
import ledgerImg from "../../assets/img/icons/ledger.png";
import trezorImg from "../../assets/img/icons/trezor.png";
import keepkeyImg from "../../assets/img/icons/shapeshift.png";
import LedgerWizard from "./Ledger";
import { OptionInterface } from "../../types/Contracts";

interface SelectSellerProps extends AppProps {
    step: number
    contract: string
    updateSeller: (ethAddress: string, amountBtc: Big) => void
}

interface SelectSellerState {
    sellers: (string | ethers.utils.BigNumber)[][]
    pending: (Option & {
        txid: string;
    })[]
}

class SelectSeller extends Component<SelectSellerProps, SelectSellerState> {
    state: SelectSellerState = {
        sellers: [],
        pending: [],
    }

    async componentDidMount() {
        // load the option contract selected by the user
        let optionContract = this.props.contracts.attachOption(this.props.contract);
        // get the seller and options denoted in a amountBtc of satoshi from a single option contract
        let sellers = await optionContract.getOptionOwners();
        this.setState({
            sellers: sellers,
            pending: this.props.storage.getPendingTransactionsFor(this.props.contract),
        });
    }

    renderOptions() {
        return this.state.sellers.map((seller, index) => {
            let address = seller[0].toString();
            // convert the satoshi amountBtc into a BTC amount
            let amountBtc = utils.satToBtc(utils.newBig(seller[1].toString()));
            let addressShow = address.substr(0, 10) + '...';

            if (this.state.pending.filter((value) => value.ethAddress === seller[0]).length > 0) return null;
            return (
                <option 
                    key={address}
                    value={address}
                    onClick={() => this.props.updateSeller(address, amountBtc)}
                >
                    {amountBtc.toString()} BTC (Seller: {addressShow})
                </option>
            );
        })
    }

    render() {
        if (this.props.step !== 1) { // Prop: The current step
            return null
        }
        return (
            <FormGroup>
                <h5>Please select your position.</h5>
                <Form.Control as="select" name="ethAddress" defaultValue="default">
                    <option disabled value="default"> -- Select -- </option>
                    {this.renderOptions()}
                </Form.Control>
                <br></br>
                <p>
                    If you have purchased the same option from multiple sellers, you need to select a seller from the list.
                    <i> We currently only support exercising one position at a time.</i>
                </p>
            </FormGroup>
        )
    }
}

interface ScanBTCProps extends AppProps {
    step: number
    paymentUri: string
    amountBtc: Big
    amountDai: Big
    btcAddress: string
    ethAddress: string
    showLedgerModal: () => void
}

class ScanBTC extends Component<ScanBTCProps> {

    render() {
        if (this.props.step !== 2) {
            return null
        }
        return (
            <FormGroup>
                <h5>Payment</h5>
                  <Row className="justify-content-md-center">
                    <Col md="auto" className="text-center">
                        <p>To exercise the option, please make the following Bitcoin payment with a wallet of your choice.</p>
                        <QRCode value={this.props.paymentUri} />
                    </Col>
                </Row>
                <h5>Summary</h5>
                <FormGroup>
                    <ListGroup>
                      <ListGroupItem>Sending: <strong>{this.props.amountBtc.toString()} BTC</strong></ListGroupItem>
                      <ListGroupItem>Address: <strong>{this.props.btcAddress}</strong></ListGroupItem>
                      <ListGroupItem>Receiving: <strong>{this.props.amountDai.toString()} DAI</strong></ListGroupItem>
                    </ListGroup>
                </FormGroup>
                <h5>Alternatives</h5>
                <p>Pay with your supported hardware wallet:</p>
                <Container fluid>
                    <Row>
                        <Col md={{ span: 4 }} className="text-center">
                            <a style={{ cursor: 'pointer' }} onClick={this.props.showLedgerModal}>
                                <Card style={{ padding: "10px"}}>
                                    <Row>
                                        <Col md={{ span: 4 }}>
                                            <Image src={ledgerImg} width="64"></Image>
                                        </Col>
                                        <Col>
                                            <h4>Ledger</h4>
                                        </Col>
                                    </Row>
                                </Card>
                            </a>
                        </Col>
                        <Col md={{ span: 4 }} className="text-center">
                        </Col>
                        <Col md={{ span: 4 }} className="text-center">
                        </Col>
                    </Row>
                </Container>

            </FormGroup>
        )
    }
}

interface SubmitProofProps {
    step: number
    handleChange: (event: React.ChangeEvent<FormControlElement>) => void,
}

class SubmitProof extends Component<SubmitProofProps> {

    render() {
        if (this.props.step !== 3) {
            return null
        }
        return (
            <div>
                <h4>Please enter the transaction id of your Bitcoin payment.</h4>
                <p>We will track it for you and tell you when it is ready!</p>
                <Form.Group>
                    <Form.Label>Transaction ID</Form.Label>
                    <Form.Control required name="txid" type="text" onChange={this.props.handleChange} />
                </Form.Group>
                <button type="submit" className="btn btn-success btn-block">Exercise</button>
            </div>
        )
    }
}

/*
<FormGroup>
    <h5>Alternatively, you can submit the proof yourself:</h5>
    <Form.Group>
        <Form.Label>BlockHeight</Form.Label>
        <Form.Control name="height" type="number" onChange={this.props.handleChange} />
    </Form.Group>
    <Form.Group>
        <Form.Label>Transaction Index</Form.Label>
        <Form.Control name="index" type="text" onChange={this.props.handleChange} />
    </Form.Group>
    <Form.Group>
        <Form.Label>Transaction ID</Form.Label>
        <Form.Control name="txid" type="text" onChange={this.props.handleChange} />
    </Form.Group>
    <Form.Group>
        <Form.Label>Proof</Form.Label>
        <Form.Control name="proof" type="text" onChange={this.props.handleChange} />
    </Form.Group>
    <Form.Group>
        <Form.Label>Raw Tx</Form.Label>
        <Form.Control name="rawtx" type="text" onChange={this.props.handleChange} />
    </Form.Group>
    <button disabled={this.state.progress < 100} className="btn btn-success btn-block">Exercise</button>
</FormGroup>
*/

interface PayWizardProps extends AppProps {
    contract: string
    toast: any
    hide: () => void
    showPayModal: boolean
    reloadPurchased: () => void
}

interface PayWizardState {
    currentStep: number
    amountOptions: number
    amountBtc: Big
    amountDai: Big
    btcOutput: Buffer
    btcAddress: string
    ethAddress: string
    paymentUri: string
    expiry: number
    strikePrice: Big
    txId: string
    showLedgerModal: boolean
    optionContract?: OptionInterface
}

export default class PayWizard extends Component<PayWizardProps, PayWizardState> {
    state: PayWizardState = {
        currentStep: 1,
        amountOptions: 0,
        amountBtc: utils.newBig(0),
        amountDai: utils.newBig(0),
        btcOutput: Buffer.from(""),
        btcAddress: "",
        ethAddress: "",
        paymentUri: "",
        expiry: 0,
        strikePrice: utils.newBig(0),
        txId: "",
        showLedgerModal: false,
    }

    constructor(props: PayWizardProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.updateSeller = this.updateSeller.bind(this)

        this.exitModal = this.exitModal.bind(this);
    }

    async componentDidMount() {
        let optionContract = this.props.contracts.attachOption(this.props.contract);
        let {expiry, strikePrice} = await optionContract.getDetails();

        this.setState({
            expiry: parseInt(expiry.toString()),
            strikePrice: utils.newBig(strikePrice.toString()),
            optionContract: optionContract,
        });
    }

    handleChange(event: React.ChangeEvent<FormControlElement>) {
        const { name, value } = event.target;
        this.setState(state => ({
            ...state,
            [name]: value
        }));
    }

    async updateSeller(ethAddress: string, amountBtc: Big) {
        const { optionContract } = this.state;
        if (optionContract) {
            let btcOutput = await optionContract.getBtcOutput(ethAddress);
            let btcAddress = await optionContract.getBtcAddress(ethAddress);

            let paymentUri = "bitcoin:" + btcAddress + "?amount=" + amountBtc;
            this.setState({
                btcOutput: btcOutput,
                btcAddress: btcAddress,
                paymentUri: paymentUri,
            });    
        }

        let amountBtcInSat = utils.btcToSat(amountBtc);
        let amountWeiDai = utils.newBig(amountBtcInSat || 0).mul(this.state.strikePrice);
        // exchange rate between option and dai is 1:1
        let amountDai = utils.weiDaiToDai(amountWeiDai);

        this.setState({
            ethAddress: ethAddress,
            amountBtc: amountBtc,
            amountDai: amountDai,
        });
    }

    isValid(step: number) {
        if (step === 0 && this.state.ethAddress === "") {
            return false;
        }
        return true;
    }

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let step = this.state.currentStep;
        if (step <= 2) {
            if (!this.isValid(step-1)) return;
            this.setState({currentStep: step + 1});
            return;
        }
        // store txid to local storage
        // store a mapping of the option to the txid
        const { btcAddress, ethAddress, amountBtc, expiry, strikePrice, txId } = this.state;
        const strikePriceBtc = utils.weiDaiToBtc(utils.newBig(strikePrice.toString()));
        const optionId = utils.btcPutOptionId(expiry, strikePriceBtc.toString());
        try {
            this.props.storage.setPendingOption(this.props.contract, txId, amountBtc.toString(), btcAddress, ethAddress, optionId, 0);
            showSuccessToast(this.props.toast, 'Awaiting verification!', 3000);
            this.props.hide();
            this.forceUpdate();
            try {
                let txStatus = await this.props.btcProvider.getStatusTransaction(txId);
                this.props.storage.modifyPendingConfirmations(this.props.contract, txId, txStatus.confirmations);
            } catch(error) {}

            pollAndUpdateConfirmations(this.props.btcProvider, this.props.storage, this.props.contract, txId);
        } catch (error) {
            console.log(error);
            showFailureToast(this.props.toast, 'Failed to send transaction...', 3000);
        }
    }

    _next() {
        let step = this.state.currentStep;
        if (!this.isValid(step-1)) return;
        // If the current step is 1 or 2, then add one on "next" button click
        step = step >= 2 ? 3 : step + 1;
        this.setState({
            currentStep: step
        })
    }

    _prev() {
        let step = this.state.currentStep
        // If the current step is 2 or 3, then subtract one on "previous" button click
        step = step <= 1 ? 1 : step - 1
        this.setState({
            currentStep: step
        })
    }

    get previousButton() {
        let step = this.state.currentStep;
        if (step !== 1) {
            return (
                <button
                    className="btn btn-secondary float-left"
                    type="button" onClick={() => this._prev()}>
                    Previous
                </button>
            )
        }
        return null;
    }

    get nextButton() {
        let step = this.state.currentStep;
        if (step < 3) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={() => this._next()}>
                    Next
                </button>
            )
        }
        return null;
    }

    exitModal() {
        this.props.hide();
        this.setState({currentStep: 1});
    }

    showLedgerModal() {
        this.setState({
            showLedgerModal: true,
        })
    }

    hideLedgerModal() {
        this.setState({
            showLedgerModal: false,
        })
    }

    render() {
        return (
            <div>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.props.showPayModal && !this.state.showLedgerModal} onHide={() => this.exitModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Submit Payment
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <SelectSeller
                                step={this.state.currentStep}
                                updateSeller={this.updateSeller}
                                {...this.props}
                                />
                            <ScanBTC
                                step={this.state.currentStep}
                                amountBtc={this.state.amountBtc}
                                amountDai={this.state.amountDai}
                                btcAddress={this.state.btcAddress}
                                ethAddress={this.state.ethAddress}
                                paymentUri={this.state.paymentUri}
                                showLedgerModal={this.showLedgerModal.bind(this)}
                                {...this.props}
                                />
                            <SubmitProof
                                step={this.state.currentStep}
                                handleChange={this.handleChange}
                                {...this.props}
                                />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.previousButton}
                        {this.nextButton}
                        <Button variant="danger" onClick={() => this.exitModal()}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
                {this.state.showLedgerModal &&
                    <LedgerWizard
                        hideLedgerModal={this.hideLedgerModal.bind(this)}
                        btcAddress={this.state.btcAddress}
                        btcOutput={this.state.btcOutput}
                        btcAmount={this.state.amountBtc}
                        {...this.props}>
                    </LedgerWizard>
                }
            </div>
        )
    }
}