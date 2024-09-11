// authRedirect.js
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const storedMerchantBase = localStorage.getItem('merchant_base');
    const url = `/onePageWebsite/${storedMerchantBase}`;

    const checkAuthAndRedirect = () => {
    
        if (!token) {
            // Token exists, do nothing or handle accordingly
            console.log('Token exists, user is authenticated.');
            navigate(url);
        } else {
            if(location.pathname !== url){
                navigate(location.pathname);
            }else{
                navigate(-1);
            }
        }
    };

    return { checkAuthAndRedirect };
};

export default useAuthRedirect;
