import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';

function coupon_booklet() {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [rewardsData, setrewardsData] = useState([]);
    const [rewardsDesc, setRewardsDesc] = useState({});
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
    const { membership_id } = useParams();
    const { bookletissue_id } = useParams();
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        console.log('Token:', token);
        if (token) {
            axios.post('/api/bookletcoupon', 
                {
                    membership_id: membership_id,
                    booklets_id: bookletissue_id
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            .then(response => {
                setrewardsData(response.data.data.booklet_coupon);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);

    const handleDrawer = (coupon_booklet) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            axios.post('/api/bookletcoupon', 
            {
                membership_id: membership_id,
                booklets_id: bookletissue_id,
                token_id: coupon_booklet.id
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setRewardsDesc(response.data.data); // Assuming response contains coupon details
                setOpen(true); // Open the details drawer
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    };
    return (
        <div className='body-container'>
            <div className="sticky-top">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/About"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>REWARDS</span>
                    </div>
                </div>
            </div>
            <div className={`inner-container`}>
            {rewardsData.length > 0 ? (
                rewardsData.map((reward, index) => (
                    <div key={index} className="coupons p-1">
                        <div className="coupon-info h-100">
                            <div className="icon">
                                <img src="https://i.imgur.com/3iASiG8.png" alt="Coupon" />
                            </div>
                            <div className="details">
                                <div className="coupon-expire-date">
                                    <span>Valid till {formatDate(reward.token_valide)}</span>
                                </div>
                                <div className="coupon-name">
                                    <span>{reward.name}</span>
                                </div>
                                <div className="coupon-limit">
                                    <span>Uses: <span>{reward.use_limit}</span></span>
                                </div>
                                <div className="coupon-action">
                                    <div className="coupon-code">
                                        CODE: <span>{reward.token_code}</span>
                                    </div>
                                    <div className="view-coupon">
                                        <button onClick={() => { handleDrawer(reward), setOpen(!open) }}>View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 ))
                ) : (
                    <p>No rewards available</p>
                )}
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <RewardDescDrawer open={open} rewardsCartData={rewardsDesc} setOpen={setOpen} />
            <RewardPopConfirm openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        </div>
    )
}

export default coupon_booklet

function RewardDescDrawer({ open, rewardsCartData, setOpen }) {
    const bookletsCoupon = rewardsCartData?.booklet_coupon?.[0] || {};
    console.log(bookletsCoupon);
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
    const calculateValidity = (validTill) => {
        const currentDate = new Date();
        const validTillDate = new Date(validTill);
        
        const timeDifference = validTillDate - currentDate;
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
        
        return dayDifference > 0 ? `${dayDifference} days` : 'Expired';
    };
    return (
        <div className={`cust-drawer ${open ? "show" : ""}`}>
            <div className={`exit-drawer ${open ? "" : "hide"}`} onClick={() => setOpen(false)} />
            <div className="drawer-content">
                <div className="drawer-upper">
                    <div className="drawer-upper-left">
                        <img src="https://i.imgur.com/wkYeeU3.png" alt="" />
                        <div className="code">{bookletsCoupon?.token_code || 'No Code Available'}</div>
                    </div>
                    <div className="drawer-upper-right">
                        <div className="cDate">Validity <span>{calculateValidity(bookletsCoupon.token_valide)}</span></div>
                        <div className="cName">{bookletsCoupon?.name || 'No Code Available'}</div>
                    </div>
                </div>
                <div className="drawer-middle">
                    <div className="cDateDesc">
                        <div className="dateLeft">{bookletsCoupon?.token_valid_on || ''}</div>
                        <div className="dateRight">{bookletsCoupon?.timing || ''}</div>
                    </div>
                </div>
                <div className="drawer-below">
                    <h4>Terms & Conditions</h4>
                    <p>{bookletsCoupon?.terms || 'No Date Available'}</p>
                </div>
                <div className="exit-btn" onClick={() => setOpen(false)}>
                    <i className='bi bi-x' />
                </div>
            </div>
        </div>
    )
}

function RewardPopConfirm({ openConfirm, setOpenConfirm }) {
    const [proceed,setProceed] = useState(false);
    return (
        <div className={`reward-pop-confirm ${openConfirm ? "show" : ""}`}>
            <div className="pop-confirm-container">
                <div className="pop-confirm-img">
                    <img src="https://i.imgur.com/2FOfgVm.png" alt="" />
                </div>
                <div className="pop-confirm-qn">
                    Redeem Rewards?
                </div>
                <div className="pop-confirm-action">
                    <button onClick={() => setOpenConfirm(false)}>Cancel</button>
                    <button>Yes Redeem</button>
                </div>
                <div className="pop-confirm-onCancel" onClick={() => setOpenConfirm(false)}><i className='bi bi-x'/></div>
            </div>
            <div className="pop-confirm-success">r</div>
            <div className="backdrop-cancel" onClick={() => setOpenConfirm(false)}></div>
        </div>
    )
}