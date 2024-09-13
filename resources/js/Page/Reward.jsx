import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';

function Reward() {
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [rewardsData, setrewardsData] = useState([]);
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
                {[...new Array(14)].map((i, iIndex) => (
                    <div key={iIndex} className="rewards p-1">
                        <div className="rewards-info h-100">
                            <div className="icon">
                                <img src="https://i.imgur.com/wkYeeU3.png" alt="" />
                            </div>
                            <div className="rewards-info-details">
                                <div className="reward-name">
                                    <span>Lorem ipsum dolor sit amet.</span>
                                    <div className="reward-valid">
                                        validity<span>5days</span>
                                    </div>
                                </div>
                                <div className="reward-action">
                                    <div className="reward-view-bnt">
                                        <button onClick={() => { setOpen(!open) }}>view details</button>
                                    </div>
                                    <div className="reward-redeem-bnt">
                                        <button onClick={() => { setOpenConfirm(!openConfirm) }}><span>Cr11 |</span> redeem</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
            <RewardDescDrawer open={open} setOpen={setOpen} />
            <RewardPopConfirm openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        </div>
    )
}

export default Reward

function RewardDescDrawer(event) {
    return (
        <div className={`cust-drawer ${event.open ? "show" : ""}`}>
            <div className={`exit-drawer ${event.open ? "" : "hide"}`} onClick={() => event.setOpen(false)} />
            <div className="drawer-content">
                <div className="drawer-upper">
                    <div className="drawer-upper-left">
                        <img src="https://i.imgur.com/wkYeeU3.png" alt="" />
                        <div className="code">{event?.cData?.couponCode}</div>
                    </div>
                    <div className="drawer-upper-right">
                        <div className="cDate">valid till <span>{event?.cData?.couponExpiry}</span></div>
                        <div className="cName">{event?.cData?.couponName}</div>
                    </div>
                </div>
                <div className="drawer-middle">
                    <div className="cLimit">Uses <span>2/4</span></div>
                    <div className="cDateDesc">
                        <div className="dateLeft">Sun, Mon, Tue, Wed, Fri</div>
                        <div className="dateRight">12:00 A.M to 5:00 P.M</div>
                    </div>
                </div>
                <div className="drawer-below">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, culpa quod. Quia velit deserunt quidem voluptatibus obcaecati maxime nulla molestias!
                </div>
                <div className="exit-btn" onClick={() => event.setOpen(false)}>
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