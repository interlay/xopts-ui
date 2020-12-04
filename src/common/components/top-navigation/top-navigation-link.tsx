import React, { ReactNode } from "react";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

export type TopNavigationLinkProps = {
    to: string;
    pageName: string;
    selectedPage: string;
    isFirst?: boolean;
    children: ReactNode;
    openPage: (pageName: string, isOption?: boolean) => () => void;
};

export default function TopNavigationLink(
    props: TopNavigationLinkProps
): ReactElement {
    return (
        <Link
            className={classNames(
                "nav-item",
                { first: props.isFirst },
                { "selected-item": props.pageName === props.selectedPage }
            )}
            to={props.to}
            onClick={props.openPage(props.pageName)}
        >
            {props.children}
        </Link>
    );
}
