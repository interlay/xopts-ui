import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Store } from "../../common/types/util";
import { Link } from "react-router-dom";

export default function LandingPage(): ReactElement {
    const options: any = useSelector((store: Store) => store.options);
    return (
        <div>
            <div>Landing page</div>
            <Link to="/help">Go to help</Link>
        </div>
    );
}