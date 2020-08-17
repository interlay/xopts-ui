import React, { ReactElement } from "react";
import SideNavigation from "../../common/components/side-navigation/side-navigation";
import { useSelector } from "react-redux";
import { AppState } from "../../common/types/util.types";

import "./page.scss";

type PageProps = {
    children: ReactElement
}

export default function Page (props: PageProps): ReactElement {
    const isSideCollapsed = useSelector((state: AppState) => state.ui.isSideCollapsed);

    return <div className="page">
        <SideNavigation></SideNavigation>
        <div className={"page-content " + (isSideCollapsed ? "side-navigation-collapsed" : "")}>
            {props.children}
        </div>
    </div>;
}