import Slider from 'react-slick';
import { Link } from "react-router-dom";

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const MainPageItineraryItem = ({ itinerary }) => {
    const { _id, creator, createdAt, activities, title, likes } = itinerary;

    const sliderSettings = {
        dots: false,
        infinite: false,
        autoplay: false,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        pauseOnHover: true,
        autoplaySpeed: 3000,
        arrows: false
    };

    const allImages = activities
        .map((activity) => activity.photoURLs)
        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

    const randomizedImages = shuffleArray(allImages);

    return (
        <Link className='itinerary-link' to={`/itineraries/${_id}`}>
            <div className="itinerary-item-wrap">
                <div className="main-activity-title">{title || "Best day ever!"}</div>

                <Slider {...sliderSettings}>
                    {randomizedImages.map((photoURL, index) => (
                        <div key={index} >
                            <img className="main-activity-img" src={photoURL} alt="activity_photo" />
                        </div>
                    ))}
                </Slider>

                <div className="main-activity-creator">Shared by:<p>{creator}</p></div>

                <div className='main-likes-holder'>
                    <i className="fa-solid fa-heart fa-lg"></i>
                    <div>{likes.length}</div>
                </div>

                <div className="main-activity-date">{formatDate(createdAt)}</div>
            </div>
        </Link>
    )
}

export default MainPageItineraryItem;
