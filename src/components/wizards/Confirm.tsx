import React, { Component } from "react";
import { ListGroup, ListGroupItem, Form, Modal, FormGroup, Image } from "react-bootstrap";
import { showSuccessToast, showFailureToast } from '../../controllers/toast';
import { STABLE_CONFIRMATIONS } from "../../controllers/bitcoin-data";
import { FaTrash, FaChevronRight } from "react-icons/fa";
import { SpinButton } from "../SpinButton";
import blockstreamImg from "../../assets/img/blockstream.png";
import {AppProps} from "../../types/App";
import * as utils from '../../utils/utils';

const Item = ( {href, active, children}: {href?: string, active: boolean, children: any} ) => (
    <ListGroup.Item
        href={href}
        action
        disabled={href===undefined}
        className="text-center"
        active={active}
        variant={active ? "success" : undefined}
    >
        {children}
    </ListGroup.Item>
)

type Transaction = {
    amountBtc: string
    btcAddress: string
    ethAddress: string
    option: string
    txid: string
    confirmations: number
}

type FullTransaction = Transaction & {
    contract: string
    height: number
    index: number
    proof: string
    rawtx: string
}

interface SelectProps extends AppProps {
    step: number
    contract: string
    exerciseOption: (tx: Transaction, index: number) => void
}

interface SelectState {
    loaded: boolean
}

class Select extends Component<SelectProps, SelectState> {
    state: SelectState = {
        loaded: false,
    }

    componentDidMount() {
        if (this.props.storage && this.props.btcProvider && !this.state.loaded) {
            this.setState({
                loaded: true
            });
        }
    }

    removePendingOption(option: string, txid: string) {
        this.props.storage.removePendingOption(option, txid);
        this.forceUpdate();
    }

    loadPending() {
        if (this.state.loaded) {
            let options = this.props.storage.getPendingTransactionsFor(this.props.contract);
            return options.map((pendingOption, index) => {
                if (!pendingOption) return null;
                const { txid, amountBtc, btcAddress, ethAddress, optionId, confirmations } = pendingOption;
                const option = this.props.contract;

                return (
                    <ListGroup key={txid + btcAddress} horizontal>
                        <Item active={confirmations >= STABLE_CONFIRMATIONS}>{optionId}</Item>
                        <Item 
                            href={"https://live.blockcypher.com/btc-testnet/tx/" + txid}
                            active={confirmations >= STABLE_CONFIRMATIONS}>
                                {utils.concat(txid)}
                        </Item>
                        <Item active={confirmations >= STABLE_CONFIRMATIONS}>{amountBtc} BTC</Item>
                        <Item active={confirmations >= STABLE_CONFIRMATIONS}>{confirmations} / {STABLE_CONFIRMATIONS}</Item>

                        <ListGroup.Item
                            action
                            disabled={confirmations < STABLE_CONFIRMATIONS}
                            className="text-center"
                            onClick={() => this.props.exerciseOption({amountBtc, btcAddress, ethAddress, option, txid, confirmations}, index)}
                        >
                            Confirm <FaChevronRight/>
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            className="text-center"
                            onClick={() => this.removePendingOption(option, txid)}
                        >
                            Remove <FaTrash/>
                        </ListGroup.Item>
                    </ListGroup>
                  );
            });
        }
    }

    render() {
        if (this.props.step !== 1) {
            return null
        }
        return (
            <ListGroup>
                <p>We monitor your pending transactions via the <Image src={blockstreamImg}  height="40" /> API, please confirm once ready to finalize the contract.</p>
                {this.loadPending()}
            </ListGroup>
        )
    }
}

interface ExerciseProps extends AppProps {
    step: number
    contract: string
    exitModal: () => void
    reloadPurchased: () => void
    toast: any
    tx: FullTransaction
    index: number
}

interface ExerciseState {
    spinner: boolean
    loaded: boolean
}

class Exercise extends Component<ExerciseProps, ExerciseState> {
    state: ExerciseState = {
        spinner: false,
        loaded: false,
    }

