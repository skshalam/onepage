import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Col, DatePicker, Drawer, Form, Row, Tabs } from 'antd';

function Wallet() {
    const [openFilter1, setOpenFilter1] = useState(false);
    const [openFilter2, setOpenFilter2] = useState(false);
    const items = [
        {
            key: '1',
            label: 'Type',
            children: <FilterByType />,
        },
    ];
    return (
        <div className='body-container position-relative overflow-hidden'>
            <div className="position-sticky top-0 z-1 shadow-sm">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/About"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>WALLET BALANCE</span>
                    </div>
                </div>
            </div>
            <div className="px-3 text-center my-4 wallet-credit-info">
                <h6>TOTAL WALLET BALANCE</h6>
                <span>5,124</span><span> points</span>
            </div>
            <div className="mx-4 rounded-4 wallet-balance-table">
                <div className="wallet-filter-header d-flex justify-content-between align-items-center py-2 px-3">
                    <div className="filter-header-left">
                        Transaction Log
                    </div>

                    <div className="filter-header-right d-flex gap-2">
                        <i className='bi bi-calendar p-1 px-2 rounded-2' onClick={() => setOpenFilter1(true)} />
                        <i className='bi bi-funnel p-1 px-2  rounded-2' onClick={() => setOpenFilter2(true)} />
                    </div>
                </div>
                <div className="wallet-table-body">
                    {[...new Array(6)].map((i, iIndex) => (<div key={iIndex} className="wallet-detail-container p-2 px-3">
                        <div className="wallet-detail-container-top d-flex justify-content-between align-items-center">
                            <div className="wallet-name">
                                <p className='fw-bold mb-0'>
                                    Sky Wallet
                                </p>
                            </div>
                            <div className="wallet-expire">
                                <p className='mb-0'>
                                    Valid till <span>30th Jun,25</span>
                                </p>
                            </div>
                        </div>
                        <div className="wallet-detail-container-bottom d-flex justify-content-between align-items-center">
                            <div className="wallet-balance">
                                <p className='mb-2'>value <span>₹ 147,854</span></p>
                            </div>
                            <div className="wallet-transaction-value">
                                <p className='mb-2'>+1,000</p>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
            {/* Filter By Date Modal */}
            {/* <div className={`filter-by-date-modal position-absolute h-100 top-0 w-100 ${openFilter1 && "show"}`}>
                <div className={`filter-cancel-container position-absolute border h-100 w-100 ${openFilter1 && "show"}`} onClick={() => setOpenFilter1(false)}></div>
                <div className="position-absolute filter-by-container overflow-hidden shadow rounded-3">
                    <div className="filter-by-date-header border-bottom">
                        Filter By Date
                    </div>
                    <div className="filter-by-date-select-container px-3 py-4 d-flex flex-column gap-2">
                        <div className="filter-start-date d-flex justify-content-between gap-2">
                            To: <DatePicker className='filter-date-input'/>
                        </div>
                        <div className="filter-end-date d-flex justify-content-between gap-2">
                            From: <DatePicker className='filter-date-input'/>
                        </div>
                    </div>
                    <div className="filter-by-date-actions">
                        <button className='border-0 p-2'>Clear</button>
                        <button className='border-0 p-2'>Apply</button>
                    </div>
                </div>
            </div> */}
            {/* Filter By Type Modal */}
            {/* <div className={`filter-by-type-modal position-absolute h-100 top-0 w-100 ${openFilter2 && "show"}`}>
                <div className={`filter-cancel-container position-absolute border h-100 w-100 ${openFilter2 && "show"}`} onClick={() => setOpenFilter2(false)}></div>
                <div className="position-absolute filter-by-container overflow-hidden shadow rounded-3">
                    <div className="filter-by-date-header border-bottom">
                        Type
                    </div>
                    <div className="filter-by-select-container d-flex flex-column gap-2 px-4 py-3">
                        <div className="d-flex gap-2">
                            <input type="checkbox" id='earned' />
                            <label htmlFor="earned">Earned</label>
                        </div>
                        <div className="d-flex gap-2">
                            <input type="checkbox" id='redeem' />
                            <label htmlFor="">Redeemed</label>
                        </div>
                        <div className="d-flex gap-2">
                            <input type="checkbox" id='expired' />
                            <label htmlFor="">Expired</label>
                        </div>
                    </div>
                    <div className="filter-by-date-actions">
                        <button className='border-0 p-2'>Clear</button>
                        <button className='border-0 p-2'>Apply</button>
                    </div>
                </div>
            </div> */}

            <Drawer
                rootClassName='filter-drawer'
                open={openFilter1}
                onClose={() => setOpenFilter1(false)}
                getContainer={false}
                closable={false}
                styles={{
                    body: {
                        padding: 0,
                    }
                }}
            >
                <div className="border-bottom py-2 px-4">
                    <span className='fw-semibold'>Filter By Date</span>
                </div>
                <div className="p-3 d-flex flex-column gap-3">
                    <Row className=''>
                        <Col span={7}>
                            <div className="">
                                To:
                            </div>
                        </Col>
                        <Col span={17}>
                            <div className="">
                                <DatePicker className='filter-date-input' />
                            </div>
                        </Col>
                    </Row>
                    <Row className=''>
                        <Col span={7}>
                            <div className="">
                                From:
                            </div>
                        </Col>
                        <Col span={17}>
                            <div className="">
                                <DatePicker className='filter-date-input' />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="filter-actions">
                    <button className='border-0 p-2'>Clear</button>
                    <button className='border-0 p-2'>Apply</button>
                </div>
            </Drawer>
            <Drawer
                rootClassName='filter-drawer'
                open={openFilter2}
                onClose={() => setOpenFilter2(false)}
                getContainer={false}
                closable={false}
                styles={{
                    body: {
                        padding: 0,
                    }
                }}
            >
                <div className="border-bottom py-2 px-4">
                    <span className='fw-semibold'>Filter By Type</span>
                </div>
                <FilterByType />
                <div className="filter-actions">
                    <button className='border-0 p-2'>Clear</button>
                    <button className='border-0 p-2'>Apply</button>
                </div>
            </Drawer>
        </div>
    )
}

export default Wallet

const FilterByType = () => {
    const [form] = Form.useForm();
    const options = [
        {
            label: 'Earned',
            value: 'earned',
        },
        {
            label: 'Redeemed',
            value: 'redeemed',
        },
        {
            label: 'Expired',
            value: 'expired',
        },
    ];
    return (
        <Form
            form={form}
            layout='vertical'
            className=''
        >
            <Form.Item name={'earned'} className='my-3'>
                <Row gutter={[0, 10]} justify={'center'}>
                    <Col span={15} className=''>
                        <div className="">
                            <Checkbox.Group options={options}
                                rootClassName='filter-by-type-checkbox' />
                        </div>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    )
}