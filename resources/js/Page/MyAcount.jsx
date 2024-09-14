import { Avatar, Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function MyAcount() {
    const [isEditable, setIsEditable] = useState(false);
    return (
        <div className='body-container'>
            <div className="position-sticky top-0 z-1 shadow-sm">
                <div className="navHeader d-flex justify-content-between">
                    <div className="prev-btn">
                        <Link to={"/Profile"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        {
                            !isEditable
                                ? <span>MY ACCOUNT</span>
                                : <span>EDIT PROFILE</span>
                        }
                    </div>
                    <div className="profile-action">
                        {
                            !isEditable ?
                                <Button onClick={() => setIsEditable(true)} className='rounded-5' icon={<i className='bi bi-pen' />}>Edit</Button>
                                :
                                <Button onClick={() => setIsEditable(false)} className='border-0' icon={<i className='bi bi-check-lg fs-5' />}></Button>
                        }
                    </div>
                </div>
            </div>
            {
                isEditable
                    ?
                    <div className="edit-profile h-100 p-3">

                    </div>
                    :
                    <div className="profile-info m-3">
                        <div className="d-flex gap-2 flex-column">
                            <div className="profile-pic text-center mb-3">
                                <Avatar size={70} className='bg-light' icon={<i className='bi bi-person-fill text-dark' />} />
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Name</label>
                                <div className="">
                                    <span>Sameeksha Sinha</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Gender</label>
                                <div className="">
                                    <span>Male</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">E-mail</label>
                                <div className="">
                                    <span>gareeb.myewards@gmail.com</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Phone</label>
                                <div className="">
                                    <span>+91 9772920587</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Birthday</label>
                                <div className="">
                                    <span>16th Oct, 1990</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Relationship</label>
                                <div className="">
                                    <span>Single</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Aniversary</label>
                                <div className="">
                                    <span>N/A</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Address</label>
                                <div className="">
                                    <span>St. Moonshine lane, ABC road...</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">GSTIN</label>
                                <div className="">
                                    <span>ISTN87638RHA</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">PAN</label>
                                <div className="">
                                    <span>CCDJO9E3H7</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Bank Name</label>
                                <div className="">
                                    <span>AXIS Bank, Kolkata</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">Bank A/C No.</label>
                                <div className="">
                                    <span>487512485624</span>
                                </div>
                            </div>
                            <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                <label htmlFor="">P.O. Box No.</label>
                                <div className="">
                                    <span>784596</span>
                                </div>
                            </div>
                        </div>
                    </div>
            }
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}

export default MyAcount