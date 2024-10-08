import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate, useParams} from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import AuthUser from './AuthUser';
const Home = () => {
    const { merchant_base } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const { http, setToken } = AuthUser();
    const { getToken } = AuthUser();
    const navigate = useNavigate();
    const [merchant_id , setMerchantId] = useState([]);
    const [merchantid , setMerchantid] = useState([]);
    const [bannerImages, setBannerImages] = useState([]);
    const [merchantDetails, setMerchantDetails] = useState({});
    const token = getToken();
    
    useEffect(() => {
        axios.get('/api/onepage/' + merchant_base)
            .then(response => {
                setData(response.data.data);
                setMerchantId(response.data.merchant_id);
                setMerchantid(response.data.api_header);
                setBannerImages(response.data.data.banners.banner_image);
                setMerchantDetails(response.data.data.merchant_details);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [merchant_base,token, navigate]);

    const handlePhoneChange = (event) => {
        const { value } = event.target;
        setMobile(value); // Updates the state with the phone number
    };
    const handlePhoneChange_otp = (event) => {
        const { value } = event.target;
        setOtp(value); // Updates the state with the phone number
    };
    const handleButtonClick = async () => {
        try {
            const response = await axios.post('/api/websiteLogin', {
                mobile,
                merchant_id,  // Assuming this is the same as the merchant_id prop
                merchantid
            });
            setApiResponse(response.data);
            console.log('API Response:', response.data);
        } catch (error) {
            console.error('Error making API call:', error);
        }
    };

    const handleInputChange_verify = (e) => {
        setOtp(e.target.value);
    };

    const handleButtonClick_verify = async () => {
        try {
            const response = await axios.post('/api/onePageLoginOtpVerifyNew', {
                mobile,
                merchant_id,  // Assuming this is the same as the merchant_id prop
                merchantid,
                otp
            });
            if (response && response.data && response.data.message && response.data.message.original) {
                console.log('API Response:', response.data);
                setToken(response.data.message.original.access_token,'ytfty');
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('Error making API call:', error);
        }
    };

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
        <div className='onepage-main-body'>
            <div className='onepage-set-body'>
                <div className='onepage-set-body'>
                    <div className='banner-part-main'>
                        <div className='banner-part'>
                            <Slider {...settings}>
                                {bannerImages.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`Banner ${index + 1}`} />
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
                            <div className='login-part-otp'>
                                <p>Please enter your mobile number</p>
                                <div className='login-part-input'>
                                {/* <IntlTelInput
                                        containerClassName="intl-tel-input"
                                        inputClassName="form-control"
                                        value={mobile}
                                        onPhoneNumberChange={handlePhoneChange}
                                        separateDialCode={true} 
                                    /> */}
                                    <input className='form-control' type="text" value={mobile} onChange={handlePhoneChange} placeholder="Enter Mobile Number" />
                                    <button onClick={handleButtonClick}>Get OTP</button>

                                    <input className='form-control' type="text" placeholder="Enter Mobile Number" value={otp} onChange={handlePhoneChange_otp}  />
                                    <button onClick={handleButtonClick_verify}>Get OTP</button>
                                </div>
                                <h5>[You will receive an OTP]</h5>
                            </div>
                        </div>
                        <div className='socail-linkppart'>
                            <div className="sl-details-body">
                                <p>Connect with us on:</p>
                                <div className="sl-details-body-part">
                                    {/* Facebook Icon */}
                                    <a href="http://menu.myewards.in/edit_outlet_ebill/15" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                            <path d="M15.4366 20.895C13.5669 21.5243 11.5458 21.5443 9.66404 20.952C7.78229 20.3597 6.13692 19.1858 4.96469 17.5991C3.79246 16.0124 3.1538 14.0947 3.14059 12.122C3.12738 10.1492 3.74032 8.22319 4.8912 6.62093C6.04209 5.01867 7.67159 3.8228 9.54524 3.20539C11.4189 2.58798 13.4401 2.58086 15.3181 3.18505C17.196 3.78925 18.8339 4.97361 19.9961 6.56773C21.1582 8.16185 21.7847 10.0835 21.7854 12.0563C21.7552 12.8125 21.6637 13.565 21.5116 14.3063" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M14.6604 19.1625C13.9897 19.9245 13.2545 20.6271 12.4629 21.2625" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M12.4629 2.625C14.9793 4.82359 16.5364 7.91894 16.8016 11.25C16.8561 11.8547 16.8674 12.4625 16.8354 13.0687" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M12.4629 2.625C11.0975 3.81505 10.0006 5.28165 9.24489 6.92762C8.48914 8.57359 8.09177 10.3614 8.0791 12.1725C8.0791 18.2475 10.8091 20.0475 12.4516 21.2625" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M4.35156 7.46252H20.6191" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M12.4629 2.62134V21.2626" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M4.60669 17.0549H14.3529" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M3.14038 12.1725L21.7854 11.9437" stroke="#0B0B59" strokeWidth="1.17188"/>
                                            <path d="M20.5515 21.3751L22.2128 19.7101L19.2128 16.7101L20.919 15.6188C20.9439 15.6041 20.9637 15.5822 20.9758 15.556C20.988 15.5298 20.9919 15.5005 20.987 15.4721C20.9821 15.4436 20.9687 15.4173 20.9485 15.3966C20.9284 15.3759 20.9024 15.3619 20.874 15.3563L15.1403 14.0138C15.1166 14.009 15.0921 14.0101 15.069 14.0171C15.0458 14.024 15.0248 14.0366 15.0077 14.0537C14.9906 14.0708 14.978 14.0918 14.971 14.115C14.9641 14.1381 14.963 14.1626 14.9678 14.1863L16.2128 20.0288C16.2188 20.0572 16.2331 20.0832 16.2539 20.1034C16.2747 20.1237 16.301 20.1373 16.3296 20.1425C16.3581 20.1477 16.3876 20.1444 16.4142 20.1328C16.4408 20.1212 16.4634 20.102 16.479 20.0776L17.5515 18.3751L20.5515 21.3751Z" stroke="#0B0B59" strokeWidth="1.17188"/>
                                        </svg>
                                    </a>

                                    {/* Twitter Icon */}
                                    <a href="http://menu.myewards.in/edit_outlet_ebill/15" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <path d="M15.5829 5.32003H17.4629V2.14003C16.5526 2.04538 15.638 1.99865 14.7229 2.00003C12.0029 2.00003 10.1429 3.66003 10.1429 6.70003V9.32003H7.07288V12.88H10.1429V22H13.8229V12.88H16.8829L17.3429 9.32003H13.8229V7.05003C13.8229 6.00003 14.1029 5.32003 15.5829 5.32003Z" fill="#0B0B59"/>
                                        </svg>
                                    </a>

                                    {/* Instagram Icon */}
                                    <a href="http://menu.myewards.in/edit_outlet_ebill/15" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <path d="M17.8029 5.46C17.5656 5.46 17.3335 5.53038 17.1362 5.66224C16.9389 5.79409 16.7851 5.98151 16.6942 6.20078C16.6034 6.42005 16.5796 6.66133 16.6259 6.89411C16.6722 7.12689 16.7865 7.34071 16.9544 7.50853C17.1222 7.67635 17.336 7.79064 17.5688 7.83694C17.8016 7.88324 18.0428 7.85948 18.2621 7.76866C18.4814 7.67783 18.6688 7.52402 18.8007 7.32668C18.9325 7.12935 19.0029 6.89734 19.0029 6.66C19.0029 6.34174 18.8765 6.03652 18.6514 5.81147C18.4264 5.58643 18.1212 5.46 17.8029 5.46ZM22.4029 7.88C22.3834 7.0503 22.228 6.2294 21.9429 5.45C21.6886 4.78313 21.2929 4.17928 20.7829 3.68C20.2877 3.16743 19.6824 2.77418 19.0129 2.53C18.2355 2.23616 17.4137 2.07721 16.5829 2.06C15.5229 2 15.1829 2 12.4629 2C9.74289 2 9.40289 2 8.34289 2.06C7.51204 2.07721 6.69023 2.23616 5.91289 2.53C5.24457 2.77665 4.63982 3.16956 4.14289 3.68C3.63032 4.17518 3.23707 4.78044 2.99289 5.45C2.69905 6.22734 2.5401 7.04915 2.52289 7.88C2.46289 8.94 2.46289 9.28 2.46289 12C2.46289 14.72 2.46289 15.06 2.52289 16.12C2.5401 16.9508 2.69905 17.7727 2.99289 18.55C3.23707 19.2196 3.63032 19.8248 4.14289 20.32C4.63982 20.8304 5.24457 21.2234 5.91289 21.47C6.69023 21.7638 7.51204 21.9228 8.34289 21.94C9.40289 22 9.74289 22 12.4629 22C15.1829 22 15.5229 22 16.5829 21.94C17.4137 21.9228 18.2355 21.7638 19.0129 21.47C19.6824 21.2258 20.2877 20.8326 20.7829 20.32C21.2951 19.8226 21.6912 19.2182 21.9429 18.55C22.228 17.7706 22.3834 16.9497 22.4029 16.12C22.4029 15.06 22.4629 14.72 22.4629 12C22.4629 9.28 22.4629 8.94 22.4029 7.88ZM20.6029 16C20.5956 16.6348 20.4806 17.2637 20.2629 17.86C20.1032 18.2952 19.8468 18.6884 19.5129 19.01C19.1885 19.3405 18.7961 19.5964 18.3629 19.76C17.7666 19.9778 17.1377 20.0927 16.5029 20.1C15.5029 20.15 15.1329 20.16 12.5029 20.16C9.87289 20.16 9.50289 20.16 8.50289 20.1C7.84378 20.1123 7.18749 20.0109 6.56289 19.8C6.14867 19.6281 5.77425 19.3728 5.46289 19.05C5.13098 18.7287 4.87773 18.3352 4.72289 17.9C4.47875 17.2952 4.34333 16.6519 4.32289 16C4.32289 15 4.26289 14.63 4.26289 12C4.26289 9.37 4.26289 9 4.32289 8C4.32737 7.35106 4.44584 6.70795 4.67289 6.1C4.84894 5.67791 5.11916 5.30166 5.46289 5C5.7667 4.65617 6.14218 4.3831 6.56289 4.2C7.17244 3.98004 7.81489 3.86508 8.46289 3.86C9.46289 3.86 9.83289 3.8 12.4629 3.8C15.0929 3.8 15.4629 3.8 16.4629 3.86C17.0977 3.86728 17.7266 3.98225 18.3229 4.2C18.7773 4.36865 19.1852 4.64285 19.5129 5C19.8406 5.30718 20.0967 5.68273 20.2629 6.1C20.4851 6.70893 20.6002 7.35178 20.6029 8C20.6529 9 20.6629 9.37 20.6629 12C20.6629 14.63 20.6529 15 20.6029 16ZM12.4629 6.87C11.4487 6.87198 10.4579 7.17453 9.61555 7.73942C8.77324 8.30431 8.11727 9.1062 7.73052 10.0438C7.34378 10.9813 7.24361 12.0125 7.44268 13.0069C7.64175 14.0014 8.13113 14.9145 8.84897 15.631C9.56681 16.3474 10.4809 16.835 11.4757 17.0321C12.4706 17.2293 13.5016 17.1271 14.4384 16.7385C15.3752 16.35 16.1758 15.6924 16.739 14.849C17.3023 14.0056 17.6029 13.0142 17.6029 12C17.6042 11.3251 17.4721 10.6566 17.2141 10.033C16.9562 9.40931 16.5774 8.84281 16.0998 8.36605C15.6221 7.88929 15.0548 7.51168 14.4307 7.25493C13.8065 6.99818 13.1378 6.86736 12.4629 6.87ZM12.4629 15.33C11.8043 15.33 11.1605 15.1347 10.6128 14.7688C10.0652 14.4029 9.63841 13.8828 9.38637 13.2743C9.13433 12.6659 9.06839 11.9963 9.19688 11.3503C9.32536 10.7044 9.64252 10.111 10.1082 9.64533C10.5739 9.17963 11.1673 8.86247 11.8132 8.73398C12.4592 8.6055 13.1287 8.67144 13.7372 8.92348C14.3457 9.17552 14.8658 9.60234 15.2317 10.15C15.5976 10.6976 15.7929 11.3414 15.7929 12C15.7929 12.4373 15.7068 12.8703 15.5394 13.2743C15.3721 13.6784 15.1268 14.0454 14.8176 14.3547C14.5083 14.6639 14.1412 14.9092 13.7372 15.0765C13.3332 15.2439 12.9002 15.33 12.4629 15.33Z" fill="#0B0B59"/>
                                        </svg>
                                    </a>
                                    <a href="http://menu.myewards.in/edit_outlet_ebill/15" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                            <path d="M23.4629 9.70998C23.5124 8.27864 23.1993 6.858 22.5529 5.57998C22.1143 5.05558 21.5056 4.70169 20.8329 4.57998C18.0504 4.32751 15.2564 4.22403 12.4629 4.26998C9.67956 4.22194 6.89563 4.32208 4.12292 4.56998C3.57474 4.6697 3.06744 4.92683 2.66292 5.30998C1.76292 6.13998 1.66292 7.55998 1.56292 8.75998C1.41783 10.9175 1.41783 13.0824 1.56292 15.24C1.59185 15.9154 1.69241 16.5858 1.86292 17.24C1.98349 17.745 2.22744 18.2123 2.57292 18.6C2.98019 19.0034 3.4993 19.2752 4.06292 19.38C6.21883 19.6461 8.39114 19.7564 10.5629 19.71C14.0629 19.76 17.1329 19.71 20.7629 19.43C21.3404 19.3316 21.8741 19.0595 22.2929 18.65C22.5729 18.3699 22.782 18.0271 22.9029 17.65C23.2605 16.5526 23.4362 15.4041 23.4229 14.25C23.4629 13.69 23.4629 10.31 23.4629 9.70998ZM10.2029 14.85V8.65998L16.1229 11.77C14.4629 12.69 12.2729 13.73 10.2029 14.85Z" fill="#0B0B59"/>
                                        </svg>
                                    </a>
                                    <a href="http://menu.myewards.in/edit_outlet_ebill/15" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <path d="M22.4629 5.79997C21.7112 6.12606 20.9163 6.34163 20.1029 6.43997C20.9611 5.92729 21.6042 5.12075 21.9129 4.16997C21.1064 4.65003 20.2237 4.98826 19.3029 5.16997C18.6874 4.50254 17.8679 4.05826 16.9727 3.90682C16.0775 3.75537 15.1574 3.90532 14.3567 4.33315C13.5559 4.76099 12.9198 5.4425 12.5481 6.2708C12.1764 7.09911 12.0902 8.02736 12.3029 8.90997C10.6723 8.82749 9.07733 8.40292 7.62155 7.66383C6.16576 6.92474 4.88174 5.88766 3.85289 4.61997C3.49203 5.25013 3.30241 5.96379 3.30289 6.68997C3.30161 7.36435 3.46711 8.02858 3.78465 8.62353C4.10218 9.21848 4.56191 9.72568 5.12289 10.1C4.47087 10.0822 3.83278 9.90726 3.26289 9.58997V9.63997C3.26778 10.5849 3.59888 11.4991 4.20021 12.2279C4.80153 12.9568 5.63615 13.4556 6.56289 13.64C6.20615 13.7485 5.83577 13.8058 5.46289 13.81C5.20478 13.807 4.94731 13.7835 4.69289 13.74C4.9568 14.5528 5.46751 15.2631 6.15397 15.7721C6.84042 16.2811 7.66847 16.5635 8.52289 16.58C7.08009 17.7152 5.29877 18.3348 3.46289 18.34C3.12863 18.3411 2.79463 18.321 2.46289 18.28C4.33732 19.4902 6.5217 20.1327 8.75289 20.13C10.2926 20.146 11.82 19.855 13.246 19.274C14.672 18.6931 15.9679 17.8338 17.0581 16.7465C18.1483 15.6591 19.0109 14.3654 19.5954 12.9409C20.18 11.5164 20.4749 9.98969 20.4629 8.44997C20.4629 8.27996 20.4629 8.09997 20.4629 7.91997C21.2476 7.33478 21.9244 6.61739 22.4629 5.79997Z" fill="#0B0B59"/>
                                        </svg>
                                    </a>
                                    <a href="http://menu.myewards.in/edit_outlet_ebill/15" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                            <path d="M17.0629 14C16.8629 13.9 15.5629 13.3 15.3629 13.2C15.1629 13.1 14.9629 13.1 14.7629 13.3C14.5629 13.5 14.1629 14.1 13.9629 14.3C13.8629 14.5 13.6629 14.5 13.4629 14.4C12.7629 14.1 12.0629 13.7 11.4629 13.2C10.9629 12.7 10.4629 12.1 10.0629 11.5C9.96289 11.3 10.0629 11.1 10.1629 11C10.2629 10.9 10.3629 10.7 10.5629 10.6C10.6629 10.5 10.7629 10.3 10.7629 10.2C10.8629 10.1 10.8629 9.89998 10.7629 9.79998C10.6629 9.69998 10.1629 8.49998 9.96289 7.99998C9.86289 7.29998 9.66289 7.29998 9.46289 7.29998H8.96289C8.76289 7.29998 8.46289 7.49998 8.36289 7.59998C7.76289 8.19998 7.46289 8.89998 7.46289 9.69998C7.56289 10.6 7.86289 11.5 8.46289 12.3C9.56289 13.9 10.9629 15.2 12.6629 16C13.1629 16.2 13.5629 16.4 14.0629 16.5C14.5629 16.7 15.0629 16.7 15.6629 16.6C16.3629 16.5 16.9629 16 17.3629 15.4C17.5629 15 17.5629 14.6 17.4629 14.2L17.0629 14ZM19.5629 4.89998C15.6629 0.999976 9.36289 0.999976 5.46289 4.89998C2.26289 8.09998 1.66289 13 3.86289 16.9L2.46289 22L7.76289 20.6C9.26289 21.4 10.8629 21.8 12.4629 21.8C17.9629 21.8 22.3629 17.4 22.3629 11.9C22.4629 9.29997 21.3629 6.79998 19.5629 4.89998ZM16.8629 18.9C15.5629 19.7 14.0629 20.2 12.4629 20.2C10.9629 20.2 9.56289 19.8 8.26289 19.1L7.96289 18.9L4.86289 19.7L5.66289 16.7L5.46289 16.4C3.06289 12.4 4.26289 7.39998 8.16289 4.89998C12.0629 2.39998 17.0629 3.69998 19.4629 7.49998C21.8629 11.4 20.7629 16.5 16.8629 18.9Z" fill="#0B0B59"/>
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
    );
}

export default Home;
