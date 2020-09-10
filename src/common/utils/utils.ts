import { Option } from "../types/util.types";

export const filterUniqueOptions = (options: Option[]): Option[] => {
    const uniqueOpts: Option[] = [];
    options.forEach((option)=>{
        let isUnique = true;
        uniqueOpts.forEach((unique)=>{
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

export const findObjByProperty = (array: any[], value: any, property: string): any => {
    var result = null;
    array.forEach((element)=>{
        if (element[property] === value){
            result = element;
        }
    })
    return result;
}
