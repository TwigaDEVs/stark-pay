import React from 'react'
import './header.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import seller1 from '../../assets/profile.png'
import seller2 from '../../assets/profile.png'
import seller3 from '../../assets/profile.png'
import seller4 from '../../assets/profile.png'
import seller5 from '../../assets/profile.png'
import seller6 from '../../assets/profile.png'
import verify from '../../assets/verify.png'
import coin from '../../assets/coin.png'
import starkpay from '../../assets/starkpay.png'
import { Link  } from 'react-router-dom';

const Header = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide:true,
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        }
      }
    ]
  };
  return (
    <div className='header section__padding'>
      <div className="header-content">
        <div>
          <h1>Revolutionize Your Payments with Seamless Transactions!</h1>
          <img className='shake-vertical' src={starkpay} alt="" />
        </div>
      </div>
      <div className='break'>

      </div>
      <div className="navbar-sign">

        <>
         <Link to="/create"> 
          <button type='button' className='primary-btn' >Create</button>
        </Link>
        
        </>
       
      </div>
    </div>
  )
}

export default Header
