import React, { ReactElement } from "react";
import logo from "../../../assets/img/xopts.png";
import { Link } from "react-router-dom";

import "./top-navigation.scss";

export default function TopNavigation(): ReactElement {
    return <div className="top-navigation container-fluid">
        <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-6">
                <Link to="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top img-fluid"/>
                    <div className="app-name">XOpts</div>
                </Link>
            </div>
            <div className="menu col-xl-8 col-lg-8 col-md-6 col-sm-6 col-xs-6">
                <div className="bars"><i className="fas fa-bars"></i></div>
                <Link className="nav-item" to="/help">
                    Help
                </Link>
            </div>
        </div>
    </div>;
}