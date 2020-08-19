import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../types/util.types";
import { toggleSideMenuAction } from "../../actions/ui.actions";
import { Link } from "react-router-dom";
import { changeSelectedExpiryAction } from "../../actions/ui.actions";

import "./side-navigation.scss";

export default function SideNavigation (): ReactElement {
    const dispatch = useDispatch();
    const options = useSelector((state: AppState) => state.options);
    const isCollapsed = useSelector((state: AppState) => state.ui.isSideCollapsed);
    const selectedOption = useSelector((state: AppState) => state.ui.selectedExpiry);
    const allOptions = -1;  

    const openOption = (expiry: number) => {
        return () => {
            dispatch(changeSelectedExpiryAction(expiry));
        };
    };

    return <div className={"side-navigation " + (isCollapsed ? "side-navigation-collapsed" : "")}>
        <div className="side-navigation-items">
            <Link to="/trade-options"
                className={"side-item" + (allOptions === selectedOption ? " selected-item" : "")}
                onClick={openOption(allOptions)}>
                {"All " + (!isCollapsed ? "Expirations" : "")}
            </Link>
            {
                options.map((option, index) => {
                    return <Link to="/trade-options"
                        className={"side-item" + (selectedOption === option.expiry ? " selected-item" : "")} 
                        key={index} 
                        onClick={openOption(option.expiry)}>
                        {!isCollapsed ? new Date(option.expiry).toDateString().slice(4,15) : "20.07"}
                    </Link>;
                })
            }
        </div>
        <div className="toggle-menu">
            <i className={"fas fa-arrow-" + (isCollapsed ? "right":"left")}
                onClick={()=>dispatch(toggleSideMenuAction(!isCollapsed))}></i>
        </div>
    </div>;
}