import { Link } from "react-router-dom";
import { formatDate } from "../MainPage/MainPageItineraryItem";

const UserItinerariesItem = ({itinerary}) => {
    const { _id, title, likes, activities, comments, createdAt } = itinerary;

    const activitiesCount = () => {
        if (activities.length < 4) {
          return (
            <>
              {activities.map((ele, index) => (
                <span key={ele.name}>
                    &nbsp;
                    <i className="fa-solid fa-location-dot"></i> 
                    &nbsp;
                    {ele.name}
                    {index !== activities.length - 1 && ","}
                </span>
              ))}
            </>
          );
        } else {
          return (
            <>
              {activities.slice(0, 3).map((ele, index) => (
                <span key={ele.name}>
                    &nbsp;
                    <i className="fa-solid fa-location-dot"></i> {ele.name}
                    {index !== activities.slice(0, 3).length - 1 && ","}
                </span>
              ))} 
              {', and more...'}
            </>
          );
        }
    };

    return (
        <Link className='user-itinerary-link' to={`/itineraries/${_id}`}>
            <div className="itineraries-item-holder">
                <img src={activities[0].photoURLs[0]} className="user-itinerary-item-img"/>
                <div className="itineraries-details-holder">

                    <div className="itineraries-details-name">{ title }</div>

                    <div className="itineraries-details-activities">{activitiesCount()}</div>

                    <div className="itineraries-details-date">Created on { formatDate(createdAt) }</div>

                    <div className="itineraries-details-icons">
                        <div className="user-comments-holder">
                            <i className="fa-regular fa-comments"></i>
                            &nbsp;&nbsp;
                            { comments.length }
                        </div>

                        <div className="user-likes-holder">
                            { likes.length }
                            &nbsp;
                            <i className="fa-solid fa-heart"></i>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserItinerariesItem;