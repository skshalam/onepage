import { Checkbox, Col, DatePicker, Drawer, Form, Row, Tabs } from 'antd';
import { form } from 'framer-motion/client';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function CreditWallet() {
    const [openFilter1, setOpenFilter1] = useState(false);
    const [openFilter2, setOpenFilter2] = useState(false);
    const items = [
        {
            key: '1',
            label: 'Type',
            children: <FilterByType />,
        },
        {
            key: '2',
            label: 'Source',
            children: <FilterBySource />,
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
                        <span>CREDIT BALANCE</span>
                    </div>
                </div>
            </div>
            <div className="px-3 text-center my-4 wallet-credit-info">
                <h6>TOTAL CREDIT BALANCE</h6>
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
                        <div className="wallet-detail-container-middle d-flex justify-content-between align-items-center">
                            <div className="invoice-number">
                                Invoice Number: <span>INVG78945GTSZ</span>
                            </div>
                            <div className="wallet-transaction-value d-flex gap-1">
                                <p className='mb-0'>+1,000</p><i className='bi bi-chevron-down' />
                            </div>
                        </div>
                        <div className="wallet-detail-container-bottom d-flex justify-content-between align-items-center">
                            <div className="wallet-balance">
                                <p className='mb-2'>value <span>₹ 147,854</span></p>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
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
                <Tabs defaultActiveKey="1" rootClassName='filter-by-type-nav' items={items} />
                <div className="filter-actions">
                    <button className='border-0 p-2'>Clear</button>
                    <button className='border-0 p-2'>Apply</button>
                </div>
            </Drawer>
        </div>
    )
}

export default CreditWallet

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
const FilterBySource = () => {
    const [form] = Form.useForm();
    const options = [
        {
            label: 'Loyalty',
            value: 'loyalty',
        },
        {
            label: 'Bonus',
            value: 'bonus',
        },
        {
            label: 'e-wallet',
            value: 'eWallet',
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
                            <Checkbox.Group options={options} rootClassName='filter-by-type-checkbox' />
                        </div>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    )
}