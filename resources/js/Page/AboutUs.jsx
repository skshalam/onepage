import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosSetup from '@/axiosSetup';
function AboutUs() {
    const [data_home, setData_home] = useState({
        "cards": {
            "current_points": 0,
            "current_wallet_balance": 0
        },
        "banners": {
            "banner_image": []
        },
        "homebrandlogo": "",
        "display_brand_logo_name": 0,
        "brand_logo_alignment": 0,
        "merchant_name": "",
    });
    const [data_about, setData_aboutus] = useState({
        "about": {
            "heading": "",
            "content": ""
        },
        "location_Heading": "",
        "gallery": {
            "heading": "",
            "images": []
        },
        "locateus": []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { merchant_base } = useParams();
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axiosSetup.get('/api/onepagehome')
            .then(response => {
                setData_home(response.data.data);
                setLoading(false)
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [merchant_base]);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axiosSetup.get('/api/about')
            .then(response => {
                setData_aboutus(response.data.data);
                setLoading(false)
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [merchant_base]);
    const settings = {
        dots: true,
        infinite: true,
        speed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
    };
    const newSettings = {
        // className: "center",
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        variableWidth: true,
    }

    return (
        <div className='onepage-main-body'>
            <div className='onepage-set-body onepage-set-body-about'>
                <div className={`body-header ${data_home.display_brand_logo_name === 1 ? (data_home.brand_logo_alignment === 1 ? 'logo-left' : 'logo-center') : ''}`}>
                    <div className='head-logo'>
                        <div className={`headlogo-img ${data_home.display_brand_logo_name === 1 ? 'ratio-3' : 'ratio-1'}`}>
                            <Link to={"/about"}>
                                {
                                    loading
                                        ? <div className="cust-skeleton-loader header-img"></div>
                                        : <img src={data_home.homebrandlogo} alt="" />
                                }
                            </Link>
                        </div>
                        {data_home.display_brand_logo_name === 2 && (
                            <div className="headlogo-cont">
                                <Link to={"/"} className='text-decoration-none'>
                                    <h4>{data_home.merchant_name}</h4>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="head-profile">
                        <Link to={"/userProfile"}>
                            <i className='bi bi-person-fill fs-5'></i>
                        </Link>
                    </div>
                </div>
                {data_home.banners?.banner_image?.length > 0
                    ? (
                        <div className='banner-part-main'>
                            <div className='banner-part'>
                                <Slider {...settings}>
                                    {data_home.banners.banner_image.map((banner, index) => (
                                        <div key={index}>
                                            <Link to={data_home.banners.links[index]}>
                                            <img src={banner} alt={`Banner ${index + 1}`} />
                                            </Link>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    )
                    : <div className="cust-skeleton-loader banner-skl"></div>
                }
                <p className='fw-bold fs-4 cust_text_primary text-center'>{data_about.about.heading}</p>
                <div className="about_desc_content py-2 mb-4">
                    <div className='mx-5 text-center' dangerouslySetInnerHTML={{ __html: data_about.about.content }}></div>
                </div>
                <p className='fw-bold fs-4 cust_text_primary text-center'>LOCATION</p>
                {data_about.locateus?.length > 0 ?(
                    <div className="location-slider-container">
                        <Slider {...newSettings} className='mx-4 mb-5'>
                            {data_about.locateus.map((locat, index) => (
                                <div key={index}>
                                    <div className="about_location_card mx-2">
                                        <div className="location_img_content">
                                            <img src={locat.image} alt={`Banner ${index + 1}`} />
                                        </div>
                                        <div className="location_heading">
                                            <p className='cust_text_primary fw-bold fs-5 mb-0'>
                                                {locat.name_outlet}
                                            </p>
                                            <div className="d-flex flex-column">
                                                <p className='cust_text_secondary mb-0 small'>{locat.location}</p>
                                                <p className='cust_text_secondary mb-0 small'>{locat.mobile}</p>
                                                <p className='cust_text_secondary mb-0 small'>{locat.email}</p>
                                            </div>
                                        </div>
                                        {locat.location_link != "" && (
                                            <button className='btn'>
                                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_624_1474)">
                                                    <path d="M1.67822 9.65918H4.01275" stroke="white" stroke-width="1.55635" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M14.907 9.65918H17.2415" stroke="white" stroke-width="1.55635" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M9.45972 1.87695V4.21148" stroke="white" stroke-width="1.55635" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M9.45972 15.1069V17.4415" stroke="white" stroke-width="1.55635" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M9.45968 15.1064C12.4681 15.1064 14.9069 12.6676 14.9069 9.65914C14.9069 6.65072 12.4681 4.21191 9.45968 4.21191C6.45126 4.21191 4.01245 6.65072 4.01245 9.65914C4.01245 12.6676 6.45126 15.1064 9.45968 15.1064Z" stroke="white" stroke-width="1.55635" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M9.45953 11.9938C10.7489 11.9938 11.7941 10.9486 11.7941 9.65923C11.7941 8.36991 10.7489 7.32471 9.45953 7.32471C8.1702 7.32471 7.125 8.36991 7.125 9.65923C7.125 10.9486 8.1702 11.9938 9.45953 11.9938Z" stroke="white" stroke-width="1.55635" stroke-linecap="round" stroke-linejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_624_1474">
                                                        <rect width="18.6762" height="18.6762" fill="white" transform="translate(0.121582 0.320801)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>
                                                LOCATE US
                                            </span>
                                        </button>
                                        )}
                                        
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    )
                    : <div className="cust-skeleton-loader banner-skl"></div>
                }
                <p className='fw-bold fs-4 cust_text_primary text-center mb-0'>OUR MENU | GALLERY</p>
                {data_about.gallery?.images?.length > 0
                    ? (
                        <div className='banner-part-main'>
                            <div className='banner-part'>
                                <Slider {...settings}>
                                    {data_about.gallery.images.map((gallery_banner, index) => (
                                        <div key={index}>
                                            <img src={gallery_banner} alt="" />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    )
                    : <div className="cust-skeleton-loader banner-skl"></div>
                }
                <div className="powered-ewards">
                    <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                        <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
                </div>

            </div>
        </div>
    )
}

export default AboutUs
