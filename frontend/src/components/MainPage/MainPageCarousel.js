import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './MainPageCarousel.css';

import sliderImg1 from './../../assets/slider/slider-img-1.jpg';
import sliderImg2 from './../../assets/slider/slider-img-2.jpg';
import sliderImg3 from './../../assets/slider/slider-img-3.jpg';

const MainPageCarousel = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: false
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
        </Slider>
      </div>
    );
};

export default MainPageCarousel;