import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers } from 'ethers';

// Importing Sass with Bootstrap CSS
import "./App.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from "./views/Dashboard";
import Home from "./views/Home";
import Topbar from "./components/Topbar";
import Insure from "./views/Insure";
import Underwrite from "./views/Underwrite";

import optionPoolArtifact from "./artifacts/OptionPool.json"
import putOptionArtifact from "./artifacts/PutOption.json"

const optionPoolAddress = "0x25c344e14b5df94e89021f3b09dad5f462e9b777";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isWeb3: false,
        signer: null,
        address: null,
        provider: null,
        optionPoolContract: null,
        btcPrices: {
          dai: null,
          usd: null,
          eth: null
        }
    };
  }

  componentDidMount() {
    this.getBlockchainData();
    this.getPriceData();
  }


  async getBlockchainData() {
    let web3 = window.web3;
    if (typeof web3 !== 'undefined') {
      let provider = await new ethers.providers.Web3Provider(web3.currentProvider);
      let signer = await provider.getSigner();
      let address = await signer.getAddress();

      let optionPoolAbi = optionPoolArtifact.abi;

      let optionPoolContract = await new ethers.Contract(optionPoolAddress, optionPoolAbi, provider);


      this.setState({
        isWeb3: true,
        signer: signer,
        address: address,
        provider: provider,
        optionPoolContract: optionPoolContract
      });
    }
  }

  async getPriceData() {
    fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=DAI,USD,ETH&api_key=0fe74ac7dd16554406f7ec8d305807596571e13bd6b3c8ac496ac436c17c26e2").then(res => res.json())
    .then(
      (result) => {
        this.setState({
          btcPrices: {
            dai: result.BTC.DAI,
            usd: result.BTC.USD,
            eth: result.BTC.ETH
          }
        })
      }
    )
  }


  render() {
    return (
      <Router>
        <div>
          <Topbar {...this.state} />
          <Switch>
            <Route path="/underwrite">
              <Underwrite />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>

            <Route path="/insure">
              <Insure />
            </Route>
            <Route exact path="/">
              <Home {...this.state}/>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
