import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import axiosSetup from '@/axiosSetup';
import { decodeBase64 } from '../utility/base_64_decode';
function coupon_booklet() {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [rewardsData, setrewardsData] = useState([]);
    const [rewardsDesc, setRewardsDesc] = useState({});
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
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
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/bookletcoupon',
                {
                    membership_id: decodeBase64(membership_id),
                    booklets_id: bookletissue_id
                })
                .then(response => {
                    setrewardsData(response.data.data.booklet_coupon);
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

    const handleDrawer = (coupon_booklet) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/bookletcoupon',
                {
                    membership_id: decodeBase64(membership_id),
                    booklets_id: bookletissue_id,
                    token_id: coupon_booklet.id
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
                        <Link to={"/Home"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>REWARDS</span>
                    </div>
                </div>
            </div>
            <div className={`inner-container`}>
                {
                    loading
                        ? <div className="coupons p-1">
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
                                            <span>Uses:
                                                <Skeleton className='ms-2' style={{ height: "10px", width: "50px" }} />
                                            </span>
                                        </div>
                                        <div className="coupon-action">
                                            <div className="coupon-code">
                                                CODE:
                                                <Skeleton className='ms-2' style={{ height: "10px", width: "55px" }} />
                                            </div>
                                            <div className="view-coupon">
                                                <Skeleton style={{ height: "20px", width: "55px" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SkeletonTheme>
                        </div>
                        :
                        (
                            rewardsData?.length > 0 ? (
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
                            )
                        )
                }
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <RewardDescDrawer open={open} rewardsCartData={rewardsDesc} setOpen={setOpen} setDataLoading={setDataLoading} dataLoading={dataLoading} />
            <RewardPopConfirm openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        </div>
    )
}

export default coupon_booklet

function RewardDescDrawer({ open, rewardsCartData, setOpen, dataLoading, setDataLoading }) {
    const bookletsCoupon = rewardsCartData?.booklet_coupon?.[0] || {};
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
                                : <div className="code">{bookletsCoupon?.token_code || 'No Code Available'}</div>
                            }
                        </div>
                        <div className="drawer-upper-right">
                            {dataLoading
                                ? <div className="d-flex justify-content-end">
                                    <Skeleton className='' style={{ height: "15px", width: "70px" }} />
                                </div>
                                : <div className="cDate">Validity <span>{calculateValidity(bookletsCoupon.token_valide)}</span></div>
                            }

                            {
                                dataLoading
                                    ? <Skeleton className='ms-2' style={{ height: "20px", width: "90%" }} />
                                    : <div className="cName">{bookletsCoupon?.name || 'No Code Available'}</div>
                            }
                        </div>
                    </div>
                    <div className="drawer-middle">
                        {
                            dataLoading
                                ? <Skeleton className='mb-1' style={{ height: "20px", width: "100%" }} />
                                : <div className="cDateDesc">
                                    <div className="dateLeft">{bookletsCoupon?.token_valid_on || ''}</div>
                                    <div className="dateRight">{bookletsCoupon?.timing || ''}</div>
                                </div>
                        }
                    </div>
                    <div className="drawer-below">
                        <h4>Terms & Conditions</h4>
                        {dataLoading
                            ? <>
                                <Skeleton className='mb-1' style={{ height: "20px", width: "100%" }} />
                                <Skeleton className='mb-1' style={{ height: "20px", width: "90%" }} />
                                <Skeleton className='mb-1' style={{ height: "20px", width: "80%" }} />
                                <Skeleton className='mb-1' style={{ height: "20px", width: "70%" }} />
                            </>
                            : <p>{bookletsCoupon?.terms || 'No Date Available'}</p>
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
            <div className="pop-confirm-success">r</div>
            <div className="backdrop-cancel" onClick={() => setOpenConfirm(false)}></div>
        </div>
    )
}