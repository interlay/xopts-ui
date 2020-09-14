import React from "react";
import { DeepMap, FieldError } from "react-hook-form";

import "./input-error.scss";

type InputErrorProps = {
    inputName: string;
    errors: DeepMap<any, FieldError>
    customMessage?: string;
}

export default function InputError(props: InputErrorProps) {
    
    if(!props.errors[props.inputName]) {
        return null;
    }

    const getMessage = (type: string):string => {
        switch(type) {
        case "required":
            return "This field is required";
        case "maxLength":
            return "Exceed maximum input length";
        }
        return "";
    };

    return <div className="input-error">
        {props.customMessage || getMessage(props.errors[props.inputName].type)}
    </div>;
}