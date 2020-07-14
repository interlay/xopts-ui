import React, { Component } from "react";
import { Modal, Button, Table, FormGroup, ListGroup, ListGroupItem, Spinner, Form, Col, Row, Container, Pagination } from "react-bootstrap";
import { AppProps } from "../../types/App";
import * as ledger from "../../controllers/ledger";
import AppBtc from "@ledgerhq/hw-app-btc";
import { UTXO } from "../../types/Bitcoin";
import * as bitcoin from 'bitcoinjs-lib';
import { FaExternalLinkAlt } from "react-icons/fa";
import * as utils from '../../utils/utils';
import Big from "big.js";

// const EXPLORER_URL = "https://www.blockchain.com/btc/address";
const EXPLORER_URL = "https://www.blockchain.com/btc-testnet/address";

const addressLink = (fromAddress: string) => {
    return (
        <a className="ml-3" href={`${EXPLORER_URL}/${fromAddress}`}>
            <FaExternalLinkAlt/>
        </a>
    )
}

function satToBtc(val: number) {
    return utils.satToBtc(utils.newBig(val));
}

interface ConnectLedgerProps extends AppProps {
    updateApp(app: AppBtc): void;
}

interface ConnectLedgerState {
    loaded: boolean;
}

class ConnectLedger extends Component<ConnectLedgerProps> {
    state: ConnectLedgerState = {
        loaded: false,
    }
    
    async componentDidMount() {
        try {
            let app = await ledger.connect();
            await ledger.getWalletAddress(app, 0);
            this.props.updateApp(app);
            this.setState({loaded: true});
        } catch (error) {
            console.log("Could not connect to ledger!");
        }
    }

    render() {
        return (
            <FormGroup>
                <h5>Connect Your Device</h5>
                <Form.Text className="text-muted">
                    You may need to open the Bitcoin app.
                </Form.Text>
                {!this.state.loaded &&
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                }
            </FormGroup>
        );
    }
}

interface AccountListProps extends AppProps {
    appBtc: AppBtc;
    fromAddress: string;
    accounts: Record<string, number>;
    updateAccounts(accts: Record<string, number>): void;
    updateBtcAddress(addr: string): void;

}

interface AccountListState {
    loaded: boolean;
    index: number;
    accounts: Record<string, number>;
}

const ENTRIES_PER_PAGE = 5;

class AccountList extends Component<AccountListProps> {
    state: AccountListState = {
        loaded: Object.keys(this.props.accounts).length > 0,
        index: Object.keys(this.props.accounts).length,
        accounts: this.props.accounts,
    }
    
    async componentDidMount() {
        if (!this.state.loaded) {
            await this.loadAccounts(ENTRIES_PER_PAGE);
        }
    }

    async loadAccounts(length: number) {
        const index = this.state.index;
        let promises = [];
        for (let i = index; i < index + length; i++) {
            const addr = await ledger.getWalletAddress(this.props.appBtc, i);
            const accounts = this.state.accounts;
            accounts[addr] = 0;
            
            promises.push(this.props.btcProvider.getAccountValue(addr).then(value => {
                const accounts = this.state.accounts;
                accounts[addr] = value;
                this.setState({
                    accounts: accounts,
                });
            }));

            this.setState({
                accounts: accounts,
            });
        }
        await Promise.all(promises);
        this.setState({
            loaded: true,
            index: index + length,
        });
    }

    onChange(addr: string, e: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = e.target;
        if (checked) {
          this.props.updateBtcAddress(addr);
        } 
    }

