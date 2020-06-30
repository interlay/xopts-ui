import React, { Component } from "react";
import { Container, Image } from "react-bootstrap";
import UserPurchasedOptions from "../components/UserPurchasedOptions";
import UserSoldOptions from "../components/UserSoldOptions";
import { Redirect } from "react-router-dom";
import Relay from "../components/Relay";
import bitcoinImg from "../assets/img/icons/32/btc.png";
import daiImg from "../assets/img/icons/32/dai.png";
import {AppProps} from "../types/App";
import { Breadcrumb, BreadcrumbItem, Row, Col } from "reactstrap";
import Widget from "../components/Widget/Widget";
import { FaUser } from "react-icons/fa";

export default class Positions extends Component<AppProps> {

  componentDidMount(){
    this.forceUpdate();
  }
  
  render() {
    if(!this.props.isLoggedIn){
      return <Redirect to="/trade" />
    }
    return (
      <div>
        <h1 className="mb-lg">Your Positions</h1>
        <h2 className="lead text-muted mb-lg">(Testnet - Ropsten)</h2>
        <Row>
          <Col sm={12} md={6}>
            <Widget title="Relay Status" >
              <Relay {...this.props} />
            </Widget>

          </Col>
          <Col sm={12} md={6}>
            <Widget title="Exchange Rate" >
              <a className="nav-link" href="https://www.cryptocompare.com/" target="__blank"> 
                {this.props.btcPrices.dai} BTC/DAI  &nbsp; - &nbsp;
                {this.props.btcPrices.usd} BTC/USD &nbsp; - &nbsp;
                {this.props.daiPrices.usd} DAI/USD
              </a>
            </Widget>
          </Col>
        </Row>

        <UserPurchasedOptions {...this.props} />
        <UserSoldOptions {...this.props} />
      </div>
    );
  }
}