import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';

function MemberShipPackage() {
    const [membershipsDesc, setmembershipDesc] = useState({});
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        console.log('Token:', token);
        if (token) {
            axios.post('/api/memebership', [], {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setmembershipDesc(response.data.data.membership);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
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
            {membershipsDesc.length > 0 ? (
                membershipsDesc.map((member, index) => (
                    <div className="membership position-relative p-1">
                        <div className="membership-inner">
                            <div className="membership-info h-100">
                                <div className="icon">
                                    <img src="https://i.imgur.com/wiem34R.png" alt="" />
                                </div>
                                <div className="membership-info-details d-flex flex-column justify-content-around">
                                    <div className="membership-name">
                                        <h6>{member.name}</h6>
                                    </div>
                                    <div className="membership-validity">
                                        valid till <span>{formatDate(member.end_date)}</span>
                                    </div>
                                    <div className="membership-price">
                                        <span>{member.selling_price}</span>
                                    </div>
                                    <div className="membership-action">
                                        <Link to={`/Membership/:${member.membership_id}`}>
                                        <button>View Details</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="membership-status">
                                <img src="https://i.imgur.com/euPvujv.png" alt="" />
                                <span>Active</span>
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
        </div>
    )
}

export default MemberShipPackage
