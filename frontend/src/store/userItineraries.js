import { receiveUserItineraries } from "./itineraries";
import jwtFetch from "./jwt"

// ============================= get requests for frontEnd =============================

export const fetchUserItineraries = (userId) => async dispatch => {
    const res = await jwtFetch(`/api/itineraries/users/${userId}`);
    const data = await res.json();

    dispatch(receiveUserItineraries(data));
};