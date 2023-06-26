import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import './UserItineraries.css'
import { useEffect } from "react";
import { fetchUserItineraries } from "../../store/userItineraries";
import { getItineraries } from "../../store/itineraries";
import UserItinerariesItem from "./UserItinerariesItem";

const UserItineraries = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserItineraries(userId));
    }, [dispatch]);

    const userItineraries = useSelector(getItineraries);

    return (
        <div className="user-itineraries-box">
            {userItineraries.map((itinerary => {
                return <UserItinerariesItem itinerary={itinerary} />
            }))}
        </div>
    )
}

export default UserItineraries;