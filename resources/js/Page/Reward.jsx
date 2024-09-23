import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function Reward() {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [rewardsData, setrewardsData] = useState([]);
    const [rewardsDesc, setRewardsDesc] = useState({});
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
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
                    setLoading(false)
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setLoading(false)
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
                {loading
                    ? ([...new Array(6)].map((i, iIndex) =>
                        <SkeletonTheme key={iIndex} baseColor="#c7c7c7" highlightColor="#ffffff">
                            <div className="rewards p-1">
                                <div className="rewards-info h-100">
                                    <div className="icon">
                                        <Skeleton className='mb-1' style={{ height: "85px", width: "100px" }} />
                                    </div>
                                    <div className="rewards-info-details">
                                        <div className="reward-name">
                                            <Skeleton className='' style={{ height: "15px", width: "150px" }} />
                                            <div className="reward-valid">
                                                <Skeleton className='ms-2' style={{ height: "15px", width: "150px" }} />
                                            </div>
                                        </div>
                                        <div className="reward-action">
                                            <div className="reward-view-bnt">
                                                <Skeleton className='' style={{ height: "20px", width: "60px" }} />
                                            </div>
                                            <div className="reward-redeem-bnt">
                                                <Skeleton className='' style={{ height: "20px", width: "60px" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SkeletonTheme>

                    ))
                    :
                    (
                        rewardsData?.length > 0 ? (
                            rewardsData.map((reward, index) => (
                                <div key={index} className="rewards p-1">
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
                                                    <button onClick={() => { handleDrawer(reward), setOpen(!open) }}>view details</button>
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
                        )
                    )
                }
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <RewardDescDrawer open={open} rewardsCartData={rewardsDesc} setOpen={setOpen} dataLoading={dataLoading} setDataLoading={setDataLoading} />
            <RewardPopConfirm openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        </div>
    )
}

export default Reward

function RewardDescDrawer({ open, rewardsCartData, setOpen, dataLoading, setDataLoading }) {
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
            <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                <div className="drawer-content">
                    <div className="drawer-upper">
                        <div className="drawer-upper-left">
                            {dataLoading
                                ? <Skeleton className='mb-1' style={{ height: "90px", width: "100%" }} />
                                : <img src="https://i.imgur.com/wkYeeU3.png" alt="" />
                            }

                            {dataLoading
                                ? <Skeleton className='mb-1' style={{ height: "20px", width: "100%" }} />
                                : <div className="code">{rewards?.coupon_code || 'No Code Available'}</div>
                            }

                        </div>
                        <div className="drawer-upper-right">
                            {dataLoading
                                ?
                                <div className="d-flex justify-content-end">
                                    <Skeleton className='' style={{ height: "15px", width: "70px" }} />
                                </div>

                                : <div className="cDate">Validity <span>{calculateValidity(rewards.valid_till)}</span></div>
                            }
                            {dataLoading
                                ? <Skeleton className='ms-2' style={{ height: "20px", width: "90%" }} />
                                : <div className="cName">{rewards?.name || 'No Code Available'}</div>
                            }
                        </div>
                    </div>
                    <div className="drawer-middle">
                        {dataLoading
                            ? <Skeleton className='mb-1' style={{ height: "20px", width: "100%" }} />
                            : <div className="cDateDesc">
                                <div className="dateLeft">{rewards?.token_valid_on || ''}</div>
                                <div className="dateRight">{rewards?.timing || ''}</div>
                            </div>
                        }
                    </div>
                    <div className="drawer-below">
                        <h4>Terms & Conditions</h4>
                        {dataLoading
                            ?
                            <>
                                <Skeleton className='mb-1' style={{ height: "20px", width: "100%" }} />
                                <Skeleton className='mb-1' style={{ height: "20px", width: "90%" }} />
                                <Skeleton className='mb-1' style={{ height: "20px", width: "80%" }} />
                                <Skeleton className='mb-1' style={{ height: "20px", width: "70%" }} />
                            </>
                            : <p>{rewards?.terms || 'No Date Available'}</p>
                        }
                    </div>
                    <div className="exit-btn" onClick={() => { setOpen(false), setDataLoading(true) }}>
                        <i className='bi bi-x' />
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    )
}

function RewardPopConfirm({ openConfirm, setOpenConfirm }) {
    const [proceed, setProceed] = useState(false);
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
                <div className="pop-confirm-onCancel" onClick={() => setOpenConfirm(false)}><i className='bi bi-x' /></div>
            </div>
            <div className="backdrop-cancel" onClick={() => setOpenConfirm(false)}></div>
        </div>
    )
}