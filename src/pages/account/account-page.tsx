import React, { ReactElement } from "react";
import Page from "../page/page";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUserDataAction } from "../../common/actions/user.actions";
import InputError from "../../common/components/input-error/input-error";

import "./account-page.scss";
import { AppState } from "../../common/types/util.types";

type UserForm = {
    btcAddress: string;
    email: string;
}

export default function AccountPage (): ReactElement {
    const btcAddress = useSelector((state: AppState) => state.user.btcAddress);
    const email = useSelector((state: AppState)=> state.user.email);
    const {register,handleSubmit,errors} = useForm<UserForm>({
        defaultValues: {
            btcAddress,
            email
        }
    });
    const dispatch = useDispatch();

    const onSubmit = handleSubmit((data: UserForm) => {
        dispatch(updateUserDataAction(data.btcAddress,data.email));
    });

    return <Page>
        <div className="account-page container-fluid">
            <form onSubmit={onSubmit} className="user-data">
                <div className="row">
                    <div className="col-xl-3">
                        <input name="btcAddress" placeholder="BTC Address" type="text" 
                            ref={register({required: true})} className={errors.btcAddress ? "error-borders" : ""}/>
                        <InputError inputName="btcAddress" errors={errors}></InputError>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-3">
                        <input name="email" placeholder="Email" type="text" ref={register} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-1">
                        <button type="submit" className="confirm-button">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </Page>;
}
