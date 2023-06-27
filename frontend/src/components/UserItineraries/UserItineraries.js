import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import './UserItineraries.css'
import { useEffect } from "react";
import { fetchUserItineraries } from "../../store/userItineraries";
import { getItineraries } from "../../store/itineraries";
import UserItinerariesItem from "./UserItinerariesItem";
import { selectCurrentUser } from "../../store/session";
import jwtFetch from "../../store/jwt";

const UserItineraries = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    
    const currentUser = useSelector(selectCurrentUser);

    const fetchOwner = async (id) => {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        return data;
    };

    const username = (userId) => {
        const owner = fetchOwner(userId);
        console.log(owner)
        return owner
    }
    // console.log(fetchOwner(userId).then((user) => user.username ))

    useEffect(() => {
        dispatch(fetchUserItineraries(userId));
    }, [dispatch]);

    const userItineraries = useSelector(getItineraries);

    const greetings = () => {
        if (currentUser._id === userId) {
            return (<div className="user-itineraries-header">My Itineraries</div>)
        } else {
            return (<div className="user-itineraries-header">Itineraries</div>)
        }
    }

    return (
        <>
            <div className="user-itineraries-box">
                {greetings()}
                {userItineraries.map((itinerary => {
                    return <UserItinerariesItem key={itinerary._id} itinerary={itinerary} />
                }))}
            </div>
        </>
    )
}

export default UserItineraries;