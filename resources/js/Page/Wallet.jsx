import { Checkbox, Col, DatePicker, Drawer, Form, message, Row, } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import axiosSetup from '@/axiosSetup';
import ThemeContext from '../Providers/Contexts/ThemeContext';
import { formatNumberWithCommas } from '../utility/formating';
import dayjs from 'dayjs';

function Wallet() {
    const [openFilter1, setOpenFilter1] = useState(false);
    const [openFilter2, setOpenFilter2] = useState(false);
    const [creditwalletData, setCreditWalletData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(0); // Track total pages
    const [isLoading, setIsLoading] = useState(false); // To prevent multiple API calls at the same time
    const [scrollLoad, setScrollLoad] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState("");
    const [pendingSelectedTypes, setPendingSelectedTypes] = useState("");
    const [startDate, setStartDate] = useState(""); // To store start date
    const [endDate, setEndDate] = useState(""); // To store end date
    const [stDate,setStDate] = useState(null);
    const [enDate,setEnDate] = useState(null);
    const [pendingStartDate, setPendingStartDate] = useState(""); // Temporary state for start date
    const [pendingEndDate, setPendingEndDate] = useState(""); // Temporary state for end date
    const [form] = Form.useForm();
    const { useThemeStyles } = useContext(ThemeContext)
    const [currentWalletpoints, setcurrentWalletpoints] = useState(0);
    const [c1,setC1] = useState(0);
    const [isFilterActive,setIsFilterActive] = useState(false);
    const [isCalenderActive,setIsCalenderActive] = useState(false);
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No Date Available';

        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
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

    const disabledDate = (current) => {
        // Disable dates after today
        return current && current > dayjs().endOf('day');
    };
    const handleStartDateChange = (date, dateString) => {
        setPendingStartDate(dateString); // Store the pending start date
        setStDate(date)
    };

    const handleEndDateChange = (date, dateString) => {
        if (stDate && date && date.isBefore(stDate, 'day')) {
            message.error("End date cannot be earlier than start date.");
            setEnDate(null);
        } else {
            setPendingEndDate(dateString)
            setEnDate(date);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token && currentPage === 1) {  // Only call the API on mount or when currentPage is 1
            setIsLoading(true);
            loadCreditWalletData(currentPage, selectedTypes, startDate, endDate);
        }
    }, []);

    useEffect(() => {
        if (currentPage > 1) {
            setScrollLoad(true);
            setTimeout(() => {
                loadCreditWalletData(currentPage, selectedTypes, startDate, endDate);
            }, 1500);            
        }
    }, [currentPage]);


    const loadCreditWalletData = async (page, types = "", start_date = "", end_date = "") => {
        if (page===1) {
            setIsLoading(true)
        } else {
            setScrollLoad(true)
        }        
        try {
            const response = await axiosSetup.post('/api/walletbalance', {
                page_number: page,
                type: types,
                start_date: start_date,
                end_date: end_date
            });
            const { walletbalance, total_pages } = response.data;
            setOpenFilter2(false);
            setcurrentWalletpoints(response.data.current_wallet_balance);
            if (page === 1) {
                setCreditWalletData(walletbalance); // On first page, replace data
            } else {
                setCreditWalletData(prevData => [...prevData, ...walletbalance]); // Append data for pagination
            }
            setTotalPages(total_pages); // Set total pages
        } catch (error) {
            console.error('API Error:', error);
        }
        setIsLoading(false);
        setScrollLoad(false)
    };

    const clearFilters = () => {
        form.resetFields(); // Reset all checkbox fields in the form
        setPendingSelectedTypes(""); // Clear the pending selected types
        setSelectedTypes(""); // Clear the actual selected types
        setOpenFilter2(false); // Close the drawer popup
        setCurrentPage(1); // Reset pagination to the first page
        loadCreditWalletData(1, "", "", "");
        setOpenFilter1(false);
        setC1(0);
        setIsCalenderActive(false);
    };

    const handleTypeChange = (checkedValues) => {
        let count = checkedValues.length
        setC1(count);
        const typeString = checkedValues.map(type => {
            switch (type) {
                case 'earned': return 'Earned';
                case 'redeemed': return 'Redeemed';
                case 'expired': return 'Expired';
                default: return type;
            }
        }).join(",");
        setPendingSelectedTypes(typeString); // Temporarily store the selected types
    };

    const applyFilters = () => {
        setSelectedTypes(pendingSelectedTypes); // Set the actual selected types when 'Apply' is clicked
        setCurrentPage(1); // Reset to first page
        loadCreditWalletData(1, pendingSelectedTypes, startDate, endDate); // Load data based on selected filters
        setOpenFilter2(false)
        setIsFilterActive(true)
    };
    const applyDateFilters = () => {
        setCurrentPage(1);
        setEndDate(pendingEndDate);
        setStartDate(pendingStartDate)
        loadCreditWalletData(1, pendingSelectedTypes, pendingStartDate, pendingEndDate);
        setOpenFilter1(false);
        setIsCalenderActive(true)
    };
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !isLoading) {
            if (currentPage < totalPages) {
                setCurrentPage(prevPage => {
                    const nextPage = prevPage + 1;
                    return nextPage;
                });
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, selectedTypes, startDate, endDate, isLoading]);
    return (
        <div className='onepage-main-body'>
            <div className='onepage-set-body creditpage-body'>
                <div className="position-sticky top-0 z-1 shadow-sm">
                    <div className="navHeader">
                        <div className="prev-btn">
                            <Link to={"/Home"}>
                                <i className="bi bi-chevron-left"></i>
                            </Link>
                            <span>WALLET BALANCE</span>
                        </div>
                    </div>
                </div>
                <div className="px-3 text-center my-4 wallet-credit-info">
                    <h6>TOTAL WALLET BALANCE</h6>
                    <span>{formatNumberWithCommas(currentWalletpoints)}</span><span> points</span>
                </div>
                <div className="mx-4 rounded-4 wallet-balance-table ">
                    <div className="wallet-filter-header d-flex justify-content-between align-items-center py-2 px-3">
                        <div className="filter-header-left">
                            Transaction Log
                        </div>

                        <div className="filter-header-right d-flex gap-2">
                            <i className={`bi ${isCalenderActive?'bi-calendar-fill':'bi-calendar'} p-1 px-2 rounded-2`} onClick={() => setOpenFilter1(true)} />
                            <i className={`bi ${c1 > 0&&isFilterActive ? 'bi-funnel-fill' : 'bi-funnel'} p-1 px-2  rounded-2`} onClick={() => setOpenFilter2(true)} />
                            {(c1>0&&isFilterActive)&&<div className={"filter-count"}>{c1}</div>}
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
                                            <div key={crwallet + index} className={`wallet-detail-container p-2 px-3 ${(crwallet.Wallet_Type === "Expired") ? "credit-expired-main" : ""}`}>
                                                <div className="wallet-detail-container-top d-flex justify-content-between align-items-center">
                                                    {/* <span>{index}</span> */}
                                                    <div className="wallet-name">
                                                        <p className='fw-bold mb-0'>
                                                            {crwallet.Wallet_Name}
                                                        </p>
                                                    </div>
                                                    <div className="wallet-expire">
                                                        <p className='mb-0'>
                                                            Valid till <span>{crwallet.Valid_Till !== "0000-00-00" ? formatDate(crwallet.Valid_Till) : '-'}
                                                                <b className='credit-expired'>{crwallet.Wallet_Type === "Expired" ? " | Expired" : ""}</b></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="wallet-detail-container-middle d-flex justify-content-end align-items-center">
                                                    <div className="wallet-transaction-value d-flex gap-1">
                                                        <p className={`mb-0 ${(crwallet.Wallet_Type === "Expired" || crwallet.Wallet_Type === "Redeemed") ? "credit-expired" : ""}`}>{crwallet.Wallet_Type === "Earned" ? "+" : "-"}{crwallet.Wallet_Balance}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                            <div className='no-credit-error'>
                                                <img className='mb-3' src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1727696657/OBJECTS_1_sehxw8.svg" alt="" />
                                                <p className=''>
                                                    No Credit Wallet Available
                                                </p>
                                                <span>You have yet to transect any wallet balance.</span>
                                            </div>
                                    )}
                                </div>
                            )
                    }
                    {
                        scrollLoad && <div className='text-center my-3'>
                            <div className='d-flex justify-content-center'>

                                <svg xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="xMidYMid"
                                    width="70"
                                    height="70"
                                    style={{ shapeRendering: "auto", display: "block", background: "transparent" }}>
                                    <g>
                                        <circle strokeDasharray="117.80972450961724 41.269908169872416"
                                            r="25"
                                            strokeWidth="3"
                                            stroke={useThemeStyles.primary_color}
                                            fill="none"
                                            cy="50"
                                            cx="50">
                                            <animateTransform keyTimes="0;1"
                                                values="0 50 50;360 50 50"
                                                dur="1.1904761904761905s"
                                                repeatCount="indefinite"
                                                type="rotate"
                                                attributeName="transform" />
                                        </circle>
                                        <g></g>
                                    </g>
                                </svg>

                            </div>
                        </div>
                    }
                </div>
                <Drawer
                    rootClassName='filter-drawer'
                    open={openFilter1}
                    onClose={() => setOpenFilter1(false)}
                    // getContainer={false}
                    closable={false}
                    styles={{ body: { padding: "0" } }}
                >
                    <div className="border-bottom py-2 px-4">
                        <span className='fw-semibold'>Filter By Date</span>
                    </div>
                    <div className="p-3 d-flex flex-column gap-3">
                        <Row>
                            <Col span={7}>From:</Col>
                            <Col span={17}>
                                <DatePicker 
                                disabledDate={disabledDate}
                                value={stDate}
                                className='filter-date-input'
                                onChange={handleStartDateChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>To:</Col>
                            <Col span={17}>
                                <DatePicker 
                                disabledDate={disabledDate}
                                value={enDate}
                                className='filter-date-input'
                                onChange={handleEndDateChange} />
                            </Col>
                        </Row>
                    </div>
                    <div className="filter-actions">
                        <button className='border-0 p-2'
                            style={{ color: useThemeStyles.primary_color }}
                            onClick={clearFilters}>Clear</button>
                        <button className='border-0 p-2' style={{ background: useThemeStyles.primary_color }} onClick={applyDateFilters}>Apply</button>
                    </div>
                </Drawer>
                <Drawer
                    rootClassName='filter-drawer'
                    open={openFilter2}
                    onClose={() => setOpenFilter2(false)}
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
                    <FilterByType form={form} handleTypeChange={handleTypeChange} />
                    <div className="filter-actions">
                        <button className='border-0 p-2' onClick={clearFilters}>Clear</button>
                        <button className='border-0 p-2' style={{ background: useThemeStyles.primary_color }} onClick={applyFilters}>Apply type</button>
                    </div>
                </Drawer>
            </div>
        </div>
    )
}

export default Wallet

const FilterByType = ({ form, handleTypeChange }) => {
    const options = [
        { label: 'Earned', value: '"Earned"' },
        { label: 'Redeemed', value: '"Redeemed"' },
        { label: 'Expired', value: '"Expired"' },
    ];
    return (
        <Form
            form={form} // Form instance passed from parent
            layout='vertical'
            className=''
        >
            <Form.Item name='checkbox-group'>
                <Checkbox.Group
                    options={options}
                    rootClassName='filter-by-type-checkbox'
                    onChange={handleTypeChange}
                />
            </Form.Item>
        </Form>
    );
};