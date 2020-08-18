import React, { ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../assets/img/xopts.png";
import { Link } from "react-router-dom";
import { changeSelectedExpiryAction } from "../../actions/ui.actions";
import { AppState } from "../../types/util.types";

import "./top-navigation.scss";

export default function TopNavigation(): ReactElement {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedPage, setSelectedPage] = useState("");
    const dispatch = useDispatch();
    const options = useSelector((state: AppState) => state.options);
    let selectedOption = useSelector((state: AppState) => state.ui.selectedExpiry);
    const allOptions = -1;

    const closeDropDownMenu = () => {
        if (window.innerWidth <= 768) {
            setIsOpened(false);
        }
    };

    const openPage = (page: string, isOption: boolean = false) => {
        return () => {
            closeDropDownMenu();
            if (isOption) {
                dispatch(changeSelectedExpiryAction(Number(page)));
            }
            setSelectedPage(page);
        }
    }

    return <div className="top-navigation container-fluid">
        <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-4">
                <Link to="/">
                    <img src={logo} width="30" height="30" alt="company logo" className="d-inline-block align-top img-fluid"/>
                    <div className="app-name">XOpts</div>
                </Link>
            </div>
            <div className="menu col-xl-8 col-lg-8 col-md-6 col-sm-6 col-8">
                <div className="bars" onClick={()=>{setIsOpened(!isOpened)}}><i className="fas fa-bars"></i></div>
                <div className={"navigation-items " + (isOpened ? "open" : "")}>
                    <Link className={"nav-item" + ("help" === selectedPage ? " selected-item" : "")} 
                        onClick={openPage("help")} to="/help">
                        Help
                    </Link>
                    <Link className={"nav-item" + ("developers" === selectedPage ? " selected-item" : "")}
                        onClick={openPage("developers")} to="/">
                        Developers
                    </Link>
                    <Link className={"nav-item side" + (allOptions === Number(selectedPage) ? " selected-item" : "")} 
                        to="/trade-options" 
                        onClick={openPage(allOptions.toString())}>
                            All Expirations
                    </Link>
                    {
                        options.map((option, index) => {
                            return <Link className={"nav-item side" + (option.expiry === Number(selectedPage) ? " selected-item" : "")} 
                                to="/trade-options"
                                key={index} 
                                onClick={openPage(option.expiry.toString())}>
                                {new Date(option.expiry).toDateString().slice(4,15)}
                            </Link>
                        })
                    }
                </div>
            </div>
        </div>
    </div>;
}