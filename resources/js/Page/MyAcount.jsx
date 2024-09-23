import { Avatar, Button, Col, DatePicker, Form, Input, Modal, Popover, Row, Select } from 'antd';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, Router, useParams } from 'react-router-dom';
import axios from 'axios';
import ThemeContext from '../Providers/Contexts/ThemeContext';
function MyAcount() {
    const [isEditable, setIsEditable] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [openDelPop, setOpenDelPop] = useState(false);
    const [formInstance,setFormInstance] = useState({});
    const { useThemeStyles } = useContext(ThemeContext)
    const targetDiv = useRef(null);
    const [data_account, setData_getaccount] = useState({
        "name": {
            "display_full_name_permission": 0,
            "full_name_dynamic_name": ""
        },
        "email": {
            "display_email_permission": 0,
            "email_dynamic_name": ""
        },
        "gender": {
            "display_gender_permission": 0,
            "gender_dynamic_name": ""
        },
        "address": {
            "display_address_permission": 0,
            "address_dynamic_name": ""
        },
        "pincode": {
            "display_pincode_permission": 0,
            "pincode_dynamic_name": ""
        },
        "city": {
            "display_city_permission": 0,
            "city_dynamic_name": ""
        },
        "region": {
            "display_region_permission": 0,
            "region_dynamic_name": ""
        },
        "birthday": {
            "display_birthday_permission": 0,
            "birthday_dynamic_name": ""
        },
        "marital_status": {
            "display_marital_status_permission": 0,
            "marital_status_dynamic_name": ""
        },
        "bank": {
            "display_bank_name_permission": 0,
            "bank_name": "",
            "display_bank_account_number_permission": 0,
            "bank_account_number": ""
        },
        "mobile": {
            "display_mobile_number_permission": 0,
            "mobile_number_dynamic_name": ""
        },
        "gst": {
            "display_gst_permission": 0,
            "gst_dynamic_name": ""
        },
        "pan": {
            "display_pan_permission": 0,
            "pan_dynamic_name": ""
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            axios.get('/api/accountInfo', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // console.log('API Response:', response);
                    setData_getaccount(response.data.accountheading);
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setError(error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
    // useEffect(() => {
    //     const token = sessionStorage.getItem('access_token');
    //     if (token) {
    //         axios.get('/api/infodata', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //             .then(response => {
    //                 // console.log('API Response:', response);
    //                 setData_getaccount(response.data.accountheading);
    //             })
    //             .catch(error => {
    //                 console.error('API Error:', error);
    //                 setError(error);
    //             });
    //     } else {
    //         console.log('No token available, API call skipped');
    //     }
    // }, []);
    const handleSave = (formData) => {
        console.log(formData);
        
        const token = sessionStorage.getItem('access_token');
        const merchant_id = localStorage.getItem('merchant_base');
        if (token) {
            const payload = {
                ...formData,
                merchant_id: 15657,
                state: 'ANDHRA PRADESH',
                country: 'India',
                city: 'VISAKHAPATNAM',
                region: 'fdsaf',
                dob: '1970-01-01',
                marital: 'Single',
                doa: '1970-01-01',
                gender: 'Male',
            };
            axios.post('/api/editinfo', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log('API Response:', response);
                    // Handle successful response
                    setIsEditable(false);
                })
                .catch(error => {
                    console.error('API Error:', error);
                    // Handle error
                });
        } else {
            console.log('No token available, API call skipped');
        }
    };
    
    return (
        <div className='body-container position-relative'>
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
                                        content={<a onClick={() => { setDeleteModal(true), setOpenDelPop(false) }}>Delete Account</a>}
                                        placement='bottomRight'
                                        open={openDelPop}
                                    >
                                        <Button type='ghost' onClick={() => setOpenDelPop(true)} icon={<i className='bi bi-three-dots-vertical text-light fs-5' />} />
                                    </Popover>

                                </div>
                                :
                                <Button onClick={() => {formInstance?.submit()}} type='ghost' icon={<i className='bi bi-check-lg fs-3 text-light' />}></Button>
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
                        <ProfileEditForm onSave={handleSave} data={data_account} setFormInstance={setFormInstance} />
                    </motion.div>
                    :
                    <div className="profile-info m-3" ref={targetDiv}>
                        <div className="d-flex gap-2 flex-column">
                            <div className="profile-pic text-center mb-3">
                                <Avatar size={70} className='bg-light' icon={<i className='bi bi-person-fill text-dark' />} />
                            </div>
                            {data_account.name.display_full_name_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Name</label>
                                    <div className="">
                                        <span>{data_account.name.full_name_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.gender.display_gender_permission == 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Gender</label>
                                    <div className="">
                                        <span>{data_account.gender.gender_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.email.display_email_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">E-mail</label>
                                    <div className="">
                                        <span>{data_account.email.email_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.mobile.display_mobile_number_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Phone</label>
                                    <div className="">
                                        <span>{data_account.mobile.mobile_number_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.birthday.display_birthday_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Birthday</label>
                                    <div className="">
                                        <span>{data_account.birthday.birthday_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.marital_status.display_marital_status_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Relationship</label>
                                    <div className="">
                                        <span>{data_account.marital_status.marital_status_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.address.display_address_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Address</label>
                                    <div className="">
                                        <span>{data_account.address.address_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.gst.display_gst_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">GSTIN</label>
                                    <div className="">
                                        <span>{data_account.address.gst_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.pan.display_pan_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">PAN</label>
                                    <div className="">
                                        <span>{data_account.pan.pan_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.bank.display_bank_name_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Bank Name</label>
                                    <div className="">
                                        <span>{data_account.bank.bank_name}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.bank.display_bank_account_number_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">Bank A/C No.</label>
                                    <div className="">
                                        <span>{data_account.bank.bank_account_number}</span>
                                    </div>
                                </div>
                            )}
                            {data_account.pincode.display_pincode_permission === 1 && (
                                <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                    <label htmlFor="">P.O. Box No.</label>
                                    <div className="">
                                        <span>{data_account.pincode.pincode_dynamic_name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="powered-ewards">
                            <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                                <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
                        </div>
                    </div>
            }
            <Modal
                open={deleteModal}
                onCancel={() => setDeleteModal(false)}
                closable={false}
                centered
                getContainer={targetDiv.current}
                width={300}
                rootClassName='cust-css-ant-modal'
                styles={{
                    footer: {
                        display: "grid",
                        margin: "20px 10px",
                        padding: "0px 20px",
                        gridTemplateColumns: "1fr 1fr"
                    },
                    content: {
                        padding: "0px",
                        overflow: "hidden",
                    }
                }}
            >
                <div className="del-ac-modal-content position-relative">
                    <div className="modal-bg position absolute">
                        <svg width="345" height="166" viewBox="0 0 345 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M345 91.3234L1.65989 165.285C1.10338 165.405 0.548585 165.475 0 165.497V-1H345V91.3234Z" fill={useThemeStyles?.primary_color} />
                        </svg>

                    </div>
                    <div className="position-absolute modal-icon d-flex flex-column gap-0">
                        <i className='bi bi-exclamation-circle text-light' />
                        <span>Delete ?</span>
                    </div>
                    <div className="text-center fw-semibold modal-txt">
                        <p className='mb-0'>Your account will be permanently deleted. Proceed?</p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MyAcount

const ProfileEditForm = ({ onSave, data, setFormInstance }) => {
    const [form] = Form.useForm();
    useEffect(()=>{
        setFormInstance(form);
    },[])
    useEffect(() => {
        form.setFieldsValue({
            name: data.name.full_name_dynamic_name,
            email: data.email.email_dynamic_name,
            mobile: data?.mobile.mobile_number_dynamic_name,
            address: data?.address.address_dynamic_name,
            // country:data?.country.,
            // state:data,
            city: data?.city.city_dynamic_name,
            region: data?.region.region_dynamic_name,
            pincode: data?.pincode.pincode_dynamic_name,
            gender: data?.gender.gender_dynamic_name,
            // dob:data?.birthday.birthday_dynamic_name,
            marital: data?.marital_status.marital_status_dynamic_name,
            // doa:data,
            gstin: data?.gst.gst_dynamic_name,
            pan: data?.pan.pan_dynamic_name,
            bank_name: data?.bank.bank_name,
            bank_account_number: data?.bank.bank_account_number,
        })
    }, [])
    const handleSave = () => {
        form.validateFields().then(values => {
            // Call the onSave prop function and pass the form values
            onSave(values);
        }).catch(errorInfo => {
            console.log('Form validation failed:', errorInfo);
        });
    };
    return (
        <div className="edit-profile p-3">
            <Form
                form={form}
                layout='vertical'
                className=''
                onFinish={handleSave}
            >
                <Row gutter={[0, 25]} >
                    {/* User Profile Pic */}
                    <Col xs={24}>
                        <div className="text-center">
                            <Form.Item className='' name="profilePicture">
                                <Avatar size={70} className='cust-css-ant-avatar' icon={<i className='bi bi-person-fill' />} />
                            </Form.Item>
                        </div>
                    </Col>
                    {/* UserName */}
                    {data.name.display_full_name_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"name"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="name">Name</label>
                        </div>
                    </Col>}
                    {/* Email */}
                    {data?.email.display_email_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"email"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' type='email'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="email">Email</label>
                        </div>
                    </Col>}
                    {/* Phone Number */}
                    {data?.mobile.display_mobile_number_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"mobile"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="mobile">Phone Number</label>
                        </div>
                    </Col>}
                    {/* Address Line */}
                    {data?.address.display_address_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"address"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="address">Address</label>
                        </div>
                    </Col>}
                    {/* Address (Country, State, City Region) */}
                    <Col xs={24}>
                        <Row gutter={[10, 25]}>
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
                            {data?.city.display_city_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"city"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="city">City</label>
                                </div>
                            </Col>}
                            {data?.region.display_region_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"region"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="region">Region</label>
                                </div>
                            </Col>}
                        </Row>
                    </Col>
                    {/* Pin Code */}
                    {data?.pincode.display_pincode_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"pincode"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="pincode">Pin</label>
                        </div>
                    </Col>}
                    {/* Gender, Birthday, RelationShip, Aniversary */}
                    <Col xs={24}>
                        <Row gutter={[10, 25]}>
                            {data?.gender.display_gender_permission===1&&<Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"gender"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="gender">Gender</label>
                                </div>
                            </Col>}
                            {data?.birthday.display_birthday_permission===1&&<Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"dob"} className='mb-0'>
                                        <DatePicker className='w-100 rounded-5 cust-css-ant-date' />
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="dob">Birthday</label>
                                </div>
                            </Col>}
                            {data?.marital_status.display_marital_status_permission===1&&<Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"marital"} className='mb-0'>
                                        <Select className='cust-css-ant'>

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="marital">Relationship</label>
                                </div>
                            </Col>}
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"doa"} className='mb-0'>
                                        <DatePicker className='w-100 rounded-5 cust-css-ant-date' />
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="doa">Aniversary</label>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* GSTIN */}
                    {data?.gst.display_gst_permission===1&&<Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"gstin"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="gstin">GSTIN</label>
                        </div>
                    </Col>}
                    {/* Pan Number */}
                    {data?.pan.display_pan_permission===1&&<Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"pan"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="pan">PAN</label>
                        </div>
                    </Col>}
                    {/* Bank Name */}
                    {data?.bank.display_bank_name_permission===1&&<Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"bank_name"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="bank_name">Bank Name</label>
                        </div>
                    </Col>}
                    {/* Bank Account Number */}
                    {data?.bank.display_bank_account_number_permission===1&&<Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"bank_account_number"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="bank_account_number">Bank A/C No.</label>
                        </div>
                    </Col>}
                    {/* P.O. Box Number */}
                    {/* <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"poBoxNumber"} className='mb-0'>
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="poBoxNumber">P.O. Box No.</label>
                        </div>
                    </Col> */}
                    <Row gutter={[0, 20]}>
                        <Col xs={24}>
                            <Button onClick={handleSave} type='primary'>Save</Button>
                        </Col>
                    </Row>
                </Row>
            </Form>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}