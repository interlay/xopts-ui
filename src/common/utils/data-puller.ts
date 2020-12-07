import { StoreState } from "../types/util.types";
import { fetchPrices } from "../api/prices.api";

export default async function startDataPuller(
    store: StoreState
): Promise<void> {
    fetchPrices(store).then(() => {
        setInterval(() => fetchPrices(store), 100000);
    });
}

