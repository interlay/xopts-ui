import React, { ReactElement } from "react";
import HelpBuy from "./help-buy";
import HelpExercise from "./help-exercise";
import HelpSell from "./help-sell";
import HelpRefund from "./help-refund";
import HelpGettingStarted from "./help-getting-started";
import Page from "../page/page";

export default function HelpPage(): ReactElement{
    return (
        <Page>
            <React.Fragment>
                <section className="center-text">
                    <h2 className="brand-color">XOpts User Guide</h2>
                    <h3 className="lead text-muted">Learn how to buy and sell BTC options.</h3>
                </section>
                <div className="container-fluid">
                    <section className="col-xl-8 offset-xl-2">
                        <h2>Guides</h2>
                        <div>
                            <li className="list-group-item border-0">
                                <a href="#getting-started" className="list-group-item-action">Getting Started</a>
                            </li>
                            <li className="list-group-item border-0">
                                <a href="#buy-help" className="list-group-item-action">How to Buy Options</a>
                            </li>
                            <li className="list-group-item border-0">
                                <a href="#execute-help" className="list-group-item-action">
                                    How to Exercise Options
                                </a>
                            </li>
                            <li className="list-group-item border-0">
                                <a href="#sell-help" className="list-group-item-action">
                                    How to Sell Options
                                </a>
                            </li>
                            <li className="list-group-item border-0">
                                <a href="#refund-help" className="list-group-item-action">
                                    How to Refund Expired Options
                                </a>
                            </li>
                        </div>
                    </section>
                    <section className="mt-5">
                        <HelpGettingStarted/>
                    </section>
                    <section className="mt-5">
                        <HelpBuy />
                    </section>
                    <section className="mt-5">
                        <HelpExercise />
                    </section>
                    <section className="mt-5">
                        <HelpSell />
                    </section>
                    <section className="mt-5">
                        <HelpRefund />
                    </section>
                </div>
            </React.Fragment>
        </Page>
    );
}