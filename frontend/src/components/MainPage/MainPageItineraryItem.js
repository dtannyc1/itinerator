import Slider from 'react-slick';
import { Link } from "react-router-dom";

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

const MainPageItineraryItem = ({ itinerary }) => {
    const { _id, creator, createdAt, activities, title } = itinerary;

    const sliderSettings = {
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        pauseOnHover: true,
        autoplaySpeed: 3000,
        arrows: false
    };

    const allImages = activities.map((activity) => {
        return activity.photoURLs;
    }).reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return (
        <Link className='itinerary-link' to={`/itineraries/${_id}`}>
            <div className="itinerary-item-wrap">
                <Slider {...sliderSettings}>
                    {allImages.map((photoURL, index) => (
                        <div key={index}>
                            <img className="main-activity-img" src={photoURL} alt="activity_photo" />
                        </div>
                    ))}
                </Slider>

                <div className="main-activity-title">{title || "Best day ever!"}</div>

                <div className="main-activity-creator">Shared by:<p>{creator}</p></div>

                <div className="main-activity-date">{formatDate(createdAt)}</div>
            </div>
        </Link>
    )
}

export default MainPageItineraryItem;
