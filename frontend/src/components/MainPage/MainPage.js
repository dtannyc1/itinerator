import React from 'react';
import './MainPage.css';
import MainPageCarousel from './MainPageCarousel';


const MainPage = () => {


  return (
    <div className='main-wrap'>

      <MainPageCarousel />

      <div className='itinerary-grid-wrap'>

        <div className='temp-iti-item'></div>
        <div className='temp-iti-item'></div>
        <div className='temp-iti-item'></div>
        <div className='temp-iti-item'></div>
        <div className='temp-iti-item'></div>

      </div>

    </div>
  );
}

export default MainPage;
