import React, { ReactElement } from "react";
import Page from "../page/page";

declare global {
    // eslint-disable-next-line
    interface Window { web3: any; ethereum: any; }
}

export default function LandingPage(): ReactElement {

    return (
        <Page sideBar={false}>
            <div></div>
        </Page>
    );
}