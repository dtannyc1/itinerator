import jwtFetch from "./jwt";

const RECEIVE_ITINERARIES = "itineraries/RECEIVE_ITINERARIES";

const receiveItineraries = (itineraries) => {
    return {
        type: RECEIVE_ITINERARIES,
        itineraries: itineraries
    }
};

// ============================= fetch requests =============================

export const fetchItineraries = () => async dispatch  => {
    const response = await jwtFetch('/api/itineraries/');
    const data = await response.json();

    dispatch(receiveItineraries(data));
};

// ============================= itineraries reducer =============================

const itinerariesReducer = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_ITINERARIES:
            return {...state, ...action.itineraries}
        default:
            return state;
    };
};

export default itinerariesReducer;