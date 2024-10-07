import { Avatar, Button, Col, DatePicker, Form, Input, Modal, Popover, Row, Select } from 'antd';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, Router, useParams } from 'react-router-dom';
import axiosSetup from '@/axiosSetup';
import ThemeContext from '../Providers/Contexts/ThemeContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import UploadProfilePic from '../components/UploadProfilePic';
import { convertDateToISO } from '../utility/formating';
import dayjs from 'dayjs';
import FileUploader from '../components/testUploader';
function MyAcount() {
    const [isEditable, setIsEditable] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [openDelPop, setOpenDelPop] = useState(false);
    const [formInstance, setFormInstance] = useState({});
    const [merchantBase,setMerchantBase] = useState(null)
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
    const [userData, setUserData] = useState({});
    const [loaded, setLoaded] = useState(true)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setMerchantBase(sessionStorage.getItem('merchant_base'))
        if (token) {
            axiosSetup.get('/api/accountInfo')
                .then(response => {
                    // console.log('API Response:', response);
                    setData_getaccount(response.data.accountheading);
                    setLoaded(false)
                })
                .catch(error => {
                    console.error('API Error:', error);
                    setError(error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, []);
    const getUserData = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.get('/api/infodata')
                .then(res => {
                    setUserData(res.data.infodata);
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
    }
    useEffect(() => {
        getUserData()
    }, [])
    const handleSave = (formData) => {
        const token = localStorage.getItem('access_token');
        const merchant_id = localStorage.getItem('merchant_base');

        if (token) {
            const payload = {
                ...formData,
                merchant_id: 15657,
                marital: 'Single',
            };
            axiosSetup.post('/api/editinfo', payload)
                .then(response => {
                    console.log('API Response:', response);
                    // Handle successful response
                    setIsEditable(false);
                    getUserData()
                })
                .catch(error => {
                    console.error('API Error:', error);
                    // Handle error
                });
        } else {
            console.log('No token available, API call skipped');
        }
    };

    const handleDelete =()=>{
        // return console.log('thus');
        axiosSetup.get('/api/deletaccount')
        .then(res=>{
            setDeleteModal(false); // Close modal after success
            localStorage.removeItem('access_token');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const handleOpenChange = (newOpen) => {
        setOpenDelPop(newOpen);  // toggle popover based on the new state
    };
    return (
        <div className='onepage-main-body position-relative'>
            <div className='onepage-set-body'>
                <div className="position-sticky top-0 z-1 shadow-sm">
                    <div className="navHeader d-flex justify-content-between">
                        <div className="prev-btn">
                            <Link to={"/userProfile"}>
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
                                            onOpenChange={handleOpenChange}
                                            trigger="click"
                                        >
                                            <Button type='ghost' onClick={() => setOpenDelPop(!openDelPop)} icon={<i className='bi bi-three-dots-vertical text-light fs-5' />} />
                                        </Popover>

                                    </div>
                                    :
                                    <Button onClick={() => { formInstance?.submit() }} type='ghost' icon={<i className='bi bi-check-lg fs-3 text-light' />}></Button>
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
                            <ProfileEditForm onSave={handleSave} data={userData} acData={data_account} setFormInstance={setFormInstance} merchantBase={merchantBase} />
                        </motion.div>
                        :
                        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                            <div className="profile-info m-3" ref={targetDiv}>

                                {
                                    loaded
                                        ? <div className="d-flex gap-2 flex-column">
                                            <div className="profile-pic text-center mb-3">
                                                <Avatar size={70} className='bg-light' icon={<i className='bi bi-person-fill text-dark' />} />
                                            </div>
                                            {[...new Array(10)].map((i, iIndex) => (<div key={iIndex} className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                {/* <label htmlFor="">Name</label> */}
                                                <div className="">
                                                    <Skeleton className='mb-1' style={{ height: "15px", width: "150px" }} />
                                                </div>
                                            </div>))}
                                        </div>
                                        :
                                        <motion.div
                                            initial={{ opacity: 0, }}
                                            animate={{ opacity: 1, }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <div className="d-flex gap-2 flex-column">
                                                <div className="profile-pic text-center mb-3">
                                                    <Avatar size={70} className='bg-light' src={userData?.image} icon={<i className='bi bi-person-fill text-dark' />} />
                                                </div>
                                                {data_account.name.display_full_name_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Name</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.name === "" ? data_account.name.full_name_dynamic_name : userData?.name}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.gender.display_gender_permission == 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Gender</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.gender === "" ? data_account.gender.gender_dynamic_name : userData?.gender}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.email.display_email_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">E-mail</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.email === "" ? data_account.email.email_dynamic_name : userData?.email}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.mobile.display_mobile_number_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Phone</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.mobile === "" ? data_account.mobile.mobile_number_dynamic_name : userData?.mobile}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.birthday.display_birthday_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Birthday</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.dob === "" ? data_account.birthday.birthday_dynamic_name : userData?.dob}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.marital_status.display_marital_status_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Relationship</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.marital === "" ? data_account.marital_status.marital_status_dynamic_name : userData?.marital}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.address.display_address_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Address</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.address === "" ? data_account.address.address_dynamic_name : userData?.address}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.gst.display_gst_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">GSTIN</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.gstin === "" ? data_account.address.gst_dynamic_name : userData?.gstin}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.pan.display_pan_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">PAN</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.pan === "" ? data_account.pan.pan_dynamic_name : userData?.pan}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.bank.display_bank_name_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Bank Name</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.bank_name === "" ? data_account.bank.bank_name : userData?.bank_name}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.bank.display_bank_account_number_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Bank A/C No.</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.bank_account_number === "" ? data_account.bank.bank_account_number : userData?.bank_account_number}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                                {data_account.pincode.display_pincode_permission === 1 && (
                                                    <div className="profile-info-content p-2 px-3 rounded-5 d-flex gap-4">
                                                        <label htmlFor="">Pincode.</label>
                                                        <div className="">
                                                            {loading ?
                                                                <Skeleton className='mb-1' style={{ height: "15px", width: "100px" }} />
                                                                : <span>{userData?.pincode === "" ? data_account.pincode.pincode_dynamic_name : userData?.pincode}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                }

                                <div className="powered-ewards">
                                    <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                                        <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
                                </div>
                            </div>
                        </SkeletonTheme>
                }
                <Modal
                    open={deleteModal}
                    onCancel={() => setDeleteModal(false)}
                    closable={false}
                    centered
                    getContainer={targetDiv.current}
                    width={300}
                    rootClassName='cust-css-ant-modal'
                    onOk={()=>handleDelete()}
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
        </div>
    )
}

export default MyAcount

const ProfileEditForm = ({ onSave, data, acData, setFormInstance, merchantBase }) => {
    const [form] = Form.useForm();
    const [userPp, setUserPp] = useState(data?.image);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cntryId, setCntryId] = useState(parseInt(data?.country));
    const [stId, setStId] = useState(parseInt(data?.state));
    const [ctId, setCtId] = useState(parseInt(data?.city))
    const [doa, setDoa] = useState(data?.doa);
    const [dob, setDob] = useState(data?.dob);
    const [merchant_id,setMerchantId] = useState(null)
    const [isCountryChange, setIscountryChange] = useState(false);
    const validateMessages = {
        types: {
            email: 'Enter A valid Email',
        },
    };

    // Select On Change Handlers
    const handleCountryChange = (value, option) => {
        // return console.log(option);
        
        setCntryId(option.key)
        if (value) {
            setIscountryChange(true)
            getState(option.key)
        }
    }
    const handleStateChange = (value, option) => {
        setStId(option.key);
        if (value) {
            getCity(option.key)
        }
    }
    const handleCityChange = (value, option) => {
        setCtId(option.value)
        if (value) {
            getRegions(option.value)
        }
    }

    // Select set functions
    // function setCountryById(countryId) {
    //     const id = parseInt(countryId)
    //     const foundObj = countries?.find(obj => obj.value === id)
    //     if (foundObj) {
    //         return foundObj.label
    //     }
    // }
    // function setStateById(stateId) {
    //     const id = parseInt(stateId)
    //     const state = states?.find(i => i.value === id)
    //     if (state) {
    //         return state.label
    //     }
    // }
    // function setCityById(cityId) {
    //     const id = parseInt(cityId)
    //     const city = cities?.find(i => i.id === id)
    //     if (city) {
    //         return city.label
    //     }
    // }


    // API calls
    const getCountry = () => {
        axiosSetup.get('/api/countries')
            .then(res => {
                const mappedData = res?.data?.countries.map(country => ({
                    value: country.name,
                    label: country.name,
                    key: country.id
                }));
                setCountries(mappedData)
            })
            .catch(err => {
                console.log(err);
            })
    }
    function getState(cId) {
        axiosSetup.post('/api/state', { "country_id": cId })
            .then(res => {
                const mappedData = res?.data?.states.map(i => ({
                    value: i.name,
                    label: i.name,
                    key:i.id
                }))
                setStates(mappedData)
                getCity(stId)
            })
            .catch(err => {
                console.log(err)
            })
    }
    function getCity(sId) {
        axiosSetup.post('/api/cities', { "state_id": sId })
            .then(res => {
                const mappedData = res?.data?.cities.map(i => ({
                    value: i.name,
                    label: i.name,
                    key:i.id
                }))
                setCities(mappedData)
                // getRegions()
            })
            .catch(err => {
                console.log(err);
            })
    }
    function getRegions(cityName) {
        axiosSetup.post('/api/gettingregion',{city:cityName})
            .then(res => {
                const mappedData = res?.data?.region.map(i => ({
                    value: i.region,
                    label: i.region,
                    key:i.id
                }))
                setRegions(mappedData)
            })
            .catch(err => {
                console.log(err);
            })
    }
    // Set fields 
    const setFields = () => {
        form.setFieldsValue({
            name: data.name,
            email: data.email,
            mobile: data?.mobile,
            address: data?.address,
            country: (data?.country),
            state: (data?.state),
            city: (data?.city),
            region: data?.region,
            pincode: data?.pincode,
            gender: data?.gender,
            dob: dayjs(data?.dob),
            marital: data?.marital,
            doa: dayjs(data?.doa),
            gstin: data?.gstin,
            pan: data?.pan,
            bank_name: data?.bank_name,
            bank_account_number: data?.bank_account_number,
        })
    }

    // Local Handle State
    const handleSave = () => {
        form.validateFields().then(values => {
            // return console.log(values);
            const formData = {
                ...values,
                image: userPp,
                dob: dob,
                doa: doa,
            }
            // return console.log(formData);
            onSave(formData);
        }).catch(errorInfo => {
            console.log('Form validation failed:', errorInfo);
        });
    };

    useEffect(() => {
        setFields()
    }, [countries])

    useEffect(() => {
        axiosSetup.get('/api/onepage/' + merchantBase)
        .then(res=>{
            setMerchantId(res.data.merchant_id);
        })
        .catch(err=>{
            console.log(err);
            
        })
        setFormInstance(form);
        getCountry();
    }, [])

    return (
        <div className="edit-profile p-3">
            <Form
                form={form}
                layout='vertical'
                className=''
                onFinish={handleSave}
                validateMessages={validateMessages}
            >
                <Row gutter={[0, 25]} >
                    {/* User Profile Pic */}
                    <Col xs={24}>
                        <div className="text-center">
                            <Form.Item className='' name="image">
                                <UploadProfilePic imageUrl={setUserPp} file={userPp} />
                            </Form.Item>
                        </div>
                    </Col>
                    {/* UserName */}
                    {acData.name.display_full_name_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"name"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `Name can not be empty`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="name">Name</label>
                        </div>
                    </Col>}
                    {/* Email */}
                    {acData?.email.display_email_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"email"} className='mb-0'
                                rules={[
                                    {
                                        type: 'email',
                                    },
                                    {
                                        required: true,
                                        message: "Please enter email"
                                    }
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input' type='email'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="email">Email</label>
                        </div>
                    </Col>}
                    {/* Phone Number */}
                    {acData?.mobile.display_mobile_number_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"mobile"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `phone number can not be empty`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input'></Input>
                            </Form.Item>
                            <label className='position-absolute' htmlFor="mobile">Phone Number</label>
                        </div>
                    </Col>}
                    {/* Address Line */}
                    {acData?.address.display_address_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"address"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `Address can not be empty`,
                                    },
                                ]}
                            >
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
                                    <Form.Item name={"country"} className='mb-0'
                                        rules={[
                                            {
                                                required: true,
                                                message: `select your country`,
                                            },
                                        ]}
                                    >
                                        <Select
                                            className='cust-css-ant'
                                            onChange={handleCountryChange}
                                            options={countries}
                                            allowClear
                                            onSelect={handleCountryChange}
                                            showSearch
                                        >

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="country">Country</label>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"state"} className='mb-0'
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: `please select state`,
                                    //     },
                                    // ]}
                                    >
                                        <Select
                                            disabled={!isCountryChange}
                                            className='cust-css-ant'
                                            options={states}
                                            onChange={handleStateChange}
                                            onSelect={handleStateChange}
                                            allowClear
                                            showSearch
                                        >

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="state">State</label>
                                </div>
                            </Col>
                            {acData?.city.display_city_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"city"} className='mb-0'
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: `please select city`,
                                    //     },
                                    // ]}
                                    >
                                        <Select
                                            disabled={!isCountryChange}
                                            className='cust-css-ant'
                                            options={cities}
                                            onChange={handleCityChange}
                                            onSelect={handleCityChange}
                                            showSearch
                                        >

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="city">City</label>
                                </div>
                            </Col>}
                            {acData?.region.display_region_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"region"} className='mb-0'
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: `please select region`,
                                    //     },
                                    // ]}
                                    >
                                        <Select

                                            disabled={!isCountryChange}
                                            className='cust-css-ant'
                                            options={regions}
                                            showSearch
                                        >

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="region">Region</label>
                                </div>
                            </Col>}
                        </Row>
                    </Col>
                    {/* Pin Code */}
                    {acData?.pincode.display_pincode_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"pincode"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `please enter pincode`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="pincode">Pin</label>
                        </div>
                    </Col>}
                    {/* Gender, Birthday, RelationShip, Aniversary */}
                    <Col xs={24}>
                        <Row gutter={[10, 25]}>
                            {acData?.gender.display_gender_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"gender"} className='mb-0'
                                        rules={[
                                            {
                                                required: true,
                                                message: `please select your gender`,
                                            },
                                        ]}
                                    >
                                        <Select className='cust-css-ant'
                                            options={[{
                                                value: "male",
                                                label: "Male"
                                            },
                                            {
                                                value: 'female',
                                                label: "Female"
                                            },
                                            {
                                                value: "others",
                                                label: "Others"
                                            }
                                            ]}
                                        >

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="gender">Gender</label>
                                </div>
                            </Col>}
                            {acData?.birthday.display_birthday_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"dob"} className='mb-0'
                                        rules={[
                                            {
                                                required: true,
                                                message: `please select your D.O.B`,
                                            },
                                        ]}
                                    >
                                        <DatePicker onChange={(e) => { setDob(convertDateToISO(e.$d)) }} className='w-100 rounded-5 cust-css-ant-date' />
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="dob">Birthday</label>
                                </div>
                            </Col>}
                            {acData?.marital_status.display_marital_status_permission === 1 && <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"marital"} className='mb-0'
                                        rules={[
                                            {
                                                required: true,
                                                message: `please select your martial status`,
                                            },
                                        ]}
                                    >
                                        <Select className='cust-css-ant'
                                            options={[
                                                {
                                                    value: "single",
                                                    label: "Single",
                                                },
                                                {
                                                    value: "married",
                                                    label: "Married"
                                                }
                                            ]}
                                        >

                                        </Select>
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="marital">Relationship</label>
                                </div>
                            </Col>}
                            <Col xs={12}>
                                <div className="position-relative edit-input-div">
                                    <Form.Item name={"doa"} className='mb-0'
                                        rules={[
                                            {
                                                required: true,
                                                message: `please select your doa`,
                                            },
                                        ]}
                                    >
                                        <DatePicker onChange={(e) => { setDoa(convertDateToISO(e.$d)) }} className='w-100 rounded-5 cust-css-ant-date' />
                                    </Form.Item>
                                    <label className='position-absolute' htmlFor="doa">Aniversary</label>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* GSTIN */}
                    {acData?.gst.display_gst_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"gstin"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `please select your gstin`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="gstin">GSTIN</label>
                        </div>
                    </Col>}
                    {/* Pan Number */}
                    {acData?.pan.display_pan_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"pan"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `please select your pan number`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="pan">PAN</label>
                        </div>
                    </Col>}
                    {/* Bank Name */}
                    {acData?.bank.display_bank_name_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"bank_name"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `please select your bank name`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="bank_name">Bank Name</label>
                        </div>
                    </Col>}
                    {/* Bank Account Number */}
                    {acData?.bank.display_bank_account_number_permission === 1 && <Col xs={24}>
                        <div className="position-relative edit-input-div">
                            <Form.Item name={"bank_account_number"} className='mb-0'
                                rules={[
                                    {
                                        required: true,
                                        message: `please enter your account number`,
                                    },
                                ]}
                            >
                                <Input className='rounded-5  cust-css-ant-input' />
                            </Form.Item>
                            <label className='position-absolute' htmlFor="bank_account_number">Bank A/C No.</label>
                        </div>
                    </Col>}
                </Row>
            </Form>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}