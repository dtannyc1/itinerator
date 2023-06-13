import jwtFetch from "./jwt";

const RECEIVE_ITINERARIES = "itineraries/RECEIVE_ITINERARIES";
const RECEIVE_ITINERARY = "itineraries/RECEIVE_ITINERARY";

const receiveItineraries = (itineraries) => {
    return {
        type: RECEIVE_ITINERARIES,
        itineraries: itineraries
    }
};

const receiveItinerary = (itinerary) => {
    return {
        type: RECEIVE_ITINERARY,
        itinerary: itinerary
    }
}

// ============================= fetch requests =============================

export const fetchItineraries = () => async dispatch  => {
    const response = await jwtFetch('/api/itineraries/');
    const data = await response.json();

    dispatch(receiveItineraries(data));
};

export const fetchItinerary = (itineraryId) => async dispatch => {
    const response = await jwtFetch(`/api/itineraries/${itineraryId}`);
    const data = await response.json();
    
    dispatch(receiveItinerary(data));
};

// ============================= get requests for frontEnd =============================

export const getItinerary = (itineraryId) => (store) => {
    if(store.itineraries[itineraryId]) {
        return store.itineraries[itineraryId];
    } else {
        return {};
    }
};

// ============================= itineraries reducer =============================

const itinerariesReducer = (state = {}, action) => {
    Object.freeze(state);

    const nextState = {...state};
    switch (action.type) {
        case RECEIVE_ITINERARIES:
            return {...state, ...action.itineraries}
        case RECEIVE_ITINERARY:
            nextState[action.itinerary._id] = action.itinerary;
            return nextState;
        default:
            return state;
    };
};

export default itinerariesReducer;