import { Avatar, Button, Col, DatePicker, Form, Input, Popover, Row, Select } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function MyAcount() {
    const [isEditable, setIsEditable] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    return (
        <div className='body-container position-relative overflow-hidden'>
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
                                <div className="d-flex gap-2 align-items-center">
                                    <Button onClick={() => setIsEditable(true)} className='rounded-5' icon={<i className='bi bi-pen' />}>Edit</Button>
                                    <Popover
                                        rootClassName='delete-pop-over'
                                        content={<a onClick={()=>setDeleteModal(true)}>Delete Account</a>}
                                        trigger="click"
                                        placement='bottomRight'
                                    >
                                        <Button type='ghost' icon={<i className='bi bi-three-dots-vertical text-light fs-5' />} />
                                    </Popover>

                                </div>
                                :
                                <Button onClick={() => setIsEditable(false)} type='ghost' icon={<i className='bi bi-check-lg fs-3 text-light' />}></Button>
                        }
                    </div>
                </div>
            </div>
            {
                isEditable
                    ?
                    <motion.div
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        transition={{ duration: 0.6 }}
                    >
                        <ProfileEditForm />
                    </motion.div>
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
                        <div className="powered-ewards">
                            <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                                <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
                        </div>
                    </div>
            }
            
        </div>
    )
}

export default MyAcount

const ProfileEditForm = () => {
    const [form] = Form.useForm();
    return (
        <div className="edit-profile p-3">
            <Form
                form={form}
                layout='vertical'
                className=''
            >
                <Row gutter={[0, 20]} >
                    {/* User Profile Pic */}
                    <Col xs={24}>
                        <div className="text-center">
                            <Form.Item className='' name="profilePicture">
                                <Avatar size={70} className='cust-css-ant-avatar' icon={<i className='bi bi-person-fill' />} />
                            </Form.Item>
                        </div>
                    </Col>
                    {/* UserName */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"userName"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="userName">Name</label>
                        </div>
                    </Col>
                    {/* Email */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"email"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' type='email'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="email">Email</label>
                        </div>
                    </Col>
                    {/* Phone Number */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"phoneNumber"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="phoneNumber">Phone Number</label>
                        </div>
                    </Col>
                    {/* Address Line */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"address"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="address">Address</label>
                        </div>
                    </Col>
                    {/* Address (Country, State, City Region) */}
                    <Col xs={24}>
                        <Row gutter={[10, 20]}>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"country"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="country">Country</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"state"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="state">State</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"city"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="city">City</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"region"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="region">Region</label>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* Pin Code */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"pincode"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="pincode">Pin</label>
                        </div>
                    </Col>
                    {/* Gender, Birthday, RelationShip, Aniversary */}
                    <Col xs={24}>
                        <Row gutter={[10, 20]}>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"gender"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="gender">Gender</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"birthday"} className='mb-0'>
                                        <DatePicker className='w-100 rounded-5 cust-css-ant-date' />
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="birthday">Birthday</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"relationship"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="relationship">Relationship</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"aniversary"} className='mb-0'>
                                        <DatePicker className='w-100 rounded-5 cust-css-ant-date' />
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="aniversary">Aniversary</label>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* GSTIN */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"gstin"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="gstin">GSTIN</label>
                        </div>
                    </Col>
                    {/* Pan Number */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"panNumber"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="panNumber">PAN</label>
                        </div>
                    </Col>
                    {/* Bank Name */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"bankName"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="bankName">Bank Name</label>
                        </div>
                    </Col>
                    {/* Bank Account Number */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"accountNumber"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="accountNumber">Bank A/C No.</label>
                        </div>
                    </Col>
                    {/* P.O. Box Number */}
                    <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"poBoxNumber"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="poBoxNumber">P.O. Box No.</label>
                        </div>
                    </Col>
                </Row>
            </Form>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}