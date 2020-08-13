import React, { ReactElement } from "react";
import buyImage from "../../assets/img/process/buy.png";

export default function HelpBuy(): ReactElement {
    return (
        <div className="col-xl-8 offset-xl-2 text-justify border-top" id="buy-help">
            <div className="row">
                <div>
                    <h2 className="mt-5">How to Buy an Option</h2>
                    <p>
                        Follow this process to buy an option that allows you to exchange BTC against a Dai at a 
                        predefined price. Options differ in their expiry time, i.e. until when the option is valid, 
                        the premium, i.e. the fee you pay, and the strike price, i.e. how much DAI you will receive 
                        based on the amount of BTC you insure when you exercise the option. In our step-by-step guide 
                        below you will act as Alice while Bob is the seller of the option.
                    </p>
                </div>
                <div>
                    <img src={buyImage} className="img-fluid" alt="buy-process"/>
                </div>
            </div>
            <div className="row mt-2">
                <div>
                    <h6>1: Select Your Option</h6>
                    <p>
                        First, select an option that suits your needs.
                        You can click "buy" right next to the option that you prefer.
                        This will open the buy wizard to guide you through the process.
                    </p>
                </div>
                <div>
                    <h6>2: Select Your Seller</h6>
                    <p>
                        The second step of buying an option is to select a seller. Right now, the selection of a 
                        seller maps the bought option to the BTC address of a seller. This will become important 
                        when you want to exercise the option.
                    </p>
                </div>
                <div>
                    <h6>3: Select Your Amount</h6>
                    <p>
                        The third step of buying an option is to state how much BTC you want to insure.
                        Your premium will be calculated based on the BTC amount you have selected.
                    </p>
                </div>
                <div>
                    <h6>4: Confirm Your Options</h6>
                    <p>
                        The last step executes the purchase by interacting with the XOpts smart contracts. If this is 
                        your first time interacting with XOpts you might asked to approve an amount of your DAI in the 
                        XOpts smart contracts. In this case, you will be asked to confirm two transactions: (a) the 
                        approval transaction and (b) the purchase transaction. The purchase transaction will transfer 
                        the required premium for your purchase in DAI to the seller of the option. In return you will 
                        receive an XOpts token that represent your options.
                    </p>
                </div>
            </div>
        </div>
    );
}
