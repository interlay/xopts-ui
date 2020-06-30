import { Button } from "react-bootstrap";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppPropsLoading } from "../types/App";

export default class Web3LogIn extends Component<AppPropsLoading> {
    handleLogIn() {
        this.props.tryLogIn(true);
    }

    render() {
        if (this.props.isLoggedIn && this.props.address) {
            return (
                <Link className="nav-link" to="/positions">
                    <Button variant="outline-success" size="sm"> Account: {this.props.address.substring(0, 10)}...{this.props.address.substring(38)}</Button>
                </Link>
            )
        } else if (this.props.isWeb3) {
            return <Link className="nav-link" to="#"><Button size="sm" variant="outline-dark" onClick={() => { this.handleLogIn() }}> Connect Wallet</Button></Link>
        } else {
            return <a className="nav-link" href="https://metamask.io/download.html" target="__blank"><Button size="sm" variant="outline-primary"> Get MetaMask</Button></a>
        }
    }
}
