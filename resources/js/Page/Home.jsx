import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { Input, Modal } from 'antd';
import { ThemeProvider } from '../Providers/ContextProviders/ThemeProvider';
import ThemeContext from '../Providers/Contexts/ThemeContext';
import { maskPhoneNumber } from '../utility/formating';
import { p } from 'framer-motion/client';
const Home = () => {
    const { merchant_base } = useParams();
    const [timer, setTimer] = useState(15);
    const [data, setData] = useState([]);
    const [cCode, setcCode] = useState('in');
    const [dialCode, setDialCode] = useState('')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [merchant_id, setMerchantId] = useState([]);
    const [merchantid, setMerchantid] = useState([]);
    const [bannerImages, setBannerImages] = useState([]);
    const [merchantDetails, setMerchantDetails] = useState({});
    const [Sociallink, setSociallink] = useState({});
    const navigate = useNavigate();
    const { useThemeStyles, setUseThemeStyles } = useContext(ThemeContext);
    const [proceed, setProceed] = useState(false);
    const [open, setOpen] = useState(false);
    const bodyRef = useRef();
    useEffect(() => {
        console.log('Merchant Base:', merchant_base);
        axios.get('/api/onepage/' + merchant_base)
            .then(response => {
                setData(response.data.data);
                setMerchantId(response.data.merchant_id);
                setMerchantid(response.data.api_header);
                setBannerImages(response.data.data.banners.banner_image);
                setMerchantDetails(response.data.data.merchant_details);
                setLoading(false);
                setUseThemeStyles(response.data.data.theme)
                setSociallink(response.data.data.social_links)
                console.log("social link", Sociallink.facebook_link);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [merchant_base]);

    const otpRefresh = () => {
        let tValue = 15;
        let countdown = setInterval(function () {
            tValue--;
            if (tValue === 0) {
                clearInterval(countdown); // stop the interval when the timer reaches 0
            }
            setTimer(tValue)
        }, 1000); // run this code every second (1000 milliseconds)
    }

    const handlePhoneChange = (value, data) => {
        if (value === '') {
            setMobile(data.dialCode); // set dial code of the selected country
        } else {
            setMobile(value); // set the phone value
        }
        setcCode(data.countryCode);
        setDialCode(data.dialCode)
    };
    const handlePhoneChange_otp = (value) => {
        setOtp(value);
    };
    const handleButtonClick = async () => {
        try {
            const formattedMobile = mobile.slice(-10);
            const response = await axios.post('/api/websiteLogin', {
                mobile: formattedMobile,
                merchant_id,  // Assuming this is the same as the merchant_id prop
                merchantid,
            });
            setApiResponse(response.data);
            if (response.data?.error) {
                setProceed(false)
                setOpen(true)
            }
            if (!response.data?.error) {
                setProceed(true)
                otpRefresh()
            }
            console.log('API Response:', response.data);
            // if (response) {
            //     otpRefresh()
            // }
        } catch (error) {
            console.error('Error making API call:', error);
        }
    };
    const handleButtonClick_verify = async () => {
        try {
            const formattedMobile = mobile.slice(-10);
            const response = await axios.post('/api/onePageLoginOtpVerifyNew', {
                mobile: formattedMobile,
                merchant_id,  // Assuming this is the same as the merchant_id prop
                merchantid,
                otp,
            });
            if (response && response.data && response.data.message && response.data.message.original) {
                localStorage.setItem('access_token', response.data.message.original.access_token);
                localStorage.setItem('expires_in', response.data.message.original.expires_in);
                // Optionally, you might want to navigate or update UI state here
                navigate('/About');
            } else {
                console.error('Unexpected response structure:', response);
                // Handle unexpected response structure
            }
        } catch (error) {
            console.error('Error making API call:', error);
        }
    };
    const resendOtpHandler = async () => {
        try {
            const formattedMobile = mobile.slice(-10);
            const res = await axios.post('/api/onePageLoginResendOtp', {
                mobile: formattedMobile,
                merchant_id,
                otp_msg: apiResponse?.data?.otp_msg
            });
            console.log('API Response:', res.data);
            if (res) {
                otpRefresh()
            }
        } catch (error) {
            console.error('Error making API call:', error);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
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
        <ThemeProvider >
            <div ref={bodyRef} className='onepage-main-body'>
                <div className='onepage-set-body'>
                    <div className='onepage-set-body'>
                        <div className='banner-part-main'>
                            <div className='banner-part'>
                                <Slider {...settings}>
                                    {bannerImages.map((image, index) => (
                                        <div key={index}>
                                            <Link to={data?.banners?.links[index]}>
                                                <img src={image} alt={`Banner ${index + 1}`} />
                                            </Link>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                    <div className='login-part'>
                        <div className='login-part-set'>
                            <div className='login-part-set-main'>
                                <div className='login-part-set-head'>
                                    {merchantDetails && (
                                        <div className='login-part-img'>
                                            <img src={merchantDetails.business_image} alt="Business Logo" />
                                        </div>
                                    )}
                                    <div className='login-part-text'>
                                        <h4>Log In</h4>
                                    </div>
                                </div>
                                {!proceed &&
                                    <div className='login-part-otp'>
                                        <p>Please enter your mobile number</p>
                                        <div className='login-part-input'>
                                            <PhoneInput
                                                country={cCode}
                                                onChange={handlePhoneChange}
                                                value={mobile}
                                            />
                                            <button
                                                onClick={handleButtonClick}
                                            >
                                                Get OTP
                                            </button>
                                        </div>
                                        <h5>[You will receive an OTP]</h5>
                                    </div>
                                }
                                {proceed &&
                                    <div className='login-part-otp'>
                                        <p>You will receive an OTP on
                                            <span className='me-1'>+{dialCode}</span>
                                            <span>
                                                {maskPhoneNumber(mobile.slice(-10))}
                                            </span>
                                            <svg
                                                onClick={() => setProceed(false)}
                                                className='ms-1'
                                                style={{ cursor: "pointer" }}
                                                width="15" height="15" viewBox="0 0 20 20" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.60629 15.5597H7.50655C7.62761 15.5604 7.74762 15.5372 7.85969 15.4914C7.97177 15.4457 8.07371 15.3782 8.15966 15.2929L14.5252 8.91823L17.1376 6.36099C17.2238 6.27548 17.2923 6.17374 17.339 6.06164C17.3857 5.94955 17.4097 5.82932 17.4097 5.70788C17.4097 5.58645 17.3857 5.46622 17.339 5.35412C17.2923 5.24203 17.2238 5.14029 17.1376 5.05477L13.2374 1.10852C13.1518 1.0223 13.0501 0.953871 12.938 0.90717C12.8259 0.86047 12.7057 0.836426 12.5842 0.836426C12.4628 0.836426 12.3426 0.86047 12.2305 0.90717C12.1184 0.953871 12.0166 1.0223 11.9311 1.10852L9.3371 3.71176L2.95319 10.0865C2.86793 10.1724 2.80048 10.2744 2.7547 10.3864C2.70893 10.4985 2.68572 10.6185 2.68642 10.7396V14.6398C2.68642 14.8838 2.78334 15.1178 2.95585 15.2903C3.12836 15.4628 3.36233 15.5597 3.60629 15.5597ZM12.5842 3.05865L15.1875 5.66189L13.8813 6.96811L11.278 4.36487L12.5842 3.05865ZM4.52617 11.1167L9.98101 5.66189L12.5842 8.26513L7.1294 13.72H4.52617V11.1167ZM18.3242 17.3995H1.76655C1.52259 17.3995 1.28861 17.4964 1.1161 17.6689C0.943594 17.8414 0.84668 18.0754 0.84668 18.3193C0.84668 18.5633 0.943594 18.7973 1.1161 18.9698C1.28861 19.1423 1.52259 19.2392 1.76655 19.2392H18.3242C18.5682 19.2392 18.8022 19.1423 18.9747 18.9698C19.1472 18.7973 19.2441 18.5633 19.2441 18.3193C19.2441 18.0754 19.1472 17.8414 18.9747 17.6689C18.8022 17.4964 18.5682 17.3995 18.3242 17.3995Z" fill={useThemeStyles.primary_color} />
                                            </svg>
                                        </p>
                                        <div className='login-part-input'>
                                            <div className="otp-fields">
                                                <Input.OTP onChange={handlePhoneChange_otp} />
                                            </div>
                                            <button onClick={handleButtonClick_verify}>Verify OTP</button>
                                        </div>

                                        {
                                            timer === 0
                                                ? <h5
                                                    className='text-decoration-underline fw-semibold'
                                                    style={{ color: useThemeStyles.primary_color, cursor: "pointer" }}
                                                    onClick={() => resendOtpHandler()}
                                                >
                                                    Resend OTP
                                                </h5>
                                                : <h5 className='fw-semibold'>OTP expires in {timer}sec</h5>
                                        }
                                    </div>
                                }
                            </div>
                            <div className='socail-linkppart'>
                                <div className="sl-details-body">
                                    <p>Connect with us on:</p>
                                    <div className="sl-details-body-part">
                                        <a href={Sociallink.facebook_link} target="_blank" rel="noopener noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                <path d="M15.5829 5.32003H17.4629V2.14003C16.5526 2.04538 15.638 1.99865 14.7229 2.00003C12.0029 2.00003 10.1429 3.66003 10.1429 6.70003V9.32003H7.07288V12.88H10.1429V22H13.8229V12.88H16.8829L17.3429 9.32003H13.8229V7.05003C13.8229 6.00003 14.1029 5.32003 15.5829 5.32003Z" fill={useThemeStyles.primary_color} />
                                            </svg>
                                        </a>
                                        <a href={Sociallink.instagram_link} target="_blank" rel="noopener noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                <path d="M17.8029 5.46C17.5656 5.46 17.3335 5.53038 17.1362 5.66224C16.9389 5.79409 16.7851 5.98151 16.6942 6.20078C16.6034 6.42005 16.5796 6.66133 16.6259 6.89411C16.6722 7.12689 16.7865 7.34071 16.9544 7.50853C17.1222 7.67635 17.336 7.79064 17.5688 7.83694C17.8016 7.88324 18.0428 7.85948 18.2621 7.76866C18.4814 7.67783 18.6688 7.52402 18.8007 7.32668C18.9325 7.12935 19.0029 6.89734 19.0029 6.66C19.0029 6.34174 18.8765 6.03652 18.6514 5.81147C18.4264 5.58643 18.1212 5.46 17.8029 5.46ZM22.4029 7.88C22.3834 7.0503 22.228 6.2294 21.9429 5.45C21.6886 4.78313 21.2929 4.17928 20.7829 3.68C20.2877 3.16743 19.6824 2.77418 19.0129 2.53C18.2355 2.23616 17.4137 2.07721 16.5829 2.06C15.5229 2 15.1829 2 12.4629 2C9.74289 2 9.40289 2 8.34289 2.06C7.51204 2.07721 6.69023 2.23616 5.91289 2.53C5.24457 2.77665 4.63982 3.16956 4.14289 3.68C3.63032 4.17518 3.23707 4.78044 2.99289 5.45C2.69905 6.22734 2.5401 7.04915 2.52289 7.88C2.46289 8.94 2.46289 9.28 2.46289 12C2.46289 14.72 2.46289 15.06 2.52289 16.12C2.5401 16.9508 2.69905 17.7727 2.99289 18.55C3.23707 19.2196 3.63032 19.8248 4.14289 20.32C4.63982 20.8304 5.24457 21.2234 5.91289 21.47C6.69023 21.7638 7.51204 21.9228 8.34289 21.94C9.40289 22 9.74289 22 12.4629 22C15.1829 22 15.5229 22 16.5829 21.94C17.4137 21.9228 18.2355 21.7638 19.0129 21.47C19.6824 21.2258 20.2877 20.8326 20.7829 20.32C21.2951 19.8226 21.6912 19.2182 21.9429 18.55C22.228 17.7706 22.3834 16.9497 22.4029 16.12C22.4029 15.06 22.4629 14.72 22.4629 12C22.4629 9.28 22.4629 8.94 22.4029 7.88ZM20.6029 16C20.5956 16.6348 20.4806 17.2637 20.2629 17.86C20.1032 18.2952 19.8468 18.6884 19.5129 19.01C19.1885 19.3405 18.7961 19.5964 18.3629 19.76C17.7666 19.9778 17.1377 20.0927 16.5029 20.1C15.5029 20.15 15.1329 20.16 12.5029 20.16C9.87289 20.16 9.50289 20.16 8.50289 20.1C7.84378 20.1123 7.18749 20.0109 6.56289 19.8C6.14867 19.6281 5.77425 19.3728 5.46289 19.05C5.13098 18.7287 4.87773 18.3352 4.72289 17.9C4.47875 17.2952 4.34333 16.6519 4.32289 16C4.32289 15 4.26289 14.63 4.26289 12C4.26289 9.37 4.26289 9 4.32289 8C4.32737 7.35106 4.44584 6.70795 4.67289 6.1C4.84894 5.67791 5.11916 5.30166 5.46289 5C5.7667 4.65617 6.14218 4.3831 6.56289 4.2C7.17244 3.98004 7.81489 3.86508 8.46289 3.86C9.46289 3.86 9.83289 3.8 12.4629 3.8C15.0929 3.8 15.4629 3.8 16.4629 3.86C17.0977 3.86728 17.7266 3.98225 18.3229 4.2C18.7773 4.36865 19.1852 4.64285 19.5129 5C19.8406 5.30718 20.0967 5.68273 20.2629 6.1C20.4851 6.70893 20.6002 7.35178 20.6029 8C20.6529 9 20.6629 9.37 20.6629 12C20.6629 14.63 20.6529 15 20.6029 16ZM12.4629 6.87C11.4487 6.87198 10.4579 7.17453 9.61555 7.73942C8.77324 8.30431 8.11727 9.1062 7.73052 10.0438C7.34378 10.9813 7.24361 12.0125 7.44268 13.0069C7.64175 14.0014 8.13113 14.9145 8.84897 15.631C9.56681 16.3474 10.4809 16.835 11.4757 17.0321C12.4706 17.2293 13.5016 17.1271 14.4384 16.7385C15.3752 16.35 16.1758 15.6924 16.739 14.849C17.3023 14.0056 17.6029 13.0142 17.6029 12C17.6042 11.3251 17.4721 10.6566 17.2141 10.033C16.9562 9.40931 16.5774 8.84281 16.0998 8.36605C15.6221 7.88929 15.0548 7.51168 14.4307 7.25493C13.8065 6.99818 13.1378 6.86736 12.4629 6.87ZM12.4629 15.33C11.8043 15.33 11.1605 15.1347 10.6128 14.7688C10.0652 14.4029 9.63841 13.8828 9.38637 13.2743C9.13433 12.6659 9.06839 11.9963 9.19688 11.3503C9.32536 10.7044 9.64252 10.111 10.1082 9.64533C10.5739 9.17963 11.1673 8.86247 11.8132 8.73398C12.4592 8.6055 13.1287 8.67144 13.7372 8.92348C14.3457 9.17552 14.8658 9.60234 15.2317 10.15C15.5976 10.6976 15.7929 11.3414 15.7929 12C15.7929 12.4373 15.7068 12.8703 15.5394 13.2743C15.3721 13.6784 15.1268 14.0454 14.8176 14.3547C14.5083 14.6639 14.1412 14.9092 13.7372 15.0765C13.3332 15.2439 12.9002 15.33 12.4629 15.33Z" fill={useThemeStyles.primary_color} />
                                            </svg>
                                        </a>
                                        <a href={Sociallink.zomato_link} target="_blank" rel="noopener noreferrer">
                                        <svg viewBox='0 0 48 48' xmlns="http://www.w3.org/2000/svg"><polyline className="a" points="9 21.51 12.306 21.51 9 25.89 12.306 25.89"/><path className="a" d="M15.6116,25.89h0a1.6578,1.6578,0,0,1-1.6529-1.6529V23.1628A1.6578,1.6578,0,0,1,15.6116,21.51h0a1.6578,1.6578,0,0,1,1.6529,1.6529v1.0744A1.6578,1.6578,0,0,1,15.6116,25.89Z"/><path className="a" d="M18.9173,23.1628A1.6578,1.6578,0,0,1,20.57,21.51h0a1.6578,1.6578,0,0,1,1.6529,1.6529v2.6447"/><line className="a" x1="18.9173" y1="21.5099" x2="18.9173" y2="25.8075"/><path className="a" d="M22.2231,23.1628A1.6578,1.6578,0,0,1,23.876,21.51h0a1.6578,1.6578,0,0,1,1.6529,1.6529v2.6447"/><path className="a" d="M30.4876,24.2372A1.6578,1.6578,0,0,1,28.8347,25.89h0a1.6578,1.6578,0,0,1-1.6529-1.6529V23.1628A1.6578,1.6578,0,0,1,28.8347,21.51h0a1.6578,1.6578,0,0,1,1.6529,1.6529"/><line className="a" x1="30.4876" y1="25.8901" x2="30.4876" y2="21.5099"/><path className="a" d="M32.9669,20.1059v4.9587a.7809.7809,0,0,0,.8265.8265h.2479"/><line className="a" x1="32.1405" y1="21.5277" x2="33.876" y2="21.5277"/><path className="a" d="M37.3471,25.89h0a1.6578,1.6578,0,0,1-1.6529-1.6529V23.1628A1.6578,1.6578,0,0,1,37.3471,21.51h0A1.6578,1.6578,0,0,1,39,23.1628v1.0744A1.6578,1.6578,0,0,1,37.3471,25.89Z"/><path className="a" d="M40.5,42.5H7.5a2.0059,2.0059,0,0,1-2-2V7.5a2.0059,2.0059,0,0,1,2-2h33a2.0059,2.0059,0,0,1,2,2v33A2.0059,2.0059,0,0,1,40.5,42.5Z"/></svg>
                                        </a>
                                        <a href={Sociallink.twitter_link} target="_blank" rel="noopener noreferrer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                <path d="M22.4629 5.79997C21.7112 6.12606 20.9163 6.34163 20.1029 6.43997C20.9611 5.92729 21.6042 5.12075 21.9129 4.16997C21.1064 4.65003 20.2237 4.98826 19.3029 5.16997C18.6874 4.50254 17.8679 4.05826 16.9727 3.90682C16.0775 3.75537 15.1574 3.90532 14.3567 4.33315C13.5559 4.76099 12.9198 5.4425 12.5481 6.2708C12.1764 7.09911 12.0902 8.02736 12.3029 8.90997C10.6723 8.82749 9.07733 8.40292 7.62155 7.66383C6.16576 6.92474 4.88174 5.88766 3.85289 4.61997C3.49203 5.25013 3.30241 5.96379 3.30289 6.68997C3.30161 7.36435 3.46711 8.02858 3.78465 8.62353C4.10218 9.21848 4.56191 9.72568 5.12289 10.1C4.47087 10.0822 3.83278 9.90726 3.26289 9.58997V9.63997C3.26778 10.5849 3.59888 11.4991 4.20021 12.2279C4.80153 12.9568 5.63615 13.4556 6.56289 13.64C6.20615 13.7485 5.83577 13.8058 5.46289 13.81C5.20478 13.807 4.94731 13.7835 4.69289 13.74C4.9568 14.5528 5.46751 15.2631 6.15397 15.7721C6.84042 16.2811 7.66847 16.5635 8.52289 16.58C7.08009 17.7152 5.29877 18.3348 3.46289 18.34C3.12863 18.3411 2.79463 18.321 2.46289 18.28C4.33732 19.4902 6.5217 20.1327 8.75289 20.13C10.2926 20.146 11.82 19.855 13.246 19.274C14.672 18.6931 15.9679 17.8338 17.0581 16.7465C18.1483 15.6591 19.0109 14.3654 19.5954 12.9409C20.18 11.5164 20.4749 9.98969 20.4629 8.44997C20.4629 8.27996 20.4629 8.09997 20.4629 7.91997C21.2476 7.33478 21.9244 6.61739 22.4629 5.79997Z" fill={useThemeStyles.primary_color} />
                                            </svg>
                                        </a>
                                        <a href={Sociallink.linkedin_link} target="_blank" rel="noopener noreferrer">
                                            <svg width="25" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill={useThemeStyles.primary_color} d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"/></svg>
                                        </a>
                                        <a href={Sociallink.linkedin_link} target="_blank" rel="noopener noreferrer">
                                        <svg width="22" height="22" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="zomato-svgrepo-com 1">
                                            <rect width="800" height="800" fill={useThemeStyles.primary_color}/>
                                            <path id="Vector" d="M489.207 401.4C489.431 401.4 489.675 401.4 489.919 401.4C494.616 401.4 499.191 401.929 503.584 402.966L503.177 402.884L502.852 405.873C501.469 417.688 492.786 427.144 481.48 429.665L481.297 429.706C480.524 429.869 479.629 429.97 478.714 429.97C472.492 429.97 467.286 425.68 465.863 419.904L465.842 419.823C465.761 419.274 465.72 418.623 465.72 417.973C465.72 414.719 466.859 411.73 468.771 409.371L468.75 409.391C472.492 405.04 477.86 402.193 483.9 401.766H483.961C485.506 401.563 487.336 401.42 489.166 401.42L489.207 401.4ZM659.369 374.517C665.815 374.517 669.719 380.313 669.719 392.33C669.719 409.778 662.704 424.114 653.838 424.114C647.188 424.114 643.284 418.115 643.284 406.28C643.284 388.65 650.503 374.517 659.369 374.517ZM236.812 374.517C243.298 374.517 247.182 380.313 247.182 392.33C247.182 409.778 240.167 424.114 231.28 424.114C224.651 424.114 220.767 418.115 220.767 406.28C220.767 388.65 227.966 374.517 236.832 374.517H236.812ZM110.044 350.949C108.784 360.852 107.462 370.715 105.591 379.662C113.928 379.459 121.33 379.255 141.441 379.255L95.444 429.055L95.0576 446.909C106.343 446.157 120.395 445.913 136.48 445.913C150.856 445.913 165.294 446.116 174.526 446.909C176.173 435.278 177.82 427.53 179.854 418.013C172.859 418.4 160.678 418.603 141.441 418.603L187.439 368.559L188.028 350.929C176.926 351.519 166.941 351.681 149.413 351.681C130.379 351.681 124.645 351.498 110.044 350.929V350.949ZM240.309 348.651C210.742 350.237 187.378 374.599 187.378 404.43C187.378 405.487 187.398 406.524 187.459 407.561V407.419C187.337 408.537 187.276 409.818 187.276 411.12C187.276 432.553 204.642 449.919 226.075 449.919C226.868 449.919 227.641 449.898 228.413 449.858H228.312C257.878 448.333 281.263 423.971 281.263 394.181C281.263 393.042 281.223 391.903 281.162 390.785V390.948C281.284 389.809 281.345 388.508 281.345 387.165C281.345 365.875 264.08 348.611 242.79 348.611C241.916 348.611 241.061 348.631 240.207 348.692H240.329L240.309 348.651ZM364.311 348.448C346.518 351.397 332.1 363.414 325.797 379.52L325.675 379.865C326.874 374.009 327.566 367.298 327.566 360.405C327.566 356.541 327.342 352.718 326.915 348.956L326.956 349.424C317.297 351.132 306.011 352.251 294.522 352.515H294.257C294.318 354.162 294.339 356.114 294.339 358.066C294.339 367.258 293.627 376.266 292.265 385.071L292.387 384.095L288.137 413.194C286.469 424.622 284.639 437.819 282.768 446.157H317.154C317.337 441.093 318.618 433.163 319.533 426.188L322.482 406.219C324.902 393.225 335.232 377.913 343.183 377.913C347.799 377.913 347.636 382.387 346.335 390.724L343 413.214C341.332 424.643 339.502 437.84 337.631 446.177H372.363C372.567 441.114 373.665 433.163 374.6 426.208L377.549 406.24C379.928 393.225 390.299 377.933 398.229 377.933C402.845 377.933 402.683 382.204 401.93 387.999L393.613 446.197H425.335L436.459 379.906C438.878 363.414 437.577 348.489 419.276 348.489C401.991 351.275 387.919 362.743 381.534 378.198L381.412 378.523C383.629 363.028 382.327 348.489 364.209 348.489L364.311 348.448ZM663.578 347.391C633.625 348.997 609.955 373.663 609.955 403.86C609.955 404.938 609.975 405.995 610.036 407.053V406.911C609.914 408.049 609.853 409.371 609.853 410.693C609.853 432.39 627.443 450 649.161 450C649.954 450 650.747 449.98 651.519 449.939H651.418C681.371 448.373 705.061 423.707 705.061 393.51C705.061 392.351 705.02 391.212 704.959 390.073V390.236C705.081 389.097 705.142 387.755 705.142 386.413C705.142 364.838 687.654 347.35 666.079 347.35C665.205 347.35 664.33 347.37 663.476 347.431H663.598L663.578 347.391ZM497.504 345.804C494.209 345.865 491.037 346.109 487.906 346.516L488.333 346.476C475.562 347.94 463.992 351.844 453.642 357.68L454.089 357.436L460.698 377.486C467.876 373.419 476.254 370.491 485.181 369.25L485.547 369.21C499.212 367.542 504.784 371.752 505.617 378.747C505.719 379.682 505.78 380.78 505.78 381.899C505.78 383.383 505.678 384.827 505.475 386.25L505.495 386.088L505.15 387.511C500.107 386.474 494.311 385.884 488.353 385.884C484.449 385.884 480.585 386.149 476.823 386.637L477.271 386.596C465.029 387.531 454.272 393.225 446.728 401.786L446.687 401.827C442.701 407.277 440.322 414.129 440.322 421.531C440.322 423.849 440.566 426.127 441.014 428.323L440.973 428.099C443.027 439.65 452.97 448.292 464.948 448.292C467.246 448.292 469.482 447.967 471.597 447.377L471.434 447.417C482.761 446.177 492.481 440.199 498.703 431.516L498.785 431.394C498.663 434.241 498.398 436.904 497.971 439.507L498.032 439.121C497.585 441.927 496.934 444.408 496.101 446.807L496.202 446.502L527.823 446.523C527.66 443.432 527.653 440.341 527.803 437.25C528.724 425.591 530.819 408.219 534.086 385.132C534.371 382.936 534.533 380.414 534.533 377.832C534.533 375.107 534.35 372.443 534.005 369.82L534.045 370.125C532.012 353.755 518.083 345.499 497.565 345.784L497.504 345.804ZM593.525 320.325L561.558 332.343L557.308 350.38L545.982 350.909L543.054 375.758H553.424L548.056 414.129C544.721 437.982 548.971 449.227 570.038 449.227C580.632 449.044 590.535 446.279 599.198 441.52L598.873 441.683L602.553 418.806C597.998 421.287 592.691 423.016 587.038 423.626L586.855 423.646C580.571 423.646 579.839 420.352 581.141 411.242L585.94 375.758H607.352C608.125 370.532 610.687 353.471 611.419 350.339H589.437L593.525 320.325Z" fill="white"/>
                                            </g>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="powered-ewards">
                        <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                            <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
                    </div>
                </div>
            </div>
            <Modal
                className='position-absolute top-50 start-50 translate-middle text-center z-3 no-account-found-modal'
                open={open}
                onCancel={() => setOpen(false)}
                closable={false}
                width={300}
                footer={null}
                styles={{
                    content: {
                        padding: "20px",
                        height: "200px",
                        display: "flex",
                        alignItems: "center"
                    }
                }}
            >
                <img
                    className='position-absolute start-50 translate-middle z-3'
                    width={150}
                    src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1727762891/7070631_3432678_1_h3tlz6.svg" alt="" />
                <div className="position-relative error-msg d-flex flex-column gap-2">
                    <span className='fs-5 fw-semibold'>Number Unavailable</span>
                    <p className='fw-normal'>
                    {apiResponse?.message}
                    </p>
                </div>
                <i onClick={()=>setOpen(false)} className='bi bi-x fw-bold fs-2 position-absolute top-0 end-0 me-2'/>
            </Modal>
        </ThemeProvider>
    );
}

export default Home;