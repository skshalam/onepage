import { Checkbox, Col, DatePicker, Drawer, Form, Row, Tabs, Spin } from 'antd';
import { form } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import axiosSetup from '@/axiosSetup';
function CreditWallet() {
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
    const [openFilter1, setOpenFilter1] = useState(false);
    const [openFilter2, setOpenFilter2] = useState(false);
    const [creditwalletData, setCreditWalletData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(0); // Track total pages
    const [isLoading, setIsLoading] = useState(false); // To prevent multiple API calls at the same time

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            loadCreditWalletData(currentPage);
        }
    }, [currentPage]);

    const loadCreditWalletData = async (page) => {
        setIsLoading(true);
        try {
            const response = await axiosSetup.post('/api/creditbalance', { page_number: page });
            const { creditbalance, total_pages } = response.data;
            setCreditWalletData(prevData => [...prevData, ...creditbalance]); // Append new data
            setTotalPages(total_pages); // Set total pages
        } catch (error) {
            console.error('API Error:', error);
        }
        setIsLoading(false);
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !isLoading) {
            if (currentPage < totalPages) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, isLoading]);
    return (
        <div className='onepage-main-body'>
            <div className='onepage-set-body onepage-set-body-about'>
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
                <div className="mx-4 rounded-4 wallet-balance-table ">
                    <div className="wallet-filter-header d-flex justify-content-between align-items-center py-2 px-3">
                        <div className="filter-header-left">
                            Transaction Log
                        </div>

                        <div className="filter-header-right d-flex gap-2">
                            <i className='bi bi-calendar p-1 px-2 rounded-2' onClick={() => setOpenFilter1(true)} />
                            <i className='bi bi-funnel p-1 px-2  rounded-2' onClick={() => setOpenFilter2(true)} />
                        </div>
                    </div>
                    {
                        isLoading
                        ?
                            <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
                                {[...new Array(5)].map((i, iIndex) => (<div key={iIndex} className="membership position-relative p-1">
                                    <div className="membership-inner">
                                        <div className="membership-info h-100">
                                            <div className="icon">
                                                <Skeleton className='' style={{ height: "85px", width: "110px" }} />
                                            </div>
                                            <div className="membership-info-details d-flex flex-column justify-content-around">
                                                <div className="membership-name">
                                                    <Skeleton className='' style={{ height: "15px", width: "150px" }} />
                                                </div>
                                                <div className="membership-validity">
                                                    <Skeleton className='ms-2' style={{ height: "15px", width: "90px" }} />
                                                </div>
                                                <div className="membership-price">
                                                    <Skeleton className='' style={{ height: "15px", width: "60px" }} />
                                                </div>
                                                <div className="membership-action">
                                                    <Skeleton className='' style={{ height: "25px", width: "60px" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>))}
                            </SkeletonTheme>
                            :
                            (
                            <div className="wallet-table-body">
                                {creditwalletData?.length > 0 ? (
                                    creditwalletData.map((crwallet, index) => (
                                        <div key={crwallet + index} className="wallet-detail-container p-2 px-3">
                                            <div className="wallet-detail-container-top d-flex justify-content-between align-items-center">
                                                <span>{index}</span>
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
                                        </div>
                                    ))
                                ) : (
                                    <p>No Credit Wallet Available</p>
                                )}
                            </div>
                            )
                    }
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