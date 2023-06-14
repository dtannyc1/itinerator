import './GetStarted.css'
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const GetStarted = () => {

    const history = useHistory();
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');

    const handleLocation = (e) => {
        setLocation(e.target.value);
    }

    const handleClick = (type) => {
        if (!location) {
            setError("Please enter a location.");
            return;
        }
        history.push(`/itinerary?location=${encodeURIComponent(location)}&type=${encodeURIComponent(type)}`);
    }

    return (
        <div className="get-started-wrap">
            <div className='circle' onClick={() => handleClick('museum')}>
                <i className="fa-solid fa-building-columns fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('bar')}>
                <i className="fa-solid fa-martini-glass fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('park')}>
                <i className="fa-solid fa-tree fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('bowling')}>
                <i className="fa-solid fa-bowling-ball fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('movie theater')}>
                <i className="fa-solid fa-clapperboard fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('cafe')}>
                <i className="fa-solid fa-mug-hot fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('pool')}>
                <i className="fa-solid fa-person-swimming fa-2xl"></i>
            </div>
            <div className='circle' onClick={() => handleClick('restaurant')}>
                <i className="fa-solid fa-utensils fa-2xl"></i>
            </div>

            {/* <div className='circle'><i className="fa-solid fa-basketball fa-2xl"></i></div> */}
            {/* <div className='circle'><i className="fa-solid fa-futbol fa-2xl"></i></div> */}

            {error && <div className="splash-location-error-message">{error}</div>}
            {/* to be styled */}

            <input
                className='search-bar'
                placeholder="enter a city or zip"
                value={location}
                onChange={handleLocation}
            />
        </div>
    )
}

export default GetStarted;