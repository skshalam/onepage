// resources/js/Page/About.jsx
import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
function About() {
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
                setLoading(false);
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
    return (
        <div className='onepage-main-body'>
            <div className='onepage-set-body onepage-set-body-about'>
                <div className={`body-header ${data_home.display_brand_logo_name === 1 ? (data_home.brand_logo_alignment === 1 ? 'logo-left' : 'logo-center') : ''}`}>
                    <div className='head-logo'>
                        <div className={`headlogo-img ${data_home.display_brand_logo_name === 1 ? 'ratio-3' : 'ratio-1'}`}>
                            {
                                loading
                                    ? <div className="cust-skeleton-loader header-img"></div>
                                    : <img src={data_home.homebrandlogo} alt="" />
                            }
                        </div>
                        {data_home.display_brand_logo_name === 2 && (
                            <div className="headlogo-cont">
                                <h4>{data_home.merchant_name}</h4>
                            </div>
                        )}
                    </div>
                    <div className="head-profile">
                        <Link className='text-decoration-none' to={"/Profile"}>
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
                <div className={`wallet-container gap-2 m-3 ${data_home.banners?.banner_image?.length > 0 ? '' : 'wallet-banner'}`}>
                    <Link className='text-decoration-none' to={"/Creditwallet"}>
                        <div className="wallet-content">
                            <div className="content">
                                <p>Credit Balance:</p>
                                {loading ?
                                    <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                                        <Skeleton />
                                    </SkeletonTheme>
                                    : <div className="balance">
                                        <img src="" alt="" />
                                        <span>
                                            {data_home.cards.current_points}
                                        </span>
                                    </div>}
                            </div>
                            <div className="content">
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </Link>
                    <Link className='text-decoration-none' to={"/Wallet"}>
                        <div className="wallet-content">
                            <div className="content">
                                <p>Wallet's Balance:</p>
                                {
                                    loading ?
                                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                                            <Skeleton />
                                        </SkeletonTheme>
                                        : <div className="balance">
                                            <img src="" alt="" />
                                            <span>{data_home.cards.current_wallet_balance}</span>
                                        </div>}
                            </div>
                            <div className="content">
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="rewards-container gap-2 m-3">
                    <Link className='text-decoration-none' to={"/Coupon"}>
                        <div className="rewards-content">
                            <div className="content">
                                <p>Coupon <br /> Cart</p>
                                {
                                    loading ?
                                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                                            <Skeleton />
                                        </SkeletonTheme>
                                        : <div className="balance">
                                            <img src="" alt="" />
                                            <span>{data_getcoupons.active_coupon_count}</span>
                                        </div>
                                }
                            </div>
                            <div className="content">
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </Link>
                    <Link className='text-decoration-none' to={"/Reward"}>
                        <div className="rewards-content">
                            <div className="content">
                                <p>Reward <br /> Menu</p>
                                {loading ?
                                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                                            <Skeleton />
                                        </SkeletonTheme>
                                        :
                                    <div className="balance">
                                    <img src="" alt="" />
                                    <span>{data_getcoupons.active_rewards_count}</span>
                                </div>}
                            </div>
                            <div className="content">
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </Link>
                    <Link className='text-decoration-none' to={"/Membership"}>
                        <div className="rewards-content">
                            <div className="content">
                                <p>Membership Package</p>
                                {loading ?
                                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                                            <Skeleton />
                                        </SkeletonTheme>
                                        :
                                    <div className="balance">
                                    <img src="" alt="" />
                                    <span>{data_getcoupons.active_membership_count}</span>
                                </div>}
                            </div>
                            <div className="content">
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    </Link>
                </div>
                <Link className='text-decoration-none' to={"/Giftcard"}>
                    <div className="gift-container overflow-hidden position-relative m-3 d-flex align-items-center justify-content-center text-light rounded-3">
                        <div className="gift-content d-flex align-items-center gap-2">
                            <img src="https://i.imgur.com/ZoluTbe.png" alt="" />
                            <span className='text-uppercase'>Gift Card</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                                <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                            </svg>
                        </div>
                        <img className='position-absolute' src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726655119/wv60wfj43xim17pv52j_kzmkbo.svg" alt="" />
                    </div>
                </Link>
                <div className="powered-ewards">
                    <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                        <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
                </div>
            </div>
        </div>
    );
}

export default About;