import { Col, Row } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

function ReferalList() {
    return (
        <div className='onepage-main-body position-relative'>
            <div className="position-sticky top-0 z-1 shadow-sm">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/Referal"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>YOUR REFERALS</span>
                    </div>
                </div>
            </div>
            <Row gutter={[0, 15]} className='m-3'>
                {[...new Array(10)].map((i, iIndex) => (<Col key={iIndex} xs={24}>
                    <div className="referal_list_content p-2 px-3 rounded-2">
                        <div className="referal_inner_left d-flex flex-column gap-1">
                            <div className='mb-0 referal_details'>
                                <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/lkfoz3zubylywrvpfzcm.svg" alt="" />
                                <p className='fw-bold mb-0'>Soumyadip</p>
                            </div>
                            <div className='mb-0 referal_details'>
                                <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/w6bgju2e2tazsmpfqj89.svg" alt="" />
                                <span>+91 98745621458</span>
                            </div>
                            <div className='mb-0 referal_details'>
                                <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/gr2ketgv3ipbvsjdpclk.svg" alt="" />
                                <span>raghab.raichand@gmail.com</span>
                            </div>
                            <div className='mb-0 referal_details'>
                                <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/wpjhc7rbf4zafv2stv9o.svg" alt="" />
                                <span>24th Jun 1981</span>
                            </div>
                        </div>
                        <div className="referal_inner_right">
                            <div className='mb-0 referal_details justify-content-end'>
                                <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/s6bgrfjzzsvs60sajuya.svg" alt="" />
                                <p className='mb-0'>24th Jun 1981</p>
                            </div>
                        </div>
                    </div>
                </Col>))}
            </Row>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}

export default ReferalList
