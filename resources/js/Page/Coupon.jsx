import React, { useState } from 'react'

function Coupon() {
    const [activeTab, setActiveTab] = useState('coupon')
    return (
        <div className='body-container'>
            <div className="sticky-top">
                <div className="coupon-header">
                    <div className="prev-btn">
                        <i className="bi bi-chevron-left"></i>
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
                <ActiveCoupons tab={activeTab} />
            </div>
            <div className={`tab-content ${activeTab === 'on-hold' ? '' : 'hidden'}`}>
                <HoldOnCoupons tab={activeTab} />
            </div>
        </div>
    )
}

export default Coupon

function ActiveCoupons({ tab }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className={`coupon-container`}>
                {[...new Array(6)].map((i, iIndex) => (
                    <div key={iIndex} className="coupons p-1">
                        <div className="coupon-info h-100">
                            <div className="icon">
                                <img src="https://i.imgur.com/3iASiG8.png" alt="" />
                            </div>
                            <div className="details">
                                <div className="coupon-expire-date">
                                    <span>Valid till</span>
                                </div>
                                <div className="coupon-name">
                                    <span>Lorem, ipsum dolor sit amet consectetur adipisicing.</span>
                                </div>
                                <div className="coupon-limit">
                                    <span>Uses: <span>2/4</span></span>
                                </div>
                                <div className="coupon-action">
                                    <div className="coupon-code">
                                        CODE: <span>sdkfj</span>
                                    </div>
                                    <div className="view-coupon">
                                        <button>View Details</button>
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
        </>
    )
}

function HoldOnCoupons({ tab }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className={`coupon-container`}>
                {[...new Array(6)].map((i, iIndex) => (
                    <div key={iIndex} className="coupons p-1">
                        <div className="coupon-info h-100">
                            <div className="icon">
                                <img src="https://i.imgur.com/3iASiG8.png" alt="" />
                            </div>
                            <div className="details">
                                <div className="coupon-expire-date">
                                    <span>Valid till</span>
                                </div>
                                <div className="coupon-name">
                                    <span>Lorem, ipsum dolor sit amet consectetur adipisicing.</span>
                                </div>
                                <div className="coupon-limit">
                                    <span>Uses: <span>2/4</span></span>
                                </div>
                                <div className="coupon-action">
                                    <div className="coupon-code">
                                        CODE: <span>sdkfj</span>
                                    </div>
                                    <div className="view-coupon">
                                        <button onClick={() => setOpen(!open)}>View Details</button>
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
        </>
    )
}
