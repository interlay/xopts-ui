import React, { ReactElement, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../assets/img/xopts.png";
import { Link } from "react-router-dom";
import { changeSelectedExpiryAction } from "../../actions/ui.actions";
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
    const options = useSelector((state: AppState) => state.options);
    const allOptions = -1;

    const closeDropDownMenu = () => {
        if (window.innerWidth <= 768) {
            setIsOpened(false);
        }
    };

    const openPage = (page: string, isOption = false) => {
        return () => {
            closeDropDownMenu();
            if (isOption) {
                dispatch(changeSelectedExpiryAction(Number(page)));
            }
            setSelectedPage(page);
        };
    };

    const connectWallet = async (activeLogin: boolean) => {
        const etherProvider = await detectEthereumProvider();
        setHasMetaMask(etherProvider);
        if (etherProvider) {
            try {
                const account = await etherProvider.request({ method: "eth_requestAccounts" });
                console.log(account);
                console.log(activeLogin);
                // const provider = new ethers.providers.Web3Provider(etherProvider);
                // const contracts = (await ReadWriteContracts.resolve(provider))!;
                // const options = await contracts.listOptions();
                // const pair = await contracts.getPair(options[0]);
                // const details = await pair.getDetails();
                dispatch(updateIsUserConnectedAction(true));
            } catch (error) {
                console.log(error);
            }
        } else {
            dispatch(updateIsUserConnectedAction(false));
        }
    };

    useEffect(()=> {
        connectWallet(false);
    });

    return <div className="top-navigation container-fluid">
        <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-4">
                <Link to="/">
                    <img src={logo} width="30" height="30" alt="company logo" 
                        className="d-inline-block align-top img-fluid"/>
                    <div className="app-name">XOpts</div>
                </Link>
            </div>
            <div className="menu col-xl-8 col-lg-8 col-md-8 col-sm-6 col-8">
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
                        to="/trade-options" 
                        onClick={openPage(allOptions.toString())}>
                            Options
                    </Link>
                    <Link className={"nav-item side" + (allOptions === Number(selectedPage) ? " selected-item" : "")} 
                        to="/developers" 
                        onClick={openPage(allOptions.toString())}>
                            All Expirations
                    </Link>
                    
                    {options.map((option, index) => {
                        return <Link 
                            className={"nav-item side"+(option.expiry === Number(selectedPage) ? " selected-item" :"")}
                            to="/trade-options"
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