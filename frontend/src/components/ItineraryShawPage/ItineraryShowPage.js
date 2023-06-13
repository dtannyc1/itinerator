import './ItineraryShowPage.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchItinerary, getItinerary } from '../../store/itineraries';
import ActivityItem from './ActivityItem';

const ItineraryShowPage = () => {
    const { itineraryId } = useParams();
    const dispatch = useDispatch();
    const itinerary = useSelector(getItinerary(itineraryId));

    useEffect(() => {
        dispatch(fetchItinerary(itineraryId));
    }, [dispatch])


    if(!itinerary.activities) return <></> // maybe change this line in future for more robust
    return (
        <div className="flex-row-wrap">
            <div className="itinerary-show-map">

            </div>
            <div className="itinerary-show-details">

                {itinerary.activities.map((activity) => {
                    return <ActivityItem activity={activity} key={activity._id} />
                })}

            </div>
        </div>
    )
}

export default ItineraryShowPage;