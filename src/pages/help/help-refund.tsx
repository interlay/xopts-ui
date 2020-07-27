import React, { ReactElement } from "react";
import refundImage from "../../assets/img/process/refund.png";

export default function HelpRefund(): ReactElement {
    return (
        <div className="col-xl-8 offset-xl-2 text-justify border-top" id="refund-help">
            <div>
                <div>
                    <h2 className="mt-5">How to Refund an Expired Option</h2>
                    <p>
                        When an option is expired, the seller can refund the locked DAI.
                        Follow this process to get a refund on your expired optios.
                    </p>
                </div>
                <div>
                    <   img src={refundImage} className="img-fluid" alt="refund-process"/>
                </div>
            </div>
            <div className="mt-2">
                <div>
                    <h6>1: Select Your Option</h6>
                    <p>
                        In the "Positions" page, you will see your sold options.
                        Expired options will have a "Refund" button next to them.
                        Click this button to start the refund process.
                    </p>
                </div>
                <div>
                    <h6>2: Refund your DAI</h6>
                    <p>
                        The second and final step will ask you to send a transaction to the XOpts smart contracts.
                        This transaction will refund you the entire amount of DAI you have locked for that particular 
                        option. Your other underwritten options are not affected by this refund!
                    </p>
                </div>
            </div>
        </div>
    );
}
