import { Button, Col, DatePicker, Form, Input, Row } from 'antd'
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import { Link } from 'react-router-dom'

function Referal() {
    const [form] = Form.useForm();
    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                console.log(values);
            })
            .catch(err => {
                console.log("Validation Error", err);
            })
    }
    return (
        <div className='onepage-main-body position-relative'>
            <div className="position-sticky top-0 z-1 shadow-sm">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/Profile"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>REFERALS</span>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <img height={300} src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726547513/nrbjco90fwazslilsf7j.svg" alt="" />
            </div>
            <div className="referal_form_contact p-3 pt-5 rounded-4">
                <Form
                    form={form}
                    layout='vertical'
                >
                    <Row gutter={[0, 20]}>
                        <Col xs={24}>
                            <div className="position-relative edit-input-div contact-us">
                                <Form.Item name={"name"} className='mb-0'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter person's name"
                                        }
                                    ]}
                                >
                                    <Input className='rounded-2  cust-css-ant-input contact-info' placeholder='Enter name' />
                                </Form.Item>
                                <label className='position-absolute ps-0' htmlFor="name">Friend's Name</label>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <div className="position-relative edit-input-div contact-us">
                                <Form.Item name={"phone"} className='mb-0'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter phone number"
                                        }
                                    ]}
                                >
                                    <PhoneInput
                                        country={'in'}
                                    />
                                </Form.Item>
                                <label className='position-absolute z-3 ps-0' htmlFor="userName">Phone No.</label>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <div className="position-relative edit-input-div contact-us">
                                <Form.Item name={"dob"} className='mb-0'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select date"
                                        }
                                    ]}
                                >
                                    <DatePicker rootClassName='w-100 rounded-1 py-2' />
                                </Form.Item>
                                <label className='position-absolute z-3 ps-0' htmlFor="userName">Date of Birth</label>
                            </div>
                        </Col>
                        <Col xs={24}>
                            <div className="position-relative edit-input-div contact-us">
                                <Form.Item name={"email"} className='mb-0'
                                    rules={[
                                        {
                                            type: "email",
                                            message: "Enter a valid mail"
                                        },
                                        {
                                            required: true,
                                            message: "Enter your email"
                                        }
                                    ]}
                                >
                                    <Input className='rounded-2  cust-css-ant-input contact-info' placeholder='Enter email' />
                                </Form.Item>
                                <label className='position-absolute z-3 ps-0' htmlFor="userName">Email</label>
                            </div>
                        </Col>
                    </Row>
                    <Row
                        justify={'center'}
                        className='my-3'>
                        <Col xs={7}>
                            <Button className='cust-css-ant-button' type='primary' block onClick={handleSubmit}>Submit</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Link className='text-decoration-none' to={"/Referallist"}>
                <div className="route_to_referal_list d-flex justify-content-between  mx-4 rounded-3 p-3">
                    <span className='text-light'>Your Referals</span>
                    <i className='bi bi-chevron-right text-light' />
                </div>
            </Link>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}

export default Referal
