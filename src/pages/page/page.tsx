import React, { ReactElement } from "react";

import "./page.scss";

type PageProps = {
    children: ReactElement
}

export default function Page ({children}: PageProps): ReactElement {
    return <div className="page ">
        <div className="page-content">
            {children}
        </div>
    </div>;
}