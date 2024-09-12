import React from 'react'
import { Link } from 'react-router-dom'

function MemberShipPackage() {
    return (
        <div className='body-container'>
            <div className="position-sticky top-0 z-1 shadow-sm">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/About"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>MEMBERSHIP PACKAGE</span>
                    </div>
                </div>
            </div>
            <div className={`inner-container`}>
                {[...new Array(6)].map((i, iIndex) => (
                    <>
                        <div className="membership position-relative p-1">
                            <div className="membership-inner">
                                <div className="membership-info h-100">
                                    <div className="icon">
                                        <img src="https://i.imgur.com/wiem34R.png" alt="" />
                                    </div>
                                    <div className="membership-info-details d-flex flex-column justify-content-around">
                                        <div className="membership-name">
                                            <h6>Super Premium Package 007</h6>
                                        </div>
                                        <div className="membership-validity">
                                            valid till <span>23rd Aug 24</span>
                                        </div>
                                        <div className="membership-price">
                                            <span>1000</span>
                                        </div>
                                        <div className="membership-action">
                                            <button>View Details</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="membership-status">
                                    <img src="https://i.imgur.com/euPvujv.png" alt="" />
                                    <span>Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="membership p-1">
                            <div className="membership-inner">
                                <div className="membership-info h-100">
                                    <div className="icon">
                                        <img src="https://i.imgur.com/wiem34R.png" alt="" />
                                    </div>
                                    <div className="membership-info-details">
                                        <div className="membership-name">
                                            <h6>Super Premium Package 007</h6>
                                        </div>
                                        <div className="membership-validity">
                                            valid till <span>23rd Aug 24</span>
                                        </div>
                                        <div className="membership-price">
                                            <span>1000</span>
                                        </div>
                                        <div className="membership-action">
                                            <button>View Details</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="membership-status">
                                    <img src="https://i.imgur.com/QA3ERcP.png" alt="" />
                                    <span>Expire</span>
                                </div>
                            </div>
                        </div>
                    </>
                ))}
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}

export default MemberShipPackage
