import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, Position } from "../../common/types/util.types";

import { Currency, ERC20, MonetaryAmount } from "@interlay/xopts";
import Page from "../page/page";
import { addPositionsAction } from "../../common/actions/user.actions";

type PositionRowProps = {
    key: number;
    position: Position<Currency, ERC20>;
};

function PositionRow(props: PositionRowProps): ReactElement {
    const { position } = props;
    const { option } = position;
    return (
        <tr key={props.key}>
            <td>{option.expiry.toDateString()}</td>
            {/* TODO: add toHuman to exchangeRate */}
            <td>{option.strikePrice.rate.toString()}</td>
            <td>{position.writtenAmount.toString()}</td>
            <td>{position.boughtAmount.toString()}</td>
            <td>
                {position.writtenAmount.sub(position.boughtAmount).toString()}
            </td>
        </tr>
    );
}

export default function PositionsList(): ReactElement {
    const libLoaded = useSelector((state: AppState) => state.lib.isLoaded);
    const positions = useSelector((state: AppState) => state.positions);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!libLoaded) return;

        const fetchPositions = async () => {
            const options = await window.xopts.options.list();
            // TODO: add logic to fetch positions in the library
            const positions = options.map((option) => {
                return {
                    writtenAmount: new MonetaryAmount(option.underlying, 10),
                    boughtAmount: new MonetaryAmount(option.underlying, 20),
                    option,
                };
            });
            dispatch(addPositionsAction(positions));
        };
        fetchPositions();
    }, [dispatch, libLoaded]);

    return (
        <Page>
            <main className="positions-list container">
                <div className="row">
                    <div className="col">
                        <h3>Positions</h3>
                    </div>
                </div>

                <section className="positions">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Expiry date</th>
                                <th>Strike price</th>
                                <th>Written amount</th>
                                <th>Bought amount</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions &&
                                positions.map((position, key) => {
                                    return PositionRow({ position, key });
                                })}
                        </tbody>
                    </table>
                </section>
            </main>
        </Page>
    );
}
