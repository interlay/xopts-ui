import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../common/types/util.types";

import "./trade-modal.scss";

type TradeModalProps = {
    currency: string;
}

export default function TradeModal (props: TradeModalProps): ReactElement {
    const clickedOption = useSelector((state: AppState) => state.ui.clickedOption);

    return  <React.Fragment>
        <div className="modal fade in" id="trade-modal" role="dialog" aria-labelledby="exampleModalCenterTitle" 
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                            {props.currency.toUpperCase()} 
                            {new Date(Number(clickedOption && clickedOption.expiry)).toDateString().slice(4,15)}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn buy-button" data-dismiss="modal">Buy</button>
                        <button type="button" className="btn sell-button" data-dismiss="modal">Sell</button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>;
}