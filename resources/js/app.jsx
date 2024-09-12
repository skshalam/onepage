import './bootstrap';
import '../css/app.css';
import '../css/style.css';
import '../css/fonts.css';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath,useNavigate} from 'react-router-dom';
import Home from './Page/Home';
import About from './Page/About';
import Coupon from './Page/Coupon';
import GiftCard from './Page/GiftCard';
import Reward from './Page/Reward';
import MemberShipPackage from './Page/MemberShipPackage';

const App = () => {
    const location = useLocation();
    const match = matchPath('/onePageWebsite/:merchant_base', location.pathname);
    const merchant_base = match?.params?.merchant_base;
    const [merchantBase, setMerchantBase] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (match) {
            const { merchant_base } = match.params;
            setMerchantBase(merchant_base);
            localStorage.setItem('merchant_base', merchant_base); // Store in session storage
        }
    }, [match]);

    useEffect(() => {
            const token = sessionStorage.getItem('access_token');
            const storedMerchantBase = localStorage.getItem('merchant_base');
            const url = `/onePageWebsite/${storedMerchantBase}`;
            console.log('set-path:', location.pathname);
            if (!token && location.pathname === url) {
                console.log('Token exists, user is authenticated.');
                navigate(url);
            }
            else if(!token && location.pathname !== url){
                navigate(url);
                console.log("demo");
            }
            else {
                if(location.pathname !== url){
                    console.log("hhhhh22");
                    navigate(location.pathname);
                }else{
                    console.log("hhhhh");
                    navigate(-1);
                }
            }
    },[navigate]);

    

    return (
        <Routes>
            {/* Route for the specific URL /onePageWebsite/15657 */}
            <Route path="/onePageWebsite/:merchant_base" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Coupon" element={<Coupon />} />
            <Route path="/Giftcard" element={<GiftCard />} />
            <Route path="/Reward" element={<Reward />} />
            <Route path="/Membership" element={<MemberShipPackage />} />
        </Routes>
    );
};

ReactDOM.createRoot(document.getElementById('app')).render(
    <Router>
        <App />
    </Router>
);
