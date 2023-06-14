import jwtFetch from "./jwt";

const RECEIVE_ITINERARIES = "itineraries/RECEIVE_ITINERARIES";
const RECEIVE_ITINERARY = "itineraries/RECEIVE_ITINERARY";

export const receiveItineraries = (itineraries) => {
    return {
        type: RECEIVE_ITINERARIES,
        itineraries: itineraries
    }
};

export const receiveItinerary = (itinerary) => {
    return {
        type: RECEIVE_ITINERARY,
        itinerary: itinerary
    }
}

// ============================= fetch requests =============================

export const fetchItineraries = () => async dispatch => {
    const response = await jwtFetch('/api/itineraries/');
    const data = await response.json();

    dispatch(receiveItineraries(data));
};

export const fetchItinerary = (itineraryId) => async dispatch => {
    const response = await jwtFetch(`/api/itineraries/${itineraryId}`);
    const data = await response.json();

    dispatch(receiveItinerary(data));
};

export const createItinerary = (itinerary) => async (dispatch) => {
    const response = await jwtFetch('/api/itineraries/', {
        method: 'POST',
        body: JSON.stringify(itinerary)
    });

    const data = await response.json();
    dispatch(receiveItinerary(data));
    return data;
};



// ============================= get requests for frontEnd =============================

export const getItineraries = (store) => {
    if (store.itineraries) {
        return Object.values(store.itineraries);
    } else {
        return [];
    };
};

export const getItinerary = (itineraryId) => (store) => {
    if (store.itineraries[itineraryId]) {
        return store.itineraries[itineraryId];
    } else {
        return {};
    };
};

// ============================= itineraries reducer =============================

const itinerariesReducer = (state = {}, action) => {
    Object.freeze(state);

    let nextState = { ...state };
    switch (action.type) {
        case RECEIVE_ITINERARIES:
            return { ...nextState, ...action.itineraries }
        case RECEIVE_ITINERARY:
            nextState[action.itinerary._id] = action.itinerary;
            return nextState;
        default:
            return state;
    };
};

export default itinerariesReducer;
