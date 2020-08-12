import { UpdateIsUserConnected, UpdateUserNetwork, AddPositions, 
    UPDATE_IS_USER_CONNECTED, UPDATE_USER_NETWORK, ADD_POSITIONS } from "../types/actions.types";
import { Position } from "../types/util.types";

export const updateIsUserConnectedAction = (isConnected: boolean): UpdateIsUserConnected => ({
    type: UPDATE_IS_USER_CONNECTED,
    isConnected
});

export const updateUserNetworkAction = (network: string): UpdateUserNetwork => ({
    type: UPDATE_USER_NETWORK,
    network
});

export const addPositionsAction = (positions: Position[]): AddPositions => ({
    type: ADD_POSITIONS,
    positions
});