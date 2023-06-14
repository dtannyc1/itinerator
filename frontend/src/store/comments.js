import jwtFetch from "./jwt";
import { receiveItinerary } from './itineraries.js';

// thunk action creators
export const createComment = (itineraryId, body) => async dispatch => {
    jwtFetch(`/api/itineraries/${itineraryId}/comments`, {
        method: 'POST',
        body: JSON.stringify({body})
    }).then(res => res.json()).then(data => {
        dispatch(receiveItinerary(data));
    })
}

export const updateComment = (itineraryId, commentId, body) => async dispatch => {
    jwtFetch(`/api/itineraries/${itineraryId}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({body})
    }).then(res => res.json()).then(data => {
        dispatch(receiveItinerary(data));
    })
}

export const deleteComment = (itineraryId, commentId) => async dispatch => {
    jwtFetch(`/api/itineraries/${itineraryId}/comments/${commentId}`, {
        method: 'DELETE'
    }).then(res => res.json()).then(data => {
        dispatch(receiveItinerary(data));
    })
}

// no reducer, itineraries reducer should handle it