    componentDidUpdate() {
        if (this.props.storage && this.props.btcProvider && !this.state.loaded) {
            this.setState({
                loaded: true
            });
        }
    }

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { contract, ethAddress, height, index, txid, proof, rawtx } = this.props.tx;
        this.setState({spinner: true});
        try {
            let id = "0x" + Buffer.from(txid, 'hex').reverse().toString('hex');
            await this.props.contracts.exerciseOption(contract, ethAddress, height, index, id, proof, rawtx);
            showSuccessToast(this.props.toast, 'Success!', 3000);
            this.props.storage.removePendingOption(contract, txid);
            this.props.exitModal();
            this.props.reloadPurchased();
        } catch (error) {
            console.log(error);
            showFailureToast(this.props.toast, 'Failed to send transaction...', 3000);
        }
        this.setState({spinner: false});
    }

    render() {
        if (!this.props.tx) return null;
        if (this.props.step !== 2) return null;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <ListGroup>
                        <ListGroupItem>Transaction ID: <strong>{this.props.tx.txid}</strong></ListGroupItem>
                        <ListGroupItem>Payment: <strong>{this.props.tx.amountBtc} BTC -&gt; {this.props.tx.btcAddress}</strong></ListGroupItem>
                        <ListGroupItem>Block Height: <strong>{this.props.tx.height}</strong></ListGroupItem>
                        <ListGroupItem>Confirmations: <strong>{this.props.tx.confirmations}</strong></ListGroupItem>
                    </ListGroup>
                </FormGroup>
                <SpinButton spinner={this.state.spinner}/>
            </Form>
        )
    }
}

interface ConfWizardProps extends AppProps {
    contract: string
    toast: any
    hide: () => void
    showConfModal: boolean
    reloadPurchased: () => void
}

interface ConfWizardState {
    step: number
    tx: FullTransaction
    index: number
}

export default class ConfWizard extends Component<ConfWizardProps> {
    state: ConfWizardState = {
        step: 1,
        tx: {
            amountBtc: '0',
            btcAddress: '',
            ethAddress: '',
            option: '',
            txid: '',
            confirmations: 0,
            contract: '',
            height: 0,
            index: 0,
            proof: '',
            rawtx: '',
        
        },
        index: 0,
    }

    constructor(props: ConfWizardProps) {
        super(props);

        this.exerciseOption = this.exerciseOption.bind(this);
        this.exitModal = this.exitModal.bind(this);
    }

    async exerciseOption(tx: Transaction, index: number) {
        let step = this.state.step;
        step = step + 1;

        let txid = tx.txid;
        let status;
        let proof;
        let rawtx;

        try {
            status = await this.props.btcProvider.getStatusTransaction(txid);
            if (status.confirmed) {
              proof = await this.props.btcProvider.getMerkleProof(txid);
              rawtx = await this.props.btcProvider.getRawTransaction(txid);
            } else {
                return;
            }
        } catch(error) {
            console.log(error);
            showFailureToast(this.props.toast, 'Error fetching transaction...', 3000);
            return;
        }

        let nodes = proof.merkle.map((value) => Buffer.from(value, 'hex').reverse().toString('hex')).join("");

        this.setState({
            step: step,
            tx: {
                txid: txid,
                amountBtc: tx.amountBtc,
                contract: tx.option,
                btcAddress: tx.btcAddress,
                ethAddress: tx.ethAddress,
                confirmations: status.confirmations,
                height: proof.block_height,
                index: proof.pos,
                proof: "0x" + nodes,
                rawtx: "0x" + rawtx.toString('hex'),
            },
            index: index,
        });
    }

    exitModal() {
        this.props.hide();
        this.setState({step: 1});
    }

    render() {
        return (
            <Modal
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.props.showConfModal} onHide={() => this.exitModal()}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Verify Payment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Select
                        step={this.state.step}
                        exerciseOption={this.exerciseOption}
                        {...this.props}
                    />
                    <Exercise
                        step={this.state.step}
                        tx={this.state.tx}
                        index={this.state.index}
                        exitModal={this.exitModal}
                        {...this.props}
                        reloadPurchased={this.props.reloadPurchased}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}