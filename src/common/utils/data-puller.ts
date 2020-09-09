import { StoreState } from "../types/util.types";
import { fetchPrices } from "../api/prices.api";

export const startDataPuller = async (store: StoreState) => {
    fetchPrices(store).then(()=>{
        setInterval(()=>fetchPrices(store),10000);
    })
}