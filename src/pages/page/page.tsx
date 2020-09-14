import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../common/types/util.types";

import "./page.scss";

type PageProps = {
    children: ReactElement
}

export default function Page ({children}: PageProps): ReactElement {
    const isSideCollapsed = useSelector((state: AppState) => state.ui.isSideCollapsed);

    return <div className="page ">
        <div className={"page-content " + (isSideCollapsed ? "side-navigation-collapsed" : "")}>
            {children}
        </div>
    </div>;
}