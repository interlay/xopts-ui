import React, { ReactElement, useState } from "react";
import Page from "../page/page";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUserDataAction } from "../../common/actions/user.actions";
import InputError from "../../common/components/input-error/input-error";

import "./account-page.scss";

type UserForm = {
    btcAddress: string;
    email: string;
}

export default function AccountPage (): ReactElement {
    const [isEditMode,setIsEditMode] = useState(false);
    const {register,handleSubmit,errors} = useForm<UserForm>();
    const dispatch = useDispatch();

    const onSubmit = handleSubmit((data: UserForm) => {
        dispatch(updateUserDataAction(data.btcAddress,data.email));
    });

    return <Page>
        <div className="account-page container-fluid">
            {!isEditMode ? <div className="user-data">
                <div className="row">
                    <div className="col-xl-2">BTC Address:</div>
                    <div className="col-xl-2">Ox3489247203480293diosf23dsiof20</div>
                </div>
                <div className="row">
                    <div className="col-xl-2">Email:</div>
                    <div className="col-xl-2">eing.filip@gmali.com</div>
                </div>
                <div className="row">
                    <div className="col-xl-1">
                        <button className="confirm-button" onClick={()=>setIsEditMode(!isEditMode)}>
                            Edit
                        </button>
                    </div>
                </div>
            </div>
                :
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
                            <button className="cancel-button" onClick={()=>setIsEditMode(!isEditMode)}>
                            Cancel
                            </button>
                        </div>
                        <div className="col-xl-1">
                            <button type="submit" className="confirm-button">
                            Save
                            </button>
                        </div>
                    </div>
                </form>}
        </div>
    </Page>;
}
