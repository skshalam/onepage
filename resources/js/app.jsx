import './bootstrap';
import '../css/app.css';
import '../css/style.css';
import '../css/fonts.css';

import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath, useNavigate } from 'react-router-dom';
import Home from './Page/Home';
import About from './Page/About';
import Coupon from './Page/Coupon';
import GiftCard from './Page/GiftCard';
import Reward from './Page/Reward';
import MemberShipPackage from './Page/MemberShipPackage';
import MembershipDetails from './Page/MembershipDetails';
import Wallet from './Page/Wallet';
import CreditWallet from './Page/CreditWallet';
import Profile from './Page/Profile';
import MyAcount from './Page/MyAcount';
import TermsAndCondition from './Page/TermsAndCondition';
import Contact from './Page/Contact';
import Referal from './Page/Referal';
import ReferalList from './Page/ReferalList';
import AboutUs from './Page/AboutUs';
import Bookletissue_details from './Page/Bookletissue_details';
import 'react-loading-skeleton/dist/skeleton.css'
import axios from 'axios';
import { ThemeProvider } from './Providers/ContextProviders/ThemeProvider';
import ThemeContext from './Providers/Contexts/ThemeContext';
import axiosSetup from '@/axiosSetup';

const App = () => {
    const location = useLocation();
    const match = matchPath('/onePageWebsite/:merchant_base', location.pathname);
    const merchant_base = match?.params?.merchant_base;
    const [merchantBase, setMerchantBase] = useState(null);
    const navigate = useNavigate();
    const {useThemeStyles,setUseThemeStyles} = useContext(ThemeContext);
    useEffect(() => {
        if (match) {
            const { merchant_base } = match.params;
            setMerchantBase(merchant_base);
            sessionStorage.setItem('merchant_base', merchant_base); // Store in session storage
        }
    }, [match]);
    
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedMerchantBase = sessionStorage.getItem('merchant_base');
        const url = `/onePageWebsite/${storedMerchantBase}`;
        console.log('set-path:', location.pathname);
        if (!token && location.pathname === url) {
            // console.log('Token exists, user is authenticated.');
            navigate(url);
        }
        else if (!token && location.pathname !== url) {
            navigate(url);
            // console.log("demo");
        }
        else {
            if (location.pathname !== url) {
                // console.log("hhhhh22");
                navigate(location.pathname);
            } else {
                // console.log("hhhhh");
                navigate(-1);
            }
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.get(`/api/themecolor`)
            .then(res => {
                setUseThemeStyles(res?.data?.data?.theme);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [merchant_base])

    return (
        <Routes>
            {/* Route for the specific URL /onePageWebsite/15657 */}
            <Route path="/onePageWebsite/:merchant_base" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Coupon" element={<Coupon />} />
            <Route path="/Giftcard" element={<GiftCard />} />
            <Route path="/Reward" element={<Reward />} />
            <Route path="/Membership" element={<MemberShipPackage />} />
            <Route path="/Membership/:membership_id" element={<MembershipDetails />} />
            <Route path="/Wallet" element={<Wallet />} />
            <Route path="/Creditwallet" element={<CreditWallet />} />
            <Route path="/userProfile" element={<Profile />} />
            <Route path="/Myaccount" element={<MyAcount />} />
            <Route path="/T&c" element={<TermsAndCondition />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Referal" element={<Referal />} />
            <Route path="/Referallist" element={<ReferalList />} />
            <Route path="/Aboutus" element={<AboutUs />} />
            <Route path="/Bookletissue_details/:membership_id/:bookletissue_id" element={<Bookletissue_details />} />
        </Routes>
    );
};

ReactDOM.createRoot(document.getElementById('app')).render(
    <ThemeProvider>
        <Router>
            <App />
        </Router>
    </ThemeProvider>
);
