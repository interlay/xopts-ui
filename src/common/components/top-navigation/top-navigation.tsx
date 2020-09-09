import React, { ReactElement, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../assets/img/xopts.png";
import { Link } from "react-router-dom";
import { changeSelectedPageAction, changeCurrencyAction } from "../../actions/ui.actions";
import { AppState } from "../../types/util.types";
import { updateIsUserConnectedAction } from "../../actions/user.actions";
import { useHistory } from "react-router-dom";
import { filterUniqueOptions } from "../../utils/utils";

import "./top-navigation.scss";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

export default function TopNavigation(): ReactElement {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedPage, setSelectedPage] = useState("");
    const [hasMetaMask, setHasMetaMask] = useState(null);
    const dispatch = useDispatch();
    const btcPrice = useSelector((state: AppState) => state.prices.btc);
    const options = useSelector((state: AppState) => state.options);
    const uniqueOptions = filterUniqueOptions(options);
    const history = useHistory();
    const currency = useSelector((state: AppState) => state.ui.currency);
    const isConnected = useSelector((state: AppState) => state.user.isConnected);

    const closeDropDownMenu = () => {
        if (window.innerWidth <= 768) {
            setIsOpened(false);
        }
    };

    const openPage = (page: string, isOption = false) => {
        return () => {
            closeDropDownMenu();
            if (isOption) {
                dispatch(changeSelectedPageAction(page));
            }
            setSelectedPage(page);
        };
    };

    const connectWallet = async (activeLogin: boolean) => {
        const etherProvider = await detectEthereumProvider();
        const isUnlocked = await etherProvider._metamask.isUnlocked();
        setHasMetaMask(etherProvider);

        if (etherProvider && (activeLogin || isUnlocked)) {
            try {
                const account = await etherProvider.request({ method: "eth_requestAccounts" });
                console.log(account);
                dispatch(updateIsUserConnectedAction(true));
            } catch (error) {
                console.log(error);
            }
        } else {
            if (isConnected === true){
                dispatch(updateIsUserConnectedAction(false));
            }
        }
    };

    const changeTab = (currency: string) => {
        dispatch(changeCurrencyAction(currency));
        history.push("/trade-options/" + currency);
    };

    useEffect(()=> {
        connectWallet(false);
    });

    return <div className="top-navigation container-fluid">
        <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-5 col-sm-6 col-10">
                <Link to="/"
                    onClick={openPage("landing")}>
                    <img src={logo} width="30" height="30" alt="company logo" 
                        className="d-inline-block align-top img-fluid"/>
                    <div className="app-name">XOpts</div>
                </Link>
                {(history.location.pathname.indexOf("/trade-options/") !== -1) && <div className="tabs">
                    <div className={"tab" + (currency==="btc" ? " active" : "")} onClick={()=>changeTab("btc")}>
                        <p><i className="fab fa-bitcoin"></i>&nbsp;Bitcoin</p>
                        <p>{btcPrice}</p>
                    </div>
                    <div className="tab eth">
                        <p><i className="fab fa-ethereum"></i>&nbsp;Ethereum</p>
                        <p>Coming Soon</p>
                    </div>
                </div>
                }
            </div>
            <div className="menu col-xl-8 col-lg-8 col-md-7 col-sm-6 col-2">
                <div className="bars" onClick={()=>{setIsOpened(!isOpened);}}><i className="fas fa-bars"></i></div>
                <div className={"navigation-items " + (isOpened ? "open" : "")}>
                    {hasMetaMask && <div className="nav-item nav-button" onClick={() => { connectWallet(true); }}>
                        Login
                    </div>}
                    {!hasMetaMask && <a className="nav-item" href="https://metamask.io/download.html" target="__blank">
                        <div className="nav-button"> Get Metamask</div>
                    </a>}
                    <Link className={"nav-item" + ("help" === selectedPage ? " selected-item" : "")} 
                        to="/help"
                        onClick={openPage("help")}>
                        Help
                    </Link>
                    <Link className={"nav-item" + ("developers" === selectedPage ? " selected-item" : "")}
                        onClick={openPage("developers")} to="/">
                        Developers
                    </Link>
                    <Link className={"nav-item" + ("bitcoin" === selectedPage ? " selected-item" : "")} 
                        to="/bitcoin" 
                        onClick={openPage("bitcoin")}>
                            Bitcoin
                    </Link>
                    <Link className={"nav-item" + ("trade-options" === selectedPage ? " selected-item" : "")} 
                        to={"/trade-options/" + currency} 
                        onClick={openPage("all-expirations")}>
                            Options
                    </Link>
                    <Link className={"nav-item side" + ("all-expirations" === selectedPage ? " selected-item" : "")} 
                        to="/developers" 
                        onClick={openPage("all-expirations")}>
                            All Expirations
                    </Link>
                    
                    {uniqueOptions.map((option, index) => {
                        return <Link 
                            className={"nav-item side"+(option.expiry === Number(selectedPage) ? " selected-item" :"")}
                            to={"/trade-options/" + currency}
                            key={index} 
                            onClick={openPage(option.expiry.toString())}>
                            {new Date(option.expiry).toDateString().slice(4,15)}
                        </Link>;
                    })
                    }

                </div>
            </div>
        </div>
    </div>;
}