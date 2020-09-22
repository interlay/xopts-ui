import React, { ReactElement, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../assets/img/xopts.png";
import { Link } from "react-router-dom";
import { changeSelectedPageAction } from "../../actions/ui.actions";
import { AppState } from "../../types/util.types";
import { updateIsUserConnectedAction } from "../../actions/user.actions";

import "./top-navigation.scss";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

export default function TopNavigation(): ReactElement {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedPage, setSelectedPage] = useState("");
    const [hasMetaMask, setHasMetaMask] = useState(null);
    const dispatch = useDispatch();
    const btcPrice = useSelector((state: AppState) => state.prices.btc);
    const currency = useSelector((state: AppState) => state.ui.currency);
    const account = useSelector((state: AppState) => state.user.account);

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
                console.log(account[0]);
                dispatch(updateIsUserConnectedAction(true,account[0]));
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(()=> {
        connectWallet(false);
    });

    return <div className="top-navigation container-fluid">
        <div className="price">
            <p>BTC/USD</p>
            <p>{btcPrice}</p>
        </div> 
        <div className="row">
            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-10 logo-section">
                <Link to="/"
                    onClick={openPage("landing")}>
                    <img src={logo} width="30" height="30" alt="company logo" 
                        className="d-inline-block align-top img-fluid"/>
                    <div className="app-name">XOpts</div>
                </Link>
                <Link className={"nav-item first" + ("all-expirations" === selectedPage ? " selected-item" : "")} 
                    to={"/trade-options/" + currency} 
                    onClick={openPage("all-expirations")}>
                        Options
                </Link>
                <Link className={"nav-item" + ("earn" === selectedPage ? " selected-item" : "")} 
                    to="/earn/deposit" 
                    onClick={openPage("earn")}>
                        Earn
                </Link>
                <Link className={"nav-item" + ("exchange" === selectedPage ? " selected-item" : "")} 
                    to="/exchange" 
                    onClick={openPage("exchange")}>
                        Exchange
                </Link>
            </div>
            <div className="menu col-xl-7 col-lg-7 col-md-6 col-sm-6 col-2">
                <div className="bars" onClick={()=>{setIsOpened(!isOpened);}}><i className="fas fa-bars"></i></div>
                <div className={"navigation-items " + (isOpened ? "open" : "")}>
                    {hasMetaMask  && account === undefined && 
                        <div className="nav-item nav-button" onClick={() => { connectWallet(true); }}>
                            Login
                        </div>
                    }
                    {hasMetaMask && account &&
                        <div className="dropdown">
                            <button className="nav-item nav-button dropdown-toggle" type="button" id="dropdownMenu" 
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                {account.substring(0,6) + "..." + account.substring(account.length-4, account.length)}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenu">
                                <Link className="dropdown-item" to="/account">My Account</Link>
                            </div>
                        </div>
                    }
                    {!hasMetaMask && <a className="nav-item" href="https://metamask.io/download.html" target="__blank">
                        <div className="nav-button"> Get Metamask</div>
                    </a>}
                    <Link className={"nav-item" + ("help" === selectedPage ? " selected-item" : "")} 
                        to="/help"
                        onClick={openPage("help")}>
                        Help
                    </Link>
                    {selectedPage!=="all-expirations" &&
                        <Link className={"nav-item" + ("developers" === selectedPage ? " selected-item" : "")}
                            onClick={openPage("developers")} to="/help">
                            Developers
                        </Link>
                    }
                    <Link className={"nav-item only-in-menu" + 
                        ("all-expirations" === selectedPage ? " selected-item" : "")}
                    to={"/trade-options/" + currency} 
                    onClick={openPage("all-expirations")}>
                            Options
                    </Link>
                    <Link className={"nav-item only-in-menu" + ("earn" === selectedPage ? " selected-item" : "")} 
                        to="/earn" 
                        onClick={openPage("earn")}>
                            Earn
                    </Link>
                    <Link className={"nav-item only-in-menu" + ("exchange" === selectedPage ? " selected-item" : "")} 
                        to="/exchange" 
                        onClick={openPage("exchange")}>
                            Exchange
                    </Link>
                </div>
            </div>
        </div>
    </div>;
}