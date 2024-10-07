import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axiosSetup from '@/axiosSetup';
function ReferalList() {
    const [referallistData, setreferallistData] = useState([]);
    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "0000-00-00") return 'No Date Available';
    
        const date = new Date(dateStr);
    
        // Check if the date is invalid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
    
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
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/referral_programview', [])
            .then(response => {
                setreferallistData(response.data.data);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
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
            {referallistData?.length > 0 ? (
                    referallistData.map((referalList, index) => (
                        <Row gutter={[0, 15]} className='m-3'>
                            <Col key={index} xs={24}>
                                <div className="referal_list_content p-2 px-3 rounded-2">
                                    <div className="referal_inner_left d-flex flex-column gap-1">
                                        <div className='mb-0 referal_details'>
                                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/lkfoz3zubylywrvpfzcm.svg" alt="" />
                                            <p className='fw-bold mb-0'>{referalList.name}</p>
                                        </div>
                                        <div className='mb-0 referal_details'>
                                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/w6bgju2e2tazsmpfqj89.svg" alt="" />
                                            <span>{referalList.mobile == "" ? "N/A" : referalList.mobile}</span>
                                        </div>
                                        <div className='mb-0 referal_details'>
                                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/gr2ketgv3ipbvsjdpclk.svg" alt="" />
                                            <span>{referalList.email == "" ? "N/A" : referalList.email}</span>
                                        </div>
                                        <div className='mb-0 referal_details'>
                                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/wpjhc7rbf4zafv2stv9o.svg" alt="" />
                                            <span>{formatDate(referalList.dob)}</span>
                                        </div>
                                    </div>
                                    <div className="referal_inner_right">
                                        <div className='mb-0 referal_details justify-content-end'>
                                            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726550340/s6bgrfjzzsvs60sajuya.svg" alt="" />
                                            <p className='mb-0'>{formatDate(referalList.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ))
            ):(
                <p>No ReferalList available</p> 
            )}
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}

export default ReferalList
