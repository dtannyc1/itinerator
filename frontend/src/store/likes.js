import jwtFetch from "./jwt";
import { receiveItinerary } from './itineraries.js';

// thunk action creators
export const createLike = (itineraryId) => async dispatch => {
    jwtFetch(`/api/itineraries/${itineraryId}/likes`, {
        method: 'POST'
    }).then(res => res.json()).then(data => {
        dispatch(receiveItinerary(data));
    }).catch(err => console.log(err))
}

export const deleteLike = (itineraryId) => async dispatch => {
    jwtFetch(`/api/itineraries/${itineraryId}/likes`, {
        method: 'DELETE'
    }).then(res => res.json()).then(data => {
        dispatch(receiveItinerary(data));
    }).catch(err => console.log(err))
}

// no reducer, itineraries reducer should handle it
