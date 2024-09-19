import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';
function Coupon() {
    const [activeTab, setActiveTab] = useState('coupon');
    const [couponData, setCouponData] = useState([]);
    const [couponholdData, setCouponholdData] = useState([]);
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        console.log('Token:', token);
        if (token) {
            axios.post('/api/couponscart', [], {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setCouponData(response.data.data.couponcart);
            })
            .catch(error => {
                console.error('API Error:', error);
                // setError(error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        console.log('Token:', token);
        if (token) {
            axios.post('/api/couponhold', [],{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setCouponholdData(response.data.data.onHoldCoupons);
            })
            .catch(error => {
                console.error('API Error:', error);
                // setError(error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
    return (
        <div className='onepage-main-body'>
            <div className='onepage-set-body'>
                <div className="sticky-top">
                    <div className="navHeader">
                        <div className="prev-btn">
                            <Link to={"/About"}>
                                <i className="bi bi-chevron-left"></i>
                            </Link>
                            <span>MY COUPONS</span>
                        </div>
                    </div>
                    <div className="toggle-coupon">
                        <div className={`tabs ${activeTab === 'coupon' ? 'active' : ''}`} onClick={() => setActiveTab('coupon')}>
                            <span>Active Coupons</span>
                        </div>
                        <div className={`tabs ${activeTab === 'on-hold' ? 'active' : ''}`} onClick={() => setActiveTab('on-hold')}>
                            <span>On-Hold Coupons</span>
                        </div>
                    </div>
                </div>
                <div className={`tab-content ${activeTab === 'coupon' ? '' : 'hidden'}`}>
                    <ActiveCoupons data={couponData} />
                </div>
                <div className={`tab-content ${activeTab === 'on-hold' ? '' : 'hidden'}`}>
                    <HoldOnCoupons data={couponholdData} />
                </div>
            </div>
        </div>
    )
}

export default Coupon
// Active Coupon
function ActiveCoupons({ data }) {
    const [open, setOpen] = useState(false);
    const [couponDesc, setCouponDesc] = useState({});
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No Date Available';
        
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const daySuffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${daySuffix(day)} ${month}, ${year}`;
    };
    const handleDrawer = (coupon) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            // API call to fetch coupon details based on token_id
            axios.post('/api/couponscart', 
            {
                token_id: coupon.token_id // Send token_id in the payload
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // Set coupon details after the response
                setCouponDesc(response.data.data); // Assuming response contains the data for the specific coupon
                setOpen(true);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    };
    return (
        <>
            <div className={`inner-container`}>
                {data?.length > 0 ? (
                    data.map((coupon, index)=>(
                        <div key={index} className="coupons p-1">
                            <div className="coupon-info h-100">
                                <div className="icon">
                                    <img src="https://i.imgur.com/3iASiG8.png" alt="Coupon" />
                                </div>
                                <div className="details">
                                    <div className="coupon-expire-date">
                                        <span>Valid till {formatDate(coupon.token_valide)}</span>
                                    </div>
                                    <div className="coupon-name">
                                        <span>{coupon.name}</span>
                                    </div>
                                    <div className="coupon-limit">
                                        <span>Uses: <span>{coupon.use_limit}</span></span>
                                    </div>
                                    <div className="coupon-action">
                                        <div className="coupon-code">
                                            CODE: <span>{coupon.token_code}</span>
                                        </div>
                                        <div className="view-coupon">
                                            <button onClick={() => { handleDrawer(coupon), setOpen(!open) }}>View Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-coupons">
                        <p>No Coupons Available</p>
                    </div>
                )}
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <CouponDescDrawer open={open} couponCartData={couponDesc} setOpen={setOpen} />
        </>
    )
}
// Hold-on Coupon Component
function HoldOnCoupons({ data }) {
    const [open, setOpen] = useState(false);
    const [couponholdDesc, setCouponholdDesc] = useState({});

    // const handleDrawer = (data) => {
    //     setCouponholdDesc(data)
    // }
    const handleDrawer = (coupon) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            // API call to fetch coupon details based on token_id
            axios.post('/api/couponhold', 
            {
                token_id: coupon.token_id // Send token_id in the payload
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // Set coupon details after the response
                setCouponholdDesc(response.data.data); // Assuming response contains the data for the specific coupon
                setOpen(true);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    };
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No Date Available';
        
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const daySuffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${daySuffix(day)} ${month}, ${year}`;
    };
    return (
        <>
            <div className={`inner-container`}>
            {data?.length > 0 ? (
                    data.map((couponhold, index)=>(
                        <div key={index} className="coupons p-1">
                            <div className="coupon-info h-100">
                                <div className="icon">
                                    <img src="https://i.imgur.com/3iASiG8.png" alt="Coupon" />
                                </div>
                                <div className="details">
                                    <div className="coupon-expire-date">
                                        <span>Valid till {formatDate(couponhold.token_valide)}</span>
                                    </div>
                                    <div className="coupon-name">
                                        <span>{couponhold.name}</span>
                                    </div>
                                    <div className="coupon-limit">
                                        <span>Uses: <span>{couponhold.use_limit}</span></span>
                                    </div>
                                    <div className="coupon-action">
                                        <div className="coupon-code">
                                            CODE: <span>{couponhold.token_code}</span>
                                        </div>
                                        <div className="view-coupon">
                                            <button onClick={() => { handleDrawer(couponhold), setOpen(!open) }}>View Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-coupons">
                        <p>No Coupons Available</p>
                    </div>
                )}
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <CouponDescDrawer open={open} onHoldCouponData={couponholdDesc} setOpen={setOpen} />
        </>
    )
}

// Coupon Description Drawer
// function CouponDescDrawer(event) {
//     return (
//         <div className={`cust-drawer ${event.open ? "show" : ""}`}>
//             <div className={`exit-drawer ${event.open ? "" : "hide"}`} onClick={() => event.setOpen(false)} />
//             <div className="drawer-content">
//                 <div className="drawer-upper">
//                     <div className="drawer-upper-left">
//                         <img src="https://i.imgur.com/3iASiG8.png" alt="" />
//                         <div className="code">{event?.cData?.couponCode}</div>
//                     </div>
//                     <div className="drawer-upper-right">
//                         <div className="cDate">valid till <span>{event?.cData?.couponExpiry}</span></div>
//                         <div className="cName">{event?.cData?.couponName}</div>
//                     </div>
//                 </div>
//                 <div className="drawer-middle">
//                     <div className="cLimit">Uses <span>2/4</span></div>
//                     <div className="cDateDesc">
//                         <div className="dateLeft">Sun, Mon, Tue, Wed, Fri</div>
//                         <div className="dateRight">12:00 A.M to 5:00 P.M</div>
//                     </div>
//                 </div>
//                 <div className="drawer-below">
//                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, culpa quod. Quia velit deserunt quidem voluptatibus obcaecati maxime nulla molestias!
//                 </div>
//                 <div className="exit-btn" onClick={() => event.setOpen(false)}>
//                     <i className='bi bi-x' />
//                 </div>
//             </div>
//         </div>
//     )
// }

function CouponDescDrawer({ open, couponCartData, onHoldCouponData, setOpen }) {
    // Extract the first coupon from the couponcart array if it exists
    // const coupon = cData?.couponcart?.[0] || {};
    const coupon = couponCartData?.couponcart?.[0] || onHoldCouponData?.onHoldCoupons?.[0] || {};
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No Date Available';
        
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const daySuffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${daySuffix(day)} ${month}, ${year}`;
    };
    return (
        <div className={`cust-drawer ${open ? "show" : ""}`}>
            <div className={`exit-drawer ${open ? "" : "hide"}`} onClick={() => setOpen(false)} />
            <div className="drawer-content">
                <div className="drawer-upper">
                    <div className="drawer-upper-left">
                        <img src="https://i.imgur.com/3iASiG8.png" alt="Coupon" />
                        <div className="code">{coupon?.token_code || 'No Code Available'}</div>
                    </div>
                    <div className="drawer-upper-right">
                        <div className="cDate">valid till <span>{formatDate(coupon?.token_valide) || 'No Date Available'}</span></div>
                        <div className="cName">{coupon?.name || 'No Name Available'}</div>
                    </div>
                </div>
                <div className="drawer-middle">
                    <div className="cLimit">Uses <span>{coupon?.use_limit || 'No Limit Available'}</span></div>
                    <div className="cDateDesc">
                        <div className="dateLeft">{coupon?.token_valid_on || ''}</div>
                        <div className="dateRight">{coupon?.timing || ''}</div>
                    </div>
                </div>
                <div className="drawer-below">
                    <h4>Terms & Conditions</h4>
                    <p>{coupon?.terms || 'No Date Available'}</p>
                </div>
                <div className="exit-btn" onClick={() => setOpen(false)}>
                    <i className='bi bi-x' />
                </div>
            </div>
        </div>
    );
}