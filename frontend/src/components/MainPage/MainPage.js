import React, { useEffect, useState } from 'react';
import './MainPage.css';
import MainPageCarousel from './MainPageCarousel';
import MainPageItineraryItem from './MainPageItineraryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItineraries, getItineraries } from '../../store/itineraries';
import { useHistory } from 'react-router-dom';


// const MainPage = () => {
//   const dispatch = useDispatch();


//   useEffect(() => {
//     dispatch(fetchItineraries());
//   }, [dispatch]);

//   const itineraries = useSelector(getItineraries);

//   return (
//     <div className='main-wrap'>

//       <MainPageCarousel />

//       <div className='itinerary-grid-wrap'>

//         {itineraries.map((itinerary) => {
//           return <MainPageItineraryItem itinerary={itinerary} key={itinerary._id} />
//         })}

//       </div>

//     </div>
//   );
// }

// export default MainPage;

const MainPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchItineraries());
  }, [dispatch]);

  const itineraries = useSelector(getItineraries);

  const handleFood = () => {
    const type = 'pizza'
    history.push(`/itinerary?location=${encodeURIComponent(location)}&type=${encodeURIComponent(type)}`);
  }

  const handleLocation = (e) => {
    setLocation(e.target.value);
  }

  return (
    <div className='main-wrap'>

      <MainPageCarousel />

      <div>
        <input type='text' value={location} placeholder='enter a location...' onChange={handleLocation}></input>
        <button onClick={handleFood}>Pizza</button>
      </div>

      <div className='itinerary-grid-wrap'>

        {itineraries.map((itinerary) => {
          return <MainPageItineraryItem itinerary={itinerary} key={itinerary._id} />
        })}

      </div>

    </div>
  );
}

export default MainPage;
