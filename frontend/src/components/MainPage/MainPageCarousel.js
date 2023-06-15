import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './MainPageCarousel.css';

import sliderImg1 from './../../assets/slider/slider-img-1.jpg';
import sliderImg2 from './../../assets/slider/slider-img-2.jpg';
import sliderImg3 from './../../assets/slider/slider-img-3.jpg';
import sliderImg4 from './../../assets/slider/slider-img-4.jpg';
import sliderImg5 from './../../assets/slider/slider-img-5.jpg';
import sliderImg6 from './../../assets/slider/slider-img-6.jpg';
import sliderImg7 from './../../assets/slider/slider-img-7.jpg';
import sliderImg8 from './../../assets/slider/slider-img-8.jpg';

const MainPageCarousel = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 6000,
      pauseOnHover: false,
      fade: true
    };
  
    return (
      <div className="carousel-container">
        <Slider {...settings}>
          <div>
            <img className='slider-img' src={sliderImg1} alt="Image 1" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg2} alt="Image 2" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg3} alt="Image 3" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg4} alt="Image 4" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg5} alt="Image 5" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg6} alt="Image 6" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg7} alt="Image 7" />
          </div>
          <div>
            <img className='slider-img' src={sliderImg8} alt="Image 8" />
          </div>
        </Slider>
      </div>
    );
};

export default MainPageCarousel;