import React, { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "../../../common/utils/toast";
import i18n from "i18next";

import "./withdraw-tab.scss";

import ConfirmationModal from "../../../common/components/confirmation-modal/confirmation-modal";
import { useDispatch } from "react-redux";
import { toggleModalAction } from "../../../common/actions/ui.actions";

type WithdrawFundsForm = {
    availableFunds: number;
};

type WithdrawRequestForm = {
    requestedFunds: number;
};

export default function WithdrawTab(): ReactElement {
    const [availableFunds,setAvailableFunds] = useState(0);
    const dispatch = useDispatch();
    const {register,handleSubmit: submitWithdraw} = useForm<WithdrawFundsForm>();
    const {register: register2,handleSubmit: submitRequest,getValues} = useForm<WithdrawRequestForm>();

    const onChange = (type: string) => {
        setAvailableFunds(getValues(type));
    };

    const submitWithdrawForm = submitWithdraw(()=> {
        dispatch(toggleModalAction("withdraw-modal",true));
    });

    const onConfirmWithdraw = () => {
        // TO DO WITHDRAW MONEY
        successToast(i18n.t("funds_withdrawn"));
    };

    const submitRequestForm = submitRequest(() => {
        dispatch(toggleModalAction("request-withdraw-modal",true));
    });

    const onConfirmRequest = () => {
        // TO DO REQUEST WITHDRAWAL
        successToast(i18n.t("withdraw_requested"));
    };

    return <div className="withdraw-tab">
        <ConfirmationModal 
            modalId="confirm-withdraw"
            modalName="withdraw-modal"
            modalTitle="Withdraw funds"
            modalQuestion="Are you sure you want to withdraw funds?"
            onConfirm={onConfirmWithdraw}
        ></ConfirmationModal>
        <ConfirmationModal 
            modalId="request-withdraw"
            modalName="request-withdraw-modal"
            modalTitle="Request Withdrawal"
            modalQuestion="Are you sure you want to request the withdrawal of your funds?"
            onConfirm={onConfirmRequest}
        ></ConfirmationModal>
        <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                <p className="label">Available for withdraw</p>
                <p className="explanation">
                    The amount of liquidity you can withdraw instantly (not currently used in XOpts)
                </p>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                <span className="total-funds">9,500 USDT</span>
            </div>
        </div>
        <form onSubmit={submitWithdrawForm}>
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-3 col-5">
                    <div className="input-group">
                        <input type="number" className="form-control custom-input" aria-describedby="basic-addon2" 
                            name="availableFunds" ref={register({required: true})} 
                            onChange={()=>{onChange("availableFunds");}} />
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">USDT</span>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    <button className="confirm-button" type="submit">
                        Withdraw &nbsp;&nbsp;{availableFunds>0 ? availableFunds + " USDT" : ""}
                    </button>
                </div>
            </div>
        </form>
        <div className="row justify-content-center curenlty-locked">
            <div className="col-xl-5 col-lg-7 col-md-5 col-12">
                <p className="label">Currenlty Locked</p>
                <p className="explanation">
                    The amount of liquidity currently locked in XOpts. To withdraw currently used funds: Request to 
                    withdraw your fund and they will be allocated to your withdrawable balance once available. For 
                    withdraw dates, please see below:
                </p>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                <p className="label">20,900 USDT</p>
                <p className="explanation">
                    11,9000 USDT pending withdrawal
                </p>
            </div>
        </div>
        <div className="row justify-content-center locked ammounts ">
            <div className="col-xl-5 col-lg-4">
                <table>
                    <thead>
                        <tr><td>Date</td><td>Amount</td></tr>
                    </thead>
                    <tbody>
                        <tr><td>30 Nov 2020</td><td>8900 USDT</td></tr>
                        <tr><td>5 Dec 2020</td><td>3000 USDT</td></tr>
                    </tbody>
                </table>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-5 col-12">
            </div>
        </div>
        <form onSubmit={submitRequestForm}>
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-7 col-md-3 col-5">
                    <div className="input-group">
                        <input type="number" className="form-control custom-input" name="requestedFunds" 
                            aria-describedby="basic-addon2" ref={register2({required: true})} />
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">USDT</span>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-12">
                    <button className="confirm-button" type="submit">
                        Request Withdrawal
                    </button>
                </div>
            </div>
        </form>
    </div>;
}