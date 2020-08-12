import React, { ReactElement } from "react";

type PageProps = {
    children: ReactElement
}

export default function Page (props: PageProps): ReactElement {
    return <div className="page">
        <div>
            {props.children}
        </div>
    </div>;
}