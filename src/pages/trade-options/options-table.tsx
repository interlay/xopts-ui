import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../common/types/util.types";
import { useParams } from "react-router";

type TablePropsType = {
    expiry: string
}

export default function OptionsTable(props: TablePropsType): ReactElement{
    const options = useSelector((state: AppState)=>state.options);
    const optionsToShow = options.filter((option) => option.expiry.toString() === props.expiry);
    const { currency } = useParams();

    const calculateExpiry = () => {
        const period = optionsToShow[0].expiry - Date.now();
        const days = Math.floor(period/(1000*60*60*24));
        const hours = Math.floor(period/(1000*60*60) - days*24);
        const minutes = Math.floor(period/(1000*60) - (days*24*60 + hours*60));
        return days + " days " + hours + " hours " + minutes + " minutes";
    };

    return <div className="table-box">
        <div className="table-wrapper">
            <div className="title">
                Options &nbsp;&nbsp;&nbsp; {new Date(Number(props.expiry)).toDateString().slice(4,15)}
            </div>
            <div className="data-table">
                <div className="row justify-content-right">
                    <div className="col-xl-6 option-type">Puts</div>
                    <div className="col-xl-6 expires-in">Expires in {calculateExpiry()}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Liquidity</th>
                            <th>Last Price</th>
                            <th>Your Obligations ({currency.toUpperCase()})</th>
                            <th>Your Options ({currency.toUpperCase()})</th>
                            <th>Strike Price</th>

                        </tr>
                    </thead>
                    <tbody>
                        {optionsToShow.map((option,index) => {
                            return <tr key={index}>
                                <td>{Math.floor(Math.random() * 4)}</td>
                                <td>{Math.floor(Math.random() * 10000)}$</td>
                                <td>{Math.floor(Math.random() * 3)/100}</td>
                                <td>{Math.floor(Math.random() * 5)/100}</td>
                                <td className="highlight-col">{option.strikePrice}</td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}
