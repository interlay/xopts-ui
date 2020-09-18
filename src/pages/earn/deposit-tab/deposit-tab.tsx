import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";

import "./deposit-tab.scss";
import { useSelector } from "react-redux";
import { AppState } from "../../../common/types/util.types";

type DepositForm = {
    liquidity: number;
    BTClimit: number;
    btcAddress: string;
}

export default function DepositTab(): ReactElement {
    const btcAddress = useSelector((state: AppState) => state.user.btcAddress);
    const price = useSelector((state: AppState) => state.prices.btc);
    const {register,handleSubmit} = useForm<DepositForm>({defaultValues: {
        BTClimit: price,
        btcAddress
    }});

    const onSubmit = handleSubmit(({BTClimit,btcAddress}) => {
        // TO DO SUBMIT TO SMART CONTRACTS
        console.log(BTClimit,btcAddress);
    });

    return <div className="deposit-tab">
        <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-8 col-12 description">
                By providing USDT liquidity to the platform, you are writing a BTC put option. 
                This allows you to earn interest in the XOpts protocol. It is possible that an option buyer will 
                execute your option and you will receive BTC on the Bitcoin blockchain.
            </div>
        </div>
        <form onSubmit={onSubmit} className="deposit-form">
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                    <p className="label">Liquidity</p>
                    <p className="explanation">The amount of liquidity you want to provide.</p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    <div className="input-group">
                        <input type="number" className="form-control custom-input"
                            name="liquidity" aria-describedby="basic-addon2" ref={register({required: true})}/>
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">USDT</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                    <p className="label">BTC Price Limit</p>
                    <p className="explanation">Select the highest price at which you want to buy Bitcoin.</p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    <div className="input-group">
                        <input type="number" className="form-control custom-input" name="BTClimit" 
                            aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">USDT</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                    <p className="label">BTC Address</p>
                    <p className="explanation">Your BTC address.</p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    <input className="custom-input" name="btcAddress" placeholder="" type="text" ref={register} />
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                    <p className="label">BTC Amount</p>
                    <p className="explanation">
                        The minimum amount of BTC you receive if someone exercises your position.
                    </p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    0.45 BTC
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                    <p className="label">APY</p>
                    <p className="explanation">The interest you will earn.</p>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    1.5%
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-xl-3 col-lg-4 col-md-4 col-6">
                    <button className="confirm-button">Provide Liquidity</button>
                </div>
            </div>
        </form>
    </div>;
}