import React, { useEffect, useState } from 'react';
import './MainPage.css';
import MainPageCarousel from './MainPageCarousel';
import MainPageItineraryItem from './MainPageItineraryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItineraries, getItineraries } from '../../store/itineraries';
import { useHistory } from 'react-router-dom';
import GetStarted from './GetStarted';

const MainPage = () => {
  const dispatch = useDispatch();
  const itineraries = useSelector(getItineraries);
  const [sortedItineraries, setSortedItineraries] = useState([]);

  useEffect(() => {
    dispatch(fetchItineraries());
  }, [dispatch]);

  const likeSorter = (itineraryA, itineraryB) => {
    if (itineraryA.likes.length > itineraryB.likes.length) {
        return -1;
    } else {
        return 1;
    }
  }

  const recentSorter = (itineraryA, itineraryB) => {
    if (new Date(itineraryA.updatedAt) > new Date(itineraryB.updatedAt)) {
        return -1;
    } else {
        return 1;
    }
  }

  useEffect(() => {
    let tmpItineraries = Object.values(itineraries).sort(recentSorter);
    setSortedItineraries(tmpItineraries.slice(0, 9))
  }, [itineraries])

  return (
    <div className='main-wrap'>

      <GetStarted />
      <MainPageCarousel />

      <div className='itinerary-grid-wrap'>

        {sortedItineraries.map((itinerary) => {
          return <MainPageItineraryItem itinerary={itinerary} key={itinerary._id} />
        })}

      </div>

    </div>
  );
}

export default MainPage;
