import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../common/types/util.types";

type TablePropsType = {
    expiry: string
}

export default function OptionsTable(props: TablePropsType): ReactElement{
    const options = useSelector((state: AppState)=>state.options);
    const optionsToShow = options.filter((option) => option.expiry.toString() === props.expiry);

    return <div className="table-box">
        <div className="table-wrapper">
            <div className="title">
                BTC Options &nbsp;&nbsp;&nbsp; {new Date(Number(props.expiry)).toDateString().slice(4,15)}
            </div>
            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Strike Price</th>
                            <th>Liquidity</th>
                            <th>Last Price</th>
                            <th>Your Obligations</th>
                            <th>Your Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {optionsToShow.map((option,index) => {
                            return <tr key={index}>
                                <td>{option.strikePrice}</td>
                                <td>{Math.floor(Math.random() * 4)}</td>
                                <td>{Math.floor(Math.random() * 10000)}$</td>
                                <td>{Math.floor(Math.random() * 3)}</td>
                                <td>{Math.floor(Math.random() * 5)}</td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}
