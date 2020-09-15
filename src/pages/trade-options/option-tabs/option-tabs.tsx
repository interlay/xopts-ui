import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../../common/types/util.types";
import { Link } from "react-router-dom";
import { changeSelectedPageAction } from "../../../common/actions/ui.actions";
import { filterUniqueOptions } from "../../../common/utils/utils";
import { useParams } from "react-router";

import "./option-tabs.scss";

export default function OptionTabs():ReactElement {
    const dispatch = useDispatch();
    const options = useSelector((state: AppState) => state.options);
    const uniqueOptions = filterUniqueOptions(options);
    const selectedPage = useSelector((state: AppState) => state.ui.selectedPage);
    const {currency} = useParams();

    const openPage = (expiry: string) => {
        return () => {
            dispatch(changeSelectedPageAction(expiry));
        };
    };

    return <div className="option-tabs">
        <div className="option-tabs-wrapper">
            <div className="row">
                <div className={"option-tab col " + ( selectedPage === "all-expirations" ? " selected-item" : "")}>
                    <Link to={"/trade-options/" + currency}
                        onClick={openPage("all-expirations")}>
                    All Dates
                    </Link>
                </div>
                {uniqueOptions.map((option, index) => {
                    return <div key={index} className={"option-tab col " + 
                        (selectedPage === option.expiry.toString() ? "selected-item" : "")}>
                        <Link to={"/trade-options/" + currency}
                            className={selectedPage === option.expiry.toString() ? "selected-item" : ""} 
                            onClick={openPage(option.expiry.toString())}>
                            { new Date(option.expiry).toDateString().slice(4,15) }
                        </Link>
                    </div>;
                })
                }
            </div>
        </div>
    </div>;
}