    render() {
        return (
            <FormGroup>
                <h5>Choose An Address</h5>
                <Table hover responsive size={"md"}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Address</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.accounts).map(addr => {
                            return (
                                <tr key={addr}>
                                    <td>
                                        <input type="radio" name="address" checked={addr===this.props.fromAddress} onChange={this.onChange.bind(this, addr)} />
                                    </td>
                                    <td>{addr} {addressLink(addr)}</td>
                                    <td>{satToBtc(this.state.accounts[addr]).toString()} BTC</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Container fluid>
                    <Row className="justify-content-md-center">
                        {!this.state.loaded &&
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="mb-3"
                            />
                        }
                    </Row>
                    <Row className="justify-content-md-center">
                        {this.state.loaded &&
                            <Button onClick={() => {
                                    this.setState({loaded: false})
                                    this.loadAccounts(ENTRIES_PER_PAGE)
                                }}>
                                Show More
                            </Button>
                        }
                    </Row>
                    </Container>
            </FormGroup>
        );
    }
}

interface UtxoListProps extends AppProps {
    fromAddress: string;
    toAmount: Big;
    updateUtxos(utxos: Array<UTXO>): void;
}

interface UtxoListState {
    allUtxos: Array<UTXO>;
    useUtxos: Array<UTXO>;
    total: number;
}

class UtxoList extends Component<UtxoListProps> {
    state: UtxoListState = {
        allUtxos: [],
        useUtxos: [],
        total: 0,
    }
    
    async componentDidMount() {
        const { btcProvider, fromAddress } = this.props;
        const utxos = await btcProvider.getAccountUtxos(fromAddress);
        this.setState({
            allUtxos: utxos,
        });
    }

    onChange(utxo: UTXO, e: React.ChangeEvent<HTMLInputElement>) {
        let { useUtxos, total } = this.state;
        const { checked } = e.target;

        if (checked) {
          useUtxos.push(utxo);
          total += utxo.value;
        } else {
          let index = useUtxos.indexOf(utxo);
          useUtxos.splice(index, 1);
          total -= utxo.value;
        }
    
        this.setState({ useUtxos: useUtxos, total: total });
        this.props.updateUtxos(useUtxos);
    }

    render() {
        return (
            <FormGroup>
                <h5>Choose Unspent Outputs</h5>
                <FormGroup>
                    <ListGroup>
                        <ListGroupItem>Required: <strong>{this.props.toAmount.toString()}</strong></ListGroupItem>
                        <ListGroupItem>Supplied: <strong>{satToBtc(this.state.total).toString()}</strong></ListGroupItem>
                    </ListGroup>
                </FormGroup>
                <FormGroup>
                    <Table hover responsive size={"md"}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>TxID</th>
                                <th>Index</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.allUtxos.map(utxo => {
                                return (
                                    <tr key={utxo.txid}>
                                        <td>
                                            <input type="checkbox" value={utxo.txid + utxo.vout} onChange={this.onChange.bind(this, utxo)} />
                                        </td>
                                        <td>{utxo.txid}</td>
                                        <td>{utxo.vout}</td>
                                        <td>{satToBtc(utxo.value).toString()} BTC</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </FormGroup>
            </FormGroup>
        );
    }
}

interface ConfirmProps extends AppProps {
    appBtc: AppBtc;
    fromAddress: string;
    toAddress: string;
    toOutput: Buffer;
    toAmount: Big;
    utxos: Array<UTXO>;
}

interface ConfirmState {
    txHex?: string;
}

class Confirm extends Component<ConfirmProps> {
    state: ConfirmState = {}

    async createTransaction() {
        try {
            const { btcProvider, appBtc, utxos, toOutput, toAmount } = this.props;
            let amount = parseInt(utils.btcToSat(toAmount).toString());
            let txHex = await ledger.createTransaction(appBtc, amount, await Promise.all(utxos.map(async utxo => {
                return {
                    hex: await btcProvider.getHexTransaction(utxo.txid),
                    ...utxo
                }
            })), toOutput);
            this.setState({
                txHex: txHex,
            });
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return (
            <FormGroup>
                <h5>Confirm & Pay</h5>
                <p>Please carefully validate the information below.</p>
                <FormGroup>
                    <ListGroup>
                        <ListGroupItem>To: <strong>{this.props.toAddress}</strong> {addressLink(this.props.toAddress)}</ListGroupItem>
                        <ListGroupItem>From: <strong>{this.props.fromAddress}</strong> {addressLink(this.props.fromAddress)}</ListGroupItem>
                        <ListGroupItem>Total: <strong>{satToBtc(this.props.utxos.reduce((value, utxo) => value + utxo.value, 0)).toString()} BTC</strong></ListGroupItem>
                        <ListGroupItem>Amount: <strong>{this.props.toAmount.toString()} BTC</strong></ListGroupItem>
                        {this.state.txHex &&
                            <ListGroupItem style={{ overflowWrap: "anywhere" }}>Raw Tx: <strong>{this.state.txHex}</strong></ListGroupItem>
                        }
                    </ListGroup>
                </FormGroup>
                <FormGroup>
                    <Row className="justify-content-md-center">
                        <Button onClick={this.createTransaction.bind(this)}>
                            Confirm
                        </Button>
                    </Row>
                </FormGroup>
            </FormGroup>
        );
    }
}

interface LedgerWizardProps extends AppProps {
    hideLedgerModal: () => void;
    btcAddress: string;
    btcOutput: Buffer;
    btcAmount: Big;
}

interface LedgerWizardState {
    currentStep: number;
    appBtc?: AppBtc;
    accounts: Record<string, number>;
    btcAddress: string;
    utxos: UTXO[];
}

export default class LedgerWizard extends Component<LedgerWizardProps> {
  state: LedgerWizardState = {
    currentStep: 0,
    accounts: {},
    btcAddress: "",
    utxos: [],
  }

  constructor(props: LedgerWizardProps) {
    super(props);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);

  }

  _next() {
    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 3? 4: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }
    
  _prev() {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 0? 0: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  get previousButton(){
    let currentStep = this.state.currentStep;
    if(currentStep>1){
      return (
        <button 
          className="btn btn-secondary float-left" 
          type="button" onClick={this._prev}>
        Previous
        </button>
      )
    }
    return null;
  }
  
  get nextButton(){
    let { appBtc, currentStep, btcAddress } = this.state;

    if (currentStep===0 && !appBtc) return null;
    if (currentStep===1 && btcAddress==="") return null;
    if (currentStep===2 && btcAddress==="") return null;

    if(currentStep<3){
      return (
        <button 
          className="btn btn-primary float-right" 
          type="button" onClick={this._next}>
        Next
        </button>        
      )
    }
    return null;
  }

  updateAppBtc(app: AppBtc) {
    this.setState({
        appBtc: app,
    });
  }

  updateAccounts(accs: Record<string, number>) {
    this.setState({
        accounts: accs,
    });
  }

  updateBtcAddress(addr: string) {
    this.setState({
        btcAddress: addr,
    });
  }

  updateUtxos(utxos: Array<UTXO>) {
    this.setState({
        utxos: utxos,
    });
  }

  exitModal() {
    this.props.hideLedgerModal();
    this.setState({step: 1});
  }

  render() {
    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => this.exitModal()}
            show={true}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Ledger
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.state.currentStep == 0 &&
                    <ConnectLedger
                        updateApp={this.updateAppBtc.bind(this)}
                        {...this.props}
                    />
                }
                {this.state.appBtc &&
                    <div>
                        {this.state.currentStep == 1 &&
                            <AccountList
                                appBtc={this.state.appBtc}
                                fromAddress={this.state.btcAddress}
                                updateBtcAddress={this.updateBtcAddress.bind(this)}
                                accounts={this.state.accounts}
                                updateAccounts={this.updateAccounts.bind(this)}
                                {...this.props}
                            />
                        }
                        {this.state.currentStep == 2 &&
                            <UtxoList
                                toAmount={this.props.btcAmount}
                                fromAddress={this.state.btcAddress}
                                updateUtxos={this.updateUtxos.bind(this)}
                                {...this.props}
                            />
                        }
                        {this.state.currentStep == 3 &&
                            <Confirm
                                appBtc={this.state.appBtc}
                                fromAddress={this.state.btcAddress}
                                toAmount={this.props.btcAmount}
                                toAddress={this.props.btcAddress}
                                toOutput={this.props.btcOutput}
                                utxos={this.state.utxos}
                                {...this.props}
                            />
                        }
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                {this.previousButton}
                {this.nextButton}
                <Button variant="danger" onClick={() => this.exitModal()}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
  }
}