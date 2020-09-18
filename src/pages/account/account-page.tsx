import React, { ReactElement, MouseEvent } from "react";
import Page from "../page/page";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUserDataAction } from "../../common/actions/user.actions";
import InputError from "../../common/components/input-error/input-error";
import { AppState } from "../../common/types/util.types";
import { successToast } from "../../common/utils/toast";
import i18n from "i18next";

import "./account-page.scss";

type UserForm = {
    btcAddress: string;
    email: string;
    never: boolean;
    hour: boolean;
    day: boolean;
    threedays: boolean;
    confirmed: boolean;
}

export default function AccountPage (): ReactElement {
    const { btcAddress,email,account } = useSelector((state: AppState) => state.user);
    const { hour,day,threedays,confirmed } = useSelector((state: AppState) => state.user.notifications);
    const { register,handleSubmit,errors } = useForm<UserForm>({
        defaultValues: {
            btcAddress,
            email,
            hour,
            day,
            threedays,
            confirmed
        }
    });
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(({btcAddress,email,hour,day,threedays,confirmed}) => {
        dispatch(updateUserDataAction(btcAddress,email,hour,day,threedays,confirmed));
        successToast(i18n.t("account_updated"));
    });

    const checkNotification = (event: MouseEvent) => {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            (document.getElementsByName("never")[0] as HTMLInputElement).checked = false;
        }
    };

    const deselectAll = (event: MouseEvent) => {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked){
            (document.getElementsByName("hour")[0] as HTMLInputElement).checked = false;
            (document.getElementsByName("day")[0] as HTMLInputElement).checked = false;
            (document.getElementsByName("threedays")[0] as HTMLInputElement).checked = false;
            (document.getElementsByName("confirmed")[0] as HTMLInputElement).checked = false;
        }
    };

    return <Page>
        <div className="container-fluid">
            <div className="account-page">
                <div className="account-title">Your Account</div>
                <div className="account">{account}</div>
                <form onSubmit={onSubmit} className="user-data">
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5">Preferred BTC address</div>
                        <div className="col-xl-3 col-lg-4 col-md-5">
                            <input name="btcAddress" placeholder="Preferred BTC Address" type="text" 
                                ref={register({required: true, pattern: {
                                    value: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
                                    message: "Please enter valid BTC address"
                                }})} className={errors.btcAddress ? "error-borders" : ""}/>
                            <InputError inputName="btcAddress" errors={errors}></InputError>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5">Email (optional)</div>
                        <div className="col-xl-3 col-lg-4 col-md-5">
                            <input name="email" placeholder="Email" type="text" ref={register({pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Please enter valid email address"
                            }})} className={errors.email ? "error-borders" : ""}/>
                            <InputError inputName="email" errors={errors}></InputError>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5 col-sm-12 col-xs-12 notifications">
                            Notification preferences
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 col-xs-12">
                            <div className="check-input-field">
                                <input name="never" type="checkbox" ref={register} onClick={deselectAll}/>
                            </div>
                            <div className="check-input-field">
                                Never
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5"></div>
                        <div className="col-xl-3 col-lg-4 col-md-5">
                            <div className="check-input-field">
                                <input name="hour" type="checkbox" ref={register} onClick={checkNotification} />
                            </div>
                            <div className="check-input-field">
                                1 hour before expiry
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5"></div>
                        <div className="col-xl-3 col-lg-4 col-md-5">
                            <div className="check-input-field">
                                <input name="day" type="checkbox" ref={register} onClick={checkNotification} />
                            </div>
                            <div className="check-input-field">
                                1 day before expiry
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5"></div>
                        <div className="col-xl-3 col-lg-4 col-md-5">
                            <div className="check-input-field">
                                <input name="threedays" type="checkbox" ref={register} onClick={checkNotification} />
                            </div>
                            <div className="check-input-field">
                                3 days before expiry
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5"></div>
                        <div className="col-xl-3 col-lg-4 col-md-5">
                            <div className="check-input-field">
                                <input name="confirmed" type="checkbox" ref={register} onClick={checkNotification} />
                            </div>
                            <div className="check-input-field">
                                When BTC payment confirmed
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-xl-2 col-lg-3 col-md-5"></div>
                        <div className="col-xl-1 col-lg-2 col-md-3">
                            <button type="submit" className="confirm-button">
                                Save
                            </button>
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2"></div>
                    </div>
                </form>
            </div>
        </div>
    </Page>;
}
