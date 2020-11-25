import { Option } from "../../common/types/util.types";
import { Currency, ERC20 } from "@interlay/xopts";

export const filterUniqueOptions = (
    options: Option<Currency, ERC20>[]
): Option<Currency, ERC20>[] => {
    const uniqueOpts: Option<Currency, ERC20>[] = [];
    options.forEach((option) => {
        let isUnique = true;
        uniqueOpts.forEach((unique) => {
            if (unique.expiry === option.expiry) {
                isUnique = false;
            }
        });
        if (isUnique) {
            uniqueOpts.push(option);
        }
    });
    return uniqueOpts;
};

export const findObjByProperty = <T, K extends keyof T, P extends T[K]>(
    array: T[],
    value: P,
    property: K
): T | null => {
    let result = null;
    array.forEach((element) => {
        if (element[property] === value) {
            result = element;
        }
    });
    return result;
};
