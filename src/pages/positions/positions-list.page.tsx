import { Currency, ERC20, Position } from "@interlay/xopts";
import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPositionsAction } from "../../common/actions/user.actions";
import { AppState } from "../../common/types/util.types";
import Page from "../page/page";
import globals from "../../common/globals";

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
    const libLoaded = useSelector((state: AppState) => state.lib.isROConnected);
    const positions = useSelector((state: AppState) => state.positions);
    const userAccount = useSelector((state: AppState) => state.user.account);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!libLoaded || !userAccount) return;
        const postionsActions = globals.xopts.positions;
        if (!postionsActions) return;

        const fetchPositions = async () => {
            const positions = await postionsActions.list(userAccount);
            dispatch(addPositionsAction(positions));
        };
        fetchPositions();
    }, [dispatch, libLoaded, userAccount]);

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
