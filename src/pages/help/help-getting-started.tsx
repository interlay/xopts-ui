import React, { ReactElement } from "react";

export default function HelpGettingStarted(): ReactElement {
    return (
        <div className="col-xl-8 offset-xl-2 text-justify border-top" id="getting-started">
            <div className="row">
                <div>
                    <h2 className="mt-5">Getting Started</h2>
                    <p>
                            XOpts is deployed on the 
                        <a href="https://ropsten.etherscan.io/" target="__blank"> 
                                Ethereum Ropsten testnet
                        </a> and accepts payments in 
                        <a href="https://blockstream.info/testnet/" target="__blank">
                                testnet Bitcoin
                        </a>. 
                    </p>

                    <p>To test XOpts, you will need the following things: </p>

                    <h6>Wallets</h6>
                    <ul>
                        <li>Ethereum web wallet, e.g. 
                            <a href="https://metamask.io/" target="__blank">
                                Metamask
                            </a> or similar. 
                        </li>
                        <li>Bitcoin testnet wallet, e.g. the 
                            <a  href="https://play.google.com/store/apps/details?id=de.schildbach.wallet_test" 
                                target="__blank">
                                "Testnet Wallet"
                            </a>
                        </li>
                    </ul>

                    <h6>Testnet funds</h6>
                    We provide links to faucets in the topbar.
                    <ul>
                        <li>
                            Testnet (Ropsten) ETH. You need this to pay transaction fees. 
                            <a href="https://metamask.io/" target="__blank">
                                Get from faucet
                            </a>.
                        </li>
                        <li>
                            Testnet BTC. 
                            <a href="https://metamask.io/" target="__blank">
                                Get from faucet
                            </a>. 
                        </li>
                        <li>
                            Testnet DAI. 
                            <strong>We provide this. Simply press the "Get testnet DAI" button in the topbar</strong> 
                            (appears when you connect your wallet).
                        </li>
                    </ul>

                    <h6>For developers</h6>
                        You can check out the code on <a href="https://github.com/interlay/xopts" target="__blank">
                            Github
                    </a>. 
                </div>
            </div>
        </div>
    );
}
