import React, { ReactElement, useState } from "react";
import logo from "../../../assets/img/xopts.png";
import { Link } from "react-router-dom";

import "./top-navigation.scss";

export default function TopNavigation(): ReactElement {
    const [isOpened, setIsOpened] = useState(false);

    const closeDropDownMenu = () => {
        if (window.innerWidth <= 768) {
            setIsOpened(false);
        }
    };

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
                    <Link className="nav-item" onClick={closeDropDownMenu} to="/help">
                        Help
                    </Link>
                    <Link className="nav-item" onClick={closeDropDownMenu} to="/">
                        Developers
                    </Link>
                </div>
            </div>
        </div>
    </div>;
}