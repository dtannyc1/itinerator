import React, { useEffect } from 'react';
import './MainPage.css';
import MainPageCarousel from './MainPageCarousel';
import MainPageItineraryItem from './MainPageItineraryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItineraries, getItineraries } from '../../store/itineraries';


const MainPage = () => {
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(fetchItineraries());
  }, [dispatch]);

  const itineraries = useSelector(getItineraries);

  return (
    <div className='main-wrap'>

      <MainPageCarousel />

      <div className='itinerary-grid-wrap'>

        {itineraries.map((itinerary) => {
          return <MainPageItineraryItem itinerary={itinerary} key={itinerary._id} />
        })}

      </div>

    </div>
  );
}

export default MainPage;
