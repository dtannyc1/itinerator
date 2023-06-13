import './ItineraryShowPage.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchItinerary, getItinerary } from '../../store/itineraries';

const ItineraryShowPage = () => {
    const { itineraryId } = useParams();
    const dispatch = useDispatch();
    const itinerary = useSelector(getItinerary(itineraryId));

    useEffect(() => {
        dispatch(fetchItinerary(itineraryId));
    }, [dispatch])

    return (
        <div className="flex-row-wrap">
            <div className="google-map-reserve">

            </div>
            <div className="options">
                
            </div>
        </div>
    )
}

export default ItineraryShowPage;