import React from 'react'
import { Link } from 'react-router-dom'

function MembershipDetails() {
    return (
        <div className='body-container membership-package-body'>
            <div className="sticky-top border-0 border-bottom">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/About"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>MEMBERSHIP PACKAGE</span>
                    </div>
                </div>
            </div>
            <div className="membership-package-details mt-3 text-light px-3">
                <div className="package-info d-flex flex-column">
                    <span className='fs-5 fw-bold text-uppercase'>Lorem ipsum dolor sit amet.</span>
                    <div className="d-flex gap-2" style={{fontSize:"15px"}}>
                        <p>Start Date: <span>01.08.23</span></p>|<p>End Date: <span>01.08.23</span></p>
                    </div>
                </div>
                <div className="package-status d-flex justify-content-center position-relative">
                    <img src="https://i.imgur.com/4BZj3rp.png" alt="" />
                    <span className='position-absolute fw-semibold'>ACTIVE</span>
                </div>
            </div>
            {/* background */}
            <div className="bg-shape position-absolute w-100 one">
                <img src="https://i.imgur.com/UTAJ31K.png" alt="" />
                <div className="border position-absolute top-0">kldsjf</div>
            </div>
            <div className="bg-shape position-absolute w-100 two">
                <img src="https://i.imgur.com/6bAQtCI.png" alt="" />
            </div>
        </div>
    )
}

export default MembershipDetails
