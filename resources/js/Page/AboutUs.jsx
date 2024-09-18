import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AboutUs() {
    const [data_getcoupons, setData_getcoupons] = useState({
        active_coupon_count: 0,
        active_rewards_count: 0,
        active_membership_count: 0,
    });
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { merchant_base } = useParams();
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            axios.get('/api/getDataCounts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('API Response:', response);
                    setData_getcoupons(response.data.data);
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setError(error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        axios.get('/api/onepagehome', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setData_home(response.data.data);
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
        className: "center",
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        speed: 500,
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
                        <Link to={"/Profile"}>
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
                                            <img src={banner} alt={`Banner ${index + 1}`} />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    )
                    : <div className="cust-skeleton-loader banner-skl"></div>
                }
                <p className='fw-bold fs-4 cust_text_primary text-center'>ABOUT US</p>
                <div className="about_desc_content py-2 mb-4">
                    <p className='mx-5 text-center'>
                        Samsung Electronics constantly reinvents the future. We explore the unknown to discover technologies to help people all over the world lead happier, healthier lives. <br /><br />
                        We create a culture of infinite possibilities. The deep trust and loyalty of our customers drives us to continually grow and lead innovation.<br /><br />
                        We are expanding our highly differentiated mobile devices, as well as working hard to develop next-generation innovation.<br /><br />
                        All researchers and developers throughout the world are working to discover the next life-changing technologies to create new values and make a better world.
                    </p>
                </div>
                <p className='fw-bold fs-4 cust_text_primary text-center'>LOCATION</p>
                <div className="location-slider-container">
                    <Slider {...newSettings} className='mx-4 mb-5'>
                        {[...new Array(3)].map((i, iIndex) => (<div key={iIndex}>
                            <div className="about_location_card mx-2">
                                <div className="location_img_content">
                                    <img src="https://t4.ftcdn.net/jpg/02/81/89/73/360_F_281897358_3rj9ZBSZHo5s0L1ug7uuIHadSxh9Cc75.jpg" alt="" />
                                </div>
                                <div className="location_heading">
                                    <p className='cust_text_primary fw-bold fs-5 mb-0'>Samsung Electronics,
                                        Seoul</p>
                                    <div className="d-flex flex-column">
                                        <p className='cust_text_secondary mb-0 small'>Seoul, South Korea</p>
                                        <p className='cust_text_secondary mb-0 small'>+82 8546845689</p>
                                        <p className='cust_text_secondary mb-0 small'>seoul.global@samsung.kr</p>
                                    </div>
                                </div>
                                <div className="mt-2 locate_btn d-flex justify-content-center align-items-center gap-2">
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
                                </div>
                            </div>
                        </div>))}
                    </Slider>
                </div>
                <p className='fw-bold fs-4 cust_text_primary text-center mb-0'>OUR MENU | GALLERY</p>
                {data_home.banners?.banner_image?.length > 0

                    ? (
                        <div className='banner-part-main'>
                            <div className='banner-part'>
                                <Slider {...settings}>
                                    {data_home.banners.banner_image.map((banner, index) => (
                                        <div key={index}>
                                            <img src={banner} alt={`Banner ${index + 1}`} />
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
