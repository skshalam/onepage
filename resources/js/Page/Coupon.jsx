import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Coupon() {
    const [activeTab, setActiveTab] = useState('coupon')
    return (
        <div className='body-container'>
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
                <ActiveCoupons data={tempData} />
            </div>
            <div className={`tab-content ${activeTab === 'on-hold' ? '' : 'hidden'}`}>
                <HoldOnCoupons data={tempData} />
            </div>
        </div>
    )
}

export default Coupon
// Active Coupon
function ActiveCoupons({ data }) {
    const [open, setOpen] = useState(false);
    const [couponDesc, setCouponDesc] = useState({});
    const handleDrawer = (data) => {
        setCouponDesc(data)
    }
    return (
        <>
            <div className={`inner-container`}>
                {data.map((i, iIndex) => (
                    <div key={iIndex} className="coupons p-1">
                        <div className="coupon-info h-100">
                            <div className="icon">
                                <img src="https://i.imgur.com/3iASiG8.png" alt="" />
                            </div>
                            <div className="details">
                                <div className="coupon-expire-date">
                                    <span>Valid till {i?.couponExpiry}</span>
                                </div>
                                <div className="coupon-name">
                                    <span>{i?.couponName}</span>
                                </div>
                                <div className="coupon-limit">
                                    <span>Uses: <span>2/4</span></span>
                                </div>
                                <div className="coupon-action">
                                    <div className="coupon-code">
                                        CODE: <span>{i?.couponCode}</span>
                                    </div>
                                    <div className="view-coupon">
                                        <button onClick={() => { handleDrawer(i), setOpen(!open) }}>View Details</button>
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
            <CouponDescDrawer open={open} cData={couponDesc} setOpen={setOpen} />
        </>
    )
}
// Hold-on Coupon Component
function HoldOnCoupons({ data }) {
    const [open, setOpen] = useState(false);
    const [couponDesc, setCouponDesc] = useState({});

    const handleDrawer = (data) => {
        setCouponDesc(data)
    }
    return (
        <>
            <div className={`inner-container`}>
                {data.map((i, iIndex) => (
                    <div key={iIndex} className="coupons p-1">
                        <div className="coupon-info h-100">
                            <div className="icon">
                                <img src="https://i.imgur.com/3iASiG8.png" alt="" />
                            </div>
                            <div className="details">
                                <div className="coupon-expire-date">
                                    <span>Valid till {i?.couponExpiry}</span>
                                </div>
                                <div className="coupon-name">
                                    <span>{i?.couponName}</span>
                                </div>
                                <div className="coupon-limit">
                                    <span>Uses: <span>2/4</span></span>
                                </div>
                                <div className="coupon-action">
                                    <div className="coupon-code">
                                        CODE: <span>{i?.couponCode}</span>
                                    </div>
                                    <div className="view-coupon">
                                        <button onClick={() => { handleDrawer(i), setOpen(!open) }}>View Details</button>
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
            <CouponDescDrawer open={open} cData={couponDesc} setOpen={setOpen} />
        </>
    )
}

// Coupon Description Drawer
function CouponDescDrawer(event) {
    return (
        <div className={`cust-drawer ${event.open ? "show" : ""}`}>
            <div className={`exit-drawer ${event.open ? "" : "hide"}`} onClick={() => event.setOpen(false)} />
            <div className="drawer-content">
                <div className="drawer-upper">
                    <div className="drawer-upper-left">
                        <img src="https://i.imgur.com/3iASiG8.png" alt="" />
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

// Temp Data for test
const tempData = [
    {
        "couponName": "Crataegus williamsii Eggl.",
        "couponExpiry": "9/21/2024",
        "couponCode": "41520-153",
        "couponDescription": "Remove Contracept Dev from Up Extrem Subcu/Fascia, Perc"
    },
    {
        "couponName": "Didymodon perobtusus Broth.",
        "couponExpiry": "11/1/2024",
        "couponCode": "36987-1156",
        "couponDescription": "Removal of Synth Sub from Male Perineum, Perc Endo Approach"
    },
    {
        "couponName": "Ceratophyllum L.",
        "couponExpiry": "11/15/2024",
        "couponCode": "76058-101",
        "couponDescription": "Replace of L Metatarsophal Jt with Synth Sub, Open Approach"
    },
    {
        "couponName": "Cyrtandra ×alata H. St. John & Storey (pro sp.)",
        "couponExpiry": "11/4/2024",
        "couponCode": "51079-514",
        "couponDescription": "Division of Right Ethmoid Bone, Open Approach"
    },
    {
        "couponName": "Phacelia patuliflora (Engelm. & A. Gray) A. Gray var. teucriifolia (I.M. Johnst.) Constance",
        "couponExpiry": "12/19/2024",
        "couponCode": "58930-023",
        "couponDescription": "Occlusion of Right Uterine Artery, Percutaneous Approach"
    },
    {
        "couponName": "Aspidotis carlotta-halliae (W.H. Wagner & E.F. Gilbert) Lellinger, (pro. hybr.)",
        "couponExpiry": "11/27/2024",
        "couponCode": "11822-0190",
        "couponDescription": "Restrict Inf Mesent Art w Extralum Dev, Perc Endo"
    },
    {
        "couponName": "Xanthoceras Bunge",
        "couponExpiry": "10/15/2024",
        "couponCode": "43857-0008",
        "couponDescription": "Bypass Cereb Vent to Pleural Cav w Nonaut Sub, Open"
    },
    {
        "couponName": "Guaiacum officinale L.",
        "couponExpiry": "9/13/2024",
        "couponCode": "37000-686",
        "couponDescription": "Removal of Nonaut Sub from Stomach, Perc Endo Approach"
    },
    {
        "couponName": "Neptunia pubescens Benth.",
        "couponExpiry": "10/16/2024",
        "couponCode": "68828-184",
        "couponDescription": "Reposition R Tarsal Jt with Ext Fix, Perc Endo Approach"
    },
    {
        "couponName": "Aristida purpurascens Poir. var. tenuispica (Hitchc.) Allred",
        "couponExpiry": "11/17/2024",
        "couponCode": "66949-206",
        "couponDescription": "Introduction of Other Anti-infective into Fem Reprod, Endo"
    },
    {
        "couponName": "Agalinis paupercula (A. Gray) Britton var. paupercula",
        "couponExpiry": "11/11/2024",
        "couponCode": "52686-330",
        "couponDescription": "Reposition Left Vocal Cord, Open Approach"
    },
    {
        "couponName": "Collema fasciculare (L.) F.H. Wigg.",
        "couponExpiry": "9/17/2024",
        "couponCode": "36987-1735",
        "couponDescription": "Drainage of Left Spermatic Cord, Perc Endo Approach"
    },
    {
        "couponName": "Narcissus jonquilla L.",
        "couponExpiry": "12/13/2024",
        "couponCode": "53208-377",
        "couponDescription": "Excision of Tricuspid Valve, Open Approach"
    },
    {
        "couponName": "Labordia tinifolia A. Gray",
        "couponExpiry": "9/26/2024",
        "couponCode": "0378-5150",
        "couponDescription": "Destruction of Right Kidney Pelvis, Perc Endo Approach"
    }
]