import { Checkbox, Col, DatePicker, Drawer, Form, Row, Tabs, Spin, message } from 'antd';
import { form } from 'framer-motion/client';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Router, useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import axiosSetup from '@/axiosSetup';
import ThemeContext from '../Providers/Contexts/ThemeContext';
import { debounce } from 'lodash';
import { formatNumberWithCommas } from '../utility/formating';
import dayjs from 'dayjs';
function CreditWallet() {
    const [openFilter1, setOpenFilter1] = useState(false);
    const [openFilter2, setOpenFilter2] = useState(false);
    const [creditwalletData, setCreditWalletData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(0); // Track total pages
    const [isLoading, setIsLoading] = useState(false); // To prevent multiple API calls at the same time
    const [scrollLoad, setScrollLoad] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState("");
    const [pendingSelectedTypes, setPendingSelectedTypes] = useState("");
    const [selectedSources, setSelectedSources] = useState("");
    const [pendingSelectedSources, setPendingSelectedSources] = useState("");
    const [currentPoints, setCurrentPoints] = useState(0);
    const [stDate,setStDate] = useState(null);
    const [enDate,setEnDate] = useState(null);
    const [startDate, setStartDate] = useState(""); // To store start date
    const [endDate, setEndDate] = useState(""); // To store end date
    const [pendingStartDate, setPendingStartDate] = useState(""); // Temporary state for start date
    const [pendingEndDate, setPendingEndDate] = useState(""); // Temporary state for end date
    const [form] = Form.useForm();
    const [active, setActive] = useState(false);
    const [collaspable, setCollaspable] = useState(false);
    const [current, setCurrent] = useState(0)
    const { useThemeStyles } = useContext(ThemeContext);
    const [filterCount,setFilterCount] = useState(0);
    const [isCalenderActive,setIsCalenderActive] = useState(false);
    const [isFilterActive,setIsFilterActive] = useState(false);
    const [c1,setC1] = useState(0);
    const [c2,setC2] = useState(0);

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
        setStDate(date)
        setPendingStartDate(dateString); // Store the pending start date
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
            loadCreditWalletData(currentPage, selectedTypes, selectedSources, startDate, endDate);
        }
    }, []);
    useEffect(() => {
        if (currentPage > 1) {
            setScrollLoad(true);
            setTimeout(() => {
                loadCreditWalletData(currentPage, selectedTypes, selectedSources, startDate, endDate);
            }, 1500);
        }
    }, [currentPage]);

    const loadCreditWalletData = debounce(async (page, types = "", sources = "", start_date = "", end_date = "") => {
        if (page===1) {
            setIsLoading(true)
        } else {
            setScrollLoad(true)
        }
        try {
            const response = await axiosSetup.post('/api/creditbalance', {
                page_number: page,
                credit_type: types,      // Ensure the current filter values are passed here
                credit_name: sources,    // Pass sources as filter
                start_date: start_date,  // Pass start_date filter
                end_date: end_date       // Pass end_date filter
            });

            const { creditbalance, total_pages } = response.data;
            setOpenFilter2(false);
            setCurrentPoints(response.data.current_points);

            if (page === 1) {
                setCreditWalletData(creditbalance); // On first page, replace data
            } else {
                setCreditWalletData(prevData => [...prevData, ...creditbalance]); // Append data for pagination
            }
            setTotalPages(total_pages); // Set total pages
        } catch (error) {
            console.error('API Error:', error);
        }

        setIsLoading(false);
        setScrollLoad(false);
    }, 300)

    const clearFilters = () => {
        form.resetFields();
        setPendingSelectedTypes("");
        setPendingSelectedSources("");
        setStDate(null);
        setEnDate(null)
        setSelectedTypes("");
        setSelectedSources("");
        setOpenFilter2(false);
        setCurrentPage(1);
        loadCreditWalletData(1, "", "", "", "");
        setOpenFilter1(false);
        setFilterCount(0);
        setIsCalenderActive(false)
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

    const handleSourceChange = (checkedValues) => {
        let count = checkedValues.length
        setC2(count);
        const sourceString = checkedValues.join(",");
        setPendingSelectedSources(sourceString);
    };

    useEffect(() => {
        setFilterCount(c1 + c2)
    }, [c1, c2])

    const applyFilters = () => {
        setSelectedTypes(pendingSelectedTypes); // Store the selected types
        setSelectedSources(pendingSelectedSources); // Store the selected sources
        setStartDate(pendingStartDate); // Store the start date
        setEndDate(pendingEndDate); // Store the end date
        setCurrentPage(1); // Reset to first page
        loadCreditWalletData(1, pendingSelectedTypes, pendingSelectedSources, pendingStartDate, pendingEndDate); // Load data based on selected filters
        setOpenFilter1(false);
        setOpenFilter2(false);
        setIsFilterActive(true)
    };
    const applyDateFilters =()=>{
        setStartDate(pendingStartDate); // Store the start date
        setEndDate(pendingEndDate); // Store the end date
        setCurrentPage(1); // Reset to first page
        loadCreditWalletData(1, pendingSelectedTypes, pendingSelectedSources, pendingStartDate, pendingEndDate);
        setOpenFilter1(false);
        setIsCalenderActive(true)
    }
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
    const handleCollaspe = (index) => {
        setCurrent(index);
        if (current === index) {
            setCollaspable(!collaspable)
            setActive(!active)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, selectedTypes, selectedSources, startDate, endDate, isLoading]);
    return (
        <div className='onepage-main-body'>
            <div className='onepage-set-body creditpage-body'>
                <div className="position-sticky top-0 z-1 shadow-sm">
                    <div className="navHeader">
                        <div className="prev-btn">
                            <Link to={"/Home"}>
                                <i className="bi bi-chevron-left"></i>
                            </Link>
                            <span>CREDIT BALANCE</span>
                        </div>
                    </div>
                </div>
                <div className="px-3 text-center my-4 wallet-credit-info">
                    <h6>TOTAL CREDIT BALANCE</h6>
                    <span>{formatNumberWithCommas(currentPoints)}</span><span>Points</span>
                </div>
                <div className="mx-4 rounded-4 wallet-balance-table ">
                    <div className="wallet-filter-header d-flex justify-content-between align-items-center py-2 px-3">
                        <div className="filter-header-left">
                            Transaction Log
                        </div>

                        <div className="filter-header-right d-flex gap-2">
                            <i className={`bi ${!isCalenderActive?'bi-calendar':'bi-calendar-fill'} p-1 px-2 rounded-2`} onClick={() => setOpenFilter1(true)} />
                            <i className={`bi ${filterCount > 0 && isFilterActive ? 'bi-funnel-fill' : 'bi-funnel'} p-1 px-2  rounded-2`} onClick={() => setOpenFilter2(true)} />
                                {(filterCount>0&&isFilterActive)&&<div className={"filter-count"}>{filterCount}</div>}
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
                                            <div key={crwallet + index} className={`wallet-detail-container p-2 px-3 ${(crwallet.Type === "Expired") ? "credit-expired-main" : ""}`}>
                                                <div className="wallet-detail-container-top d-flex justify-content-between align-items-center">
                                                    {/* <span>{index}</span> */}
                                                    <div className="wallet-name">
                                                        <p className='fw-bold mb-0'>
                                                            {crwallet.Credit_Name}
                                                        </p>
                                                    </div>
                                                    <div className="wallet-expire">
                                                        <p className='mb-0'>
                                                            Valid till <span>{crwallet.Valid_Till !== "0000-00-00" ? formatDate(crwallet.Valid_Till) : '-'}
                                                                <b className='credit-expired'>{crwallet.Type === "Expired" ? " | Expired" : ""}</b></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="wallet-detail-container-middle d-flex justify-content-between align-items-center">
                                                    <div className="invoice-number">
                                                        Invoice Number: <span>{crwallet.Invoice_Number}</span>
                                                    </div>
                                                    <div className="wallet-transaction-value d-flex gap-1">
                                                        <p className={`mb-0 ${crwallet.Type === "Expired" || crwallet.Type === "Redeemed" ? "credit-expired" : ""}`}>{crwallet.Type === "Earned" ? "+" : "-"}{crwallet.Points}</p><i className={`bi bi-chevron-down collapse-icon ${current === index && collaspable ? "active" : ""}`} onClick={() => { handleCollaspe(index) }} />
                                                    </div>
                                                </div>
                                                <div className="wallet-detail-container-bottom d-flex justify-content-between align-items-center">
                                                    <div className="wallet-balance">
                                                        <p className='mb-2'>{crwallet.Formatted_Billing_Date} <span>{crwallet.formatted_time}</span></p>
                                                    </div>
                                                </div>
                                                <div className={`wallet-details-collaspable overflow-hidden ${current === index && collaspable ? "active" : ""}`}>
                                                    <div className="mx-3 mt-2">
                                                        <div className="wallet-details">
                                                            <p className='mb-1'>Bill Amount:</p>
                                                            <span>{crwallet.Billing_Amount}</span>
                                                        </div>
                                                        <div className="wallet-details">
                                                            <p className='mb-1'>Transaction ID:</p>
                                                            <span>{crwallet.Transaction_id}</span>
                                                        </div>
                                                        <div className="wallet-details">
                                                            <p className='mb-1'>Account:</p>
                                                            <span>{crwallet.Account}</span>
                                                        </div>
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
                                value={stDate}
                                className='filter-date-input'
                                disabledDate={disabledDate}
                                onChange={handleStartDateChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>To:</Col>
                            <Col span={17}>
                                <DatePicker
                                value={enDate} 
                                className='filter-date-input'
                                disabledDate={disabledDate}
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
                    // getContainer={false}
                    closable={false}
                    styles={{ body: { padding: "0" } }}
                >
                    <Tabs defaultActiveKey="1" rootClassName='filter-by-type-nav' items={[
                        {
                            key: '1',
                            label: 'Type',
                            children: <FilterByType form={form} handleTypeChange={handleTypeChange} />,
                        },
                        {
                            key: '2',
                            label: 'Source',
                            children: <FilterBySource handleSourceChange={handleSourceChange} />,
                        }
                    ]} />
                    <div className="filter-actions">
                        <button className='border-0 p-2' style={{ color: useThemeStyles.primary_color }} onClick={clearFilters}>Clear</button>
                        <button className='border-0 p-2' style={{ background: useThemeStyles.primary_color }} onClick={applyFilters}>Apply type</button>
                    </div>
                </Drawer>
            </div>
        </div>
    )
}

export default CreditWallet

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
const FilterBySource = ({ handleSourceChange }) => {
    const options = [
        { label: 'Loyalty', value: '"Loyalty Credits"' },
        { label: 'Bonus', value: '"Bonus Credits"' },
        { label: 'e-wallet', value: '"eWallet Credits"' },
        { label: 'Feedback Credits', value: '"Feedback Credits"' },
    ];
    return (
        <Form layout='vertical'>
            <Form.Item name='checkbox-group'>
                <Checkbox.Group className='filter-by-type-checkbox' options={options} onChange={handleSourceChange} />
            </Form.Item>
        </Form>
    );
};