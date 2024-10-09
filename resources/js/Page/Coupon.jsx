import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import axiosSetup from '@/axiosSetup';

function Coupon() {
    const [activeTab, setActiveTab] = useState('coupon');
    const [couponData, setCouponData] = useState([]);
    const [couponholdData, setCouponholdData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/couponscart', [])
                .then(response => {
                    setCouponData(response.data.data.couponcart);
                    setLoading(false)
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setLoading(false)
                    // setError(error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/couponhold', [])
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
                            <Link to={"/Home"}>
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
                    <ActiveCoupons data={couponData} loading={loading} />
                </div>
                <div className={`tab-content ${activeTab === 'on-hold' ? '' : 'hidden'}`}>
                    <HoldOnCoupons data={couponholdData} loading={loading} />
                </div>
            </div>
        </div>
    )
}

export default Coupon
// Active Coupon
function ActiveCoupons({ data, loading }) {
    const [open, setOpen] = useState(false);
    const [couponDesc, setCouponDesc] = useState({});
    const [dataLoading, setDataLoading] = useState(true)
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
        const token = localStorage.getItem('access_token');
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
                    setDataLoading(false)
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setDataLoading(false)
                });
        } else {
            console.log('No token available, API call skipped');
        }
    };

    return (
        <>
            <div className={`inner-container`}>
                {loading
                    ? ([...new Array(6)].map((i, iIndex) => <div key={iIndex} className="coupons p-1">
                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                            <div className="coupon-info h-100">
                                <div className="icon pb-1">
                                    <Skeleton style={{ height: "80px", width: "95px" }} />
                                </div>
                                <div className="details">
                                    <div className="coupon-expire-date">
                                        <Skeleton style={{ height: "15px", width: "95px" }} />
                                    </div>
                                    <div className="coupon-name">
                                        <Skeleton style={{ height: "15px", width: "100%" }} />
                                    </div>
                                    <div className="coupon-limit">
                                        <span>
                                            <Skeleton className='ms-2' style={{ height: "10px", width: "50px" }} />
                                        </span>
                                    </div>
                                    <div className="coupon-action">
                                        <div className="coupon-code">
                                            <Skeleton className='ms-2' style={{ height: "10px", width: "55px" }} />
                                        </div>
                                        <div className="view-coupon">
                                            <Skeleton style={{ height: "20px", width: "55px" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SkeletonTheme>
                    </div>))
                    :
                    (data?.length > 0
                        ? data.map((coupon, index) => (
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
                            </div>))
                        : <div className="no-coupons">
                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1728450813/telescope_no_results_found_concept-ai_1_qkyrm5.svg" alt="" />
                            <p>No Coupons Available</p>
                        </div>
                    )
                }
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <CouponDescDrawer
                open={open}
                couponCartData={couponDesc}
                setOpen={setOpen}
                setDataLoading={setDataLoading}
                dataLoading={dataLoading}
            />
        </>
    )
}
// Hold-on Coupon Component
function HoldOnCoupons({ data, loading }) {
    const [open, setOpen] = useState(false);
    const [couponholdDesc, setCouponholdDesc] = useState({});
    const [dataLoading, setDataLoading] = useState(true)
    const handleDrawer = (coupon) => {
        const token = localStorage.getItem('access_token');
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
                    setDataLoading(false)
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setDataLoading(false)
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
                {loading
                    ? ([...new Array(6)].map((i, iIndex) => <div key={iIndex} className="coupons p-1">
                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                            <div className="coupon-info h-100">
                                <div className="icon pb-1">

                                    <Skeleton style={{ height: "80px", width: "95px" }} />

                                </div>
                                <div className="details">
                                    <div className="coupon-expire-date">

                                        <Skeleton style={{ height: "15px", width: "95px" }} />

                                    </div>
                                    <div className="coupon-name">

                                        <Skeleton style={{ height: "15px", width: "100%" }} />

                                    </div>
                                    <div className="coupon-limit">
                                        <span>

                                            <Skeleton className='ms-2' style={{ height: "10px", width: "50px" }} />

                                        </span>
                                    </div>
                                    <div className="coupon-action">
                                        <div className="coupon-code">

                                            <Skeleton className='ms-2' style={{ height: "10px", width: "55px" }} />

                                        </div>
                                        <div className="view-coupon">

                                            <Skeleton style={{ height: "20px", width: "55px" }} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SkeletonTheme>
                    </div>))
                    : (data?.length > 0
                        ? data.map((couponhold, index) => (
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
                        : <div className="no-coupons">
                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1728450813/telescope_no_results_found_concept-ai_1_qkyrm5.svg" alt="" />
                            <p>No Coupons Available</p>
                        </div>
                    )
                }

            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <CouponDescDrawer open={open} onHoldCouponData={couponholdDesc} setOpen={setOpen}
                setDataLoading={setDataLoading}
                dataLoading={dataLoading} />
        </>
    )
}

function CouponDescDrawer({ open, couponCartData, onHoldCouponData, setOpen, dataLoading, setDataLoading }) {
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
            <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                <div className="drawer-content">
                    <div className="drawer-upper">
                        <div className="drawer-upper-left">
                            <img src="https://i.imgur.com/3iASiG8.png" alt="Coupon" />
                            {
                                dataLoading
                                    ?

                                    <Skeleton style={{ height: "20px", width: "100%" }} />

                                    : <div className="code">
                                        {coupon?.token_code || 'No Code Available'}
                                    </div>

                            }
                        </div>
                        <div className="drawer-upper-right">
                            {dataLoading
                                ? <div className="d-flex justify-content-end">

                                    <Skeleton style={{ height: "10px", width: "60px" }} />

                                </div>
                                : <div className="cDate">
                                    valid till <span>{formatDate(coupon?.token_valide) || 'No Date Available'}</span>
                                </div>
                            }

                            {dataLoading
                                ?
                                <Skeleton className='ms-2' style={{ height: "20px", width: "90%" }} />

                                : <div className="cName">{coupon?.name || 'No Name Available'}</div>
                            }
                        </div>
                    </div>
                    <div className="drawer-middle">
                        {dataLoading
                            ?
                            <Skeleton className='mx-1' style={{ height: "20px", width: "100%" }} />

                            :
                            <>
                                <div className="cLimit">Uses <span>{coupon?.use_limit || 'No Limit Available'}</span></div>
                                <div className="cDateDesc">
                                    <div className="dateLeft">{coupon?.token_valid_on || ''}</div>
                                    <div className="dateRight">{coupon?.timing || ''}</div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="drawer-below">
                        <h4>Terms & Conditions</h4>
                        {
                            dataLoading ?
                                <>
                                    <Skeleton className='mb-1' style={{ height: "20px", width: "100%" }} />
                                    <Skeleton className='mb-1' style={{ height: "20px", width: "90%" }} />
                                    <Skeleton className='mb-1' style={{ height: "20px", width: "80%" }} />
                                    <Skeleton className='mb-1' style={{ height: "20px", width: "70%" }} />
                                </>

                                : <p>{coupon?.terms || 'No Date Available'}</p>
                        }
                    </div>
                    <div className="exit-btn" onClick={() => { setOpen(false), setDataLoading(true) }}>
                        <i className='bi bi-x' />
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    );
}