import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import { AppProps } from "../types/App";

interface State {
    loaded: boolean,
    relayAddress: string,
    relayHeight: number,
    blockstreamHeight: number,
}

export default class Relay extends Component<AppProps> {
    state: State = {
        loaded: false,
        relayAddress: "",
        relayHeight: 0,
        blockstreamHeight: 0,
    }
    interval = 0;

    async updateBlockHeights() {
        let relayHeight = await this.props.contracts.getRelayHeight();
        let blockstreamHeight = await this.props.btcProvider.getBlockHeight();
        this.setState({
            relayHeight: relayHeight.toString(),
            relayAddress: this.props.contracts.relayContract.address,
            blockstreamHeight: blockstreamHeight.toString(),
        });
    }

    async componentDidMount() {
        if (this.props.contracts && this.props.btcProvider) {
            await this.updateBlockHeights();
            this.setState({loaded: true});
            this.interval = window.setInterval(() => this.updateBlockHeights(), 5000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        if (!this.state.loaded) return "";
        let relayDiff = this.state.relayHeight - this.state.blockstreamHeight;
        return (
            <p className="text-muted">
                <a href={"https://ropsten.etherscan.io/address/" + this.state.relayAddress}>
                Relay Status: &nbsp;
                {relayDiff <= 1 ? "Online" : (relayDiff <= 6 ? "tailing" : "Offline")} 
                &nbsp;
                <Badge pill variant={relayDiff <= 1 ? "success" : (relayDiff <= 6 ? "warning" : "danger")}>&nbsp;</Badge>
                &nbsp;
                (Block Height: {this.state.relayHeight} / {this.state.blockstreamHeight})
                </a>
            </p>
        )
    }
}