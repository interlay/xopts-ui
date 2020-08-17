import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../types/util.types";
import { toggleSideMenuAction } from "../../actions/ui.actions";
import "./side-navigation.scss";

export default function SideNavigation ({}): ReactElement {
    const dispatch = useDispatch();
    const isCollapsed = useSelector((state: AppState) => state.ui.isSideCollapsed);

    return <div className={"side-navigation " + (isCollapsed ? "side-navigation-collapsed" : "")}>
        <div className="side-navigation-items">

        </div>
        <div className="toggle-menu">
            <i className={"fas fa-arrow-" + (isCollapsed ? "right":"left")}
                onClick={()=>dispatch(toggleSideMenuAction(!isCollapsed))}></i>
        </div>
    </div>
}