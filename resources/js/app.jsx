import './bootstrap';
import '../css/app.css';
import '../css/style.css';
import '../css/fonts.css';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, matchPath} from 'react-router-dom';
import Home from './Page/Home';
import About from './Page/About';
import AuthUser from './Page/AuthUser';

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getToken } = AuthUser();
    const token = getToken();
    const match = matchPath('/onePageWebsite/:merchant_base', location.pathname);
    const merchant_base = match?.params?.merchant_base;
    const [merchantBase, setMerchantBase] = useState(null);
    useEffect(() => {
        if (match) {
            const { merchant_base } = match.params;
            setMerchantBase(merchant_base);
            localStorage.setItem('merchant_base', merchant_base); // Store in session storage
        }
    }, [match]);
    
    useEffect(() => {
        const storedMerchantBase = localStorage.getItem('merchant_base');
        console.log('Stored Merchant Base:', storedMerchantBase);
        if (token) {
            console.log('Token is available:', token);
            navigate('/About');
        } else if (storedMerchantBase) {
            console.log('Token is not available');
            navigate(`/onePageWebsite/${storedMerchantBase}`);
        }
    }, [token, navigate]);

    return (
        <Routes>
            {/* Route for the specific URL /onePageWebsite/15657 */}
            <Route path="/onePageWebsite/:merchant_base" element={<Home />} />
            <Route path="/About" element={<About />} />
        </Routes>
    );
};

ReactDOM.createRoot(document.getElementById('app')).render(
    <Router>
        <App />
    </Router>
);
