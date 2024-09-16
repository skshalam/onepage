import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';

function Reward() {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [rewardsData, setrewardsData] = useState([]);
    const [rewardsDesc, setRewardsDesc] = useState({});
    const calculateValidity = (validTill) => {
        const currentDate = new Date();
        const validTillDate = new Date(validTill);
        
        const timeDifference = validTillDate - currentDate;
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
        
        return dayDifference > 0 ? `${dayDifference} days` : 'Expired';
    };
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        console.log('Token:', token);
        if (token) {
            axios.post('/api/rewards', [], {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setrewardsData(response.data.data.rewards);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);

    const handleDrawer = (reward) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            axios.post('/api/rewards', 
            {
                rewards_id: reward.rewards_id // Send rewards_id in the payload
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
                <div className="rewards p-1">
                    <div className="rewards-info h-100">
                        <div className="icon">
                            <img src="https://i.imgur.com/wkYeeU3.png" alt="" />
                        </div>
                        <div className="rewards-info-details">
                            <div className="reward-name">
                                <span>{reward.name}</span>
                                <div className="reward-valid">
                                    validity <span>{calculateValidity(reward.valid_till)}</span>
                                </div>
                            </div>
                            <div className="reward-action">
                                <div className="reward-view-bnt">
                                    <button  onClick={() => { handleDrawer(reward), setOpen(!open) }}>view details</button>
                                </div>
                                <div className="reward-redeem-bnt">
                                    <button onClick={() => { setOpenConfirm(!openConfirm) }}><span>{reward.coupon_code} |</span> redeem</button>
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

export default Reward

function RewardDescDrawer({ open, rewardsCartData, setOpen }) {
    const rewards = rewardsCartData?.rewards?.[0] || {};
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
                        <div className="code">{rewards?.coupon_code || 'No Code Available'}</div>
                    </div>
                    <div className="drawer-upper-right">
                        <div className="cDate">Validity <span>{calculateValidity(rewards.valid_till)}</span></div>
                        <div className="cName">{rewards?.name || 'No Code Available'}</div>
                    </div>
                </div>
                <div className="drawer-middle">
                    <div className="cDateDesc">
                        <div className="dateLeft">{rewards?.token_valid_on || ''}</div>
                        <div className="dateRight">{rewards?.timing || ''}</div>
                    </div>
                </div>
                <div className="drawer-below">
                    <h4>Terms & Conditions</h4>
                    <p>{rewards?.terms || 'No Date Available'}</p>
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