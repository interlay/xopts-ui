import React, { ReactElement } from "react";
import ReactTooltip from "react-tooltip";

import "./page.scss";

type PageProps = {
    children: ReactElement
}

export default function Page ({children}: PageProps): ReactElement {
    return <div className="page ">
        <div className="page-content">
            <ReactTooltip place="top" type="info" effect="solid"/>
            {children}
        </div>
    </div>;
}