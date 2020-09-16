import { UpdateIsUserConnected, UpdateUserNetwork, AddPositions, UpdateUserData, UpdateUserNotifications,
    UPDATE_IS_USER_CONNECTED, UPDATE_USER_NETWORK, ADD_POSITIONS, UPDATE_USER_DATA, UPDATE_USER_NOTIFICATIONS } from "../types/actions.types";
import { Position } from "../types/util.types";

export const updateIsUserConnectedAction = (isConnected: boolean, account?: string): UpdateIsUserConnected => ({
    type: UPDATE_IS_USER_CONNECTED,
    isConnected,
    account
});

export const updateUserNetworkAction = (network: string): UpdateUserNetwork => ({
    type: UPDATE_USER_NETWORK,
    network
});

export const addPositionsAction = (positions: Position[]): AddPositions => ({
    type: ADD_POSITIONS,
    positions
});

export const updateUserDataAction = (btcAddress: string, email: string, hour: boolean, day: boolean, 
    threedays: boolean, week: boolean, confirmed: boolean): UpdateUserData => ({
    type: UPDATE_USER_DATA,
    btcAddress,
    email,
    hour,
    day,
    threedays,
    week,
    confirmed
});

export const updateUserNotificationsAction = (hour: boolean, day: boolean, 
    threedays: boolean, week: boolean, confirmed: boolean): UpdateUserNotifications => ({
    type: UPDATE_USER_NOTIFICATIONS,
    hour,
    day,
    threedays,
    week,
    confirmed
});