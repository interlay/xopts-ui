import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../types/util.types";
import { toggleSideMenuAction } from "../../actions/ui.actions";
import { Link } from "react-router-dom";
import { changeSelectedPageAction } from "../../actions/ui.actions";
import { filterUniqueOptions } from "../../utils/utils";

import "./side-navigation.scss";

export default function SideNavigation (): ReactElement {
    const dispatch = useDispatch();
    const options = useSelector((state: AppState) => state.options);
    const uniqueOptions = filterUniqueOptions(options);
    const isCollapsed = useSelector((state: AppState) => state.ui.isSideCollapsed);
    const selectedPage = useSelector((state: AppState) => state.ui.selectedPage);

    const openPage = (expiry: string) => {
        return () => {
            dispatch(changeSelectedPageAction(expiry));
        };
    };

    const scrollToPositions = () => {
        window.location.href = "#positions-section";
    };

    return <div className={"side-navigation " + (isCollapsed ? "side-navigation-collapsed" : "")}>
        <div className="side-navigation-items">
            <Link to="/trade-options"
                className={"side-item" + ( selectedPage === "all-expirations" ? " selected-item" : "")}
                onClick={openPage("all-expirations")}>
                {"All " + (!isCollapsed ? "Expirations" : "")}
            </Link>
            {
                uniqueOptions.map((option, index) => {
                    return <Link to="/trade-options"
                        className={"side-item" + (selectedPage === option.expiry.toString() ? " selected-item" : "")} 
                        key={index} 
                        onClick={openPage(option.expiry.toString())}>
                        {!isCollapsed ? new Date(option.expiry).toDateString().slice(4,15) : "20.07"}
                    </Link>;
                })
            }
            <div className={"side-item" + (selectedPage === "/trade-options#positions" ? " selected-item" : "")}
                onClick={scrollToPositions}>
                {"Pos" + (!isCollapsed ? "itions" : "")}
            </div>
        </div>
        <div className="toggle-menu">
            <i className={"fas fa-arrow-" + (isCollapsed ? "right":"left")}
                onClick={()=>dispatch(toggleSideMenuAction(!isCollapsed))}></i>
        </div>
    </div>;
}