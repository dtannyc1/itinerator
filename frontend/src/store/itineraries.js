import jwtFetch from "./jwt";

const RECEIVE_ITINERARIES = "itineraries/RECEIVE_ITINERARIES";
const RECEIVE_ITINERARY = "itineraries/RECEIVE_ITINERARY";
const REMOVE_ITINERARY = "itineraries/REMOVE_ITINERARY";
const RECEIVE_ACTIVITY = "itineraries/RECEIVE_ACTIVITY";
const REMOVE_ACTIVITY = "itineraries/REMOVE_ACTIVITY";

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

export const removeItinerary = () => {
    return {
        type: REMOVE_ITINERARY,
    }
}

export const addActivity = (activity) => {
    return {
        type: RECEIVE_ACTIVITY,
        activity: activity
    }
}
export const removeActivity = (activityId) => {
    return {
        type: REMOVE_ACTIVITY,
        activityId: activityId
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

export const createItinerary = (itinerary) => async dispatch => {
    const response = await jwtFetch('/api/itineraries/', {
        method: 'POST',
        body: JSON.stringify(itinerary)
    });

    const data = await response.json();
    dispatch(receiveItinerary(data));
    return data;
};

export const updateItinerary = (itineraryId, itinerary) => async dispatch => {
    try {
        const response = await jwtFetch(`/api/itineraries/${itineraryId}`, {
            method: 'PATCH',
            body: JSON.stringify(itinerary)
        });
        const data = await response.json()
        dispatch(receiveItinerary(data));
    } catch (err) {
        console.log(err);
    }
};

export const deleteItinerary = (itineraryId) => async dispatch => {
    try {
        await jwtFetch(`/api/itineraries/${itineraryId}`, {
            method: 'DELETE'
        });
        dispatch(removeItinerary());
    } catch (err) {
        console.log(err);
    }
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
        return null;
    };
};

// ============================= itineraries reducer =============================

const itinerariesReducer = (state = {}, action) => {
    Object.freeze(state);

    let nextState = { ...state };
    let itineraryId;
    let updatedActivities;
    let updatedItinerary;
    switch (action.type) {
        case RECEIVE_ITINERARIES:
            return { ...nextState, ...action.itineraries }
        case RECEIVE_ITINERARY:
            nextState[action.itinerary._id] = action.itinerary;
            return nextState;
        case REMOVE_ITINERARY:
            return {}
        case RECEIVE_ACTIVITY:
            itineraryId = Object.keys(nextState)[0]; // assuming only one itinerary
            updatedActivities = [
                ...nextState[itineraryId].activities,
                action.activity,
            ];
            updatedItinerary = {
                ...nextState[itineraryId],
                activities: updatedActivities,
            };
            return { ...nextState, [itineraryId]: updatedItinerary };
        case REMOVE_ACTIVITY:
            itineraryId = Object.keys(nextState)[0]; // assuming only one itinerary
            updatedActivities = nextState[itineraryId].activities.filter(
                (activity) => activity._id !== action.activityId
            );
            updatedItinerary = {
                ...nextState[itineraryId],
                activities: updatedActivities,
            };
            return { ...nextState, [itineraryId]: updatedItinerary };
        default:
            return state;
    };
};

export default itinerariesReducer;
