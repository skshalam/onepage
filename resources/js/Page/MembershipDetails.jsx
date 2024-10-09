import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThemeContext from '../Providers/Contexts/ThemeContext';
import axiosSetup from '@/axiosSetup';
import Pagination from 'react-bootstrap/Pagination';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { debounce } from 'lodash';
function MembershipDetails() {
    const [showModal, setModal] = useState(false);
    const [title, setTitle] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    const { membership_id } = useParams();
    const decodedMembershipId = atob(membership_id);
    const { useThemeStyles } = useContext(ThemeContext);

    const [membershipDetails, setMembershipDetails] = useState({})

    // State for e-Wallets
    const [eWalletissueDesc, seteWalletissueDesc] = useState([]);
    const [eWalletCurrentPage, seteWalletCurrentPage] = useState(1);
    const [eWalletTotalPages, seteWalletTotalPages] = useState(1);

    // State for Booklets
    const [bookletissueDesc, setbookletissueDesc] = useState([]);
    const [bookletCurrentPage, setBookletCurrentPage] = useState(1);
    const [bookletTotalPages, setBookletTotalPages] = useState(1);

    // State for Coupons
    const [couponsredeemDesc, setcouponsredeemDesc] = useState([]);
    const [couponsCurrentPage, setCouponsCurrentPage] = useState(1);
    const [couponsTotalPages, setCouponsTotalPages] = useState(1);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/eWalletissue',
                {
                    membership_id: decodedMembershipId,
                    page_number: eWalletCurrentPage
                })
                .then(response => {
                    seteWalletissueDesc(response.data.data);
                    seteWalletCurrentPage(response.data.current_page);
                    seteWalletTotalPages(response.data.total_pages);
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, [decodedMembershipId, eWalletCurrentPage]);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/bookletissue',
                {
                    membership_id: decodedMembershipId,
                    page_number: bookletCurrentPage
                })
                .then(response => {
                    setbookletissueDesc(response.data.data);
                    setBookletCurrentPage(response.data.current_page);
                    setBookletTotalPages(response.data.total_pages);
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, [decodedMembershipId, bookletCurrentPage]);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/couponsredeem',
                {
                    membership_id: decodedMembershipId,
                    page_number: couponsCurrentPage
                })
                .then(response => {
                    setcouponsredeemDesc(response.data.data.coupon_redeem);
                    setCouponsCurrentPage(response.data.current_page);
                    setCouponsTotalPages(response.data.total_pages);
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, [decodedMembershipId, couponsCurrentPage]);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axiosSetup.post('/api/memebership',
                {
                    membership_id: decodedMembershipId,
                })
                .then(response => {
                    setMembershipDetails(response.data.data.membership[0]);
                    setDataLoading(false);
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        } else {
            console.log('No token available, API call skipped');
        }
    }, [decodedMembershipId]);


    return (
        <SkeletonTheme baseColor="#c7c7c7" highlightColor="#ffffff">
            <div className='body-container membership-package-body'>
                <div className="border-0 border-bottom">
                    <div className="navHeader">
                        <div className="prev-btn">
                            <Link to={"/Membership"}>
                                <i className="bi bi-chevron-left"></i>
                            </Link>
                            <span>MEMBERSHIP PACKAGE</span>
                        </div>
                    </div>
                </div>
                <div className="membership-package-details d-flex justify-content-between mt-3 text-light px-3">
                    <div className="package-info d-flex flex-column">
                        {
                            dataLoading
                                ? <Skeleton className='' style={{ height: "25px", width: "110px" }} />
                                : <span className='fs-5 fw-bold text-uppercase'>
                                    {membershipDetails.name}
                                </span>}
                        <div className="d-flex gap-2" style={{ fontSize: "15px" }}>
                            <p>
                                Start Date:
                                {dataLoading
                                    ? <Skeleton className='ms-1' style={{ height: "15px", width: "75px" }} />
                                    : <span className='ms-1'>{membershipDetails?.start_date}</span>
                                }
                            </p>|<p>
                                End Date:
                                {dataLoading
                                    ? <Skeleton className='ms-1' style={{ height: "15px", width: "75px" }} />
                                    : <span className='ms-1'>{membershipDetails?.end_date}</span>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="package-status d-flex justify-content-center position-relative">
                        <svg width="70" height="70" viewBox="0 0 64 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.5 1.59808C30.2846 -0.00961983 33.7154 -0.00961888 36.5 1.59808L58.6769 14.4019C61.4615 16.0096 63.1769 18.9808 63.1769 22.1962V47.8038C63.1769 51.0192 61.4615 53.9904 58.6769 55.5981L36.5 68.4019C33.7154 70.0096 30.2846 70.0096 27.5 68.4019L5.32308 55.5981C2.53848 53.9904 0.823086 51.0192 0.823086 47.8038V22.1962C0.823086 18.9808 2.53848 16.0096 5.32309 14.4019L27.5 1.59808Z" fill={membershipDetails.expired ? "#FF3B3B" : "#4DB12A"} />
                        </svg>
                        <span className='position-absolute fw-semibold'>
                            {membershipDetails.expired ? "EXPIRED" : "ACTIVE"}
                        </span>
                    </div>
                </div>
                {/* background */}
                <div className="bg-shape d-flex justify-content-center position-absolute w-100 one">
                    <img src="https://i.imgur.com/UTAJ31K.png" alt="" />
                    <div className="position-absolute top-0 d-flex flex-column gap-3 ewallet-details-body">
                        <div onClick={() => { setModal(true), setTitle("e-Wallets Issued") }} className="shadow rounded-3 p-2 px-3 d-flex align-items-center gap-4 ewallet-details-sub">
                            <div className="d-flex align-item-center justify-content-center position-relative">
                                <div className="">
                                    <svg width="40" height="46" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.386 0.931864C19.3847 0.355224 20.6153 0.355224 21.614 0.931863L38.3046 10.5681C39.3033 11.1448 39.9186 12.2104 39.9186 13.3637V32.6363C39.9186 33.7896 39.3033 34.8552 38.3046 35.4319L21.614 45.0681C20.6153 45.6448 19.3847 45.6448 18.386 45.0681L1.69545 35.4319C0.696682 34.8552 0.0814152 33.7896 0.0814152 32.6363V13.3637C0.0814152 12.2104 0.696682 11.1448 1.69545 10.5681L18.386 0.931864Z"
                                            fill={useThemeStyles?.primary_color} />
                                    </svg>

                                </div>
                                <div className="position-absolute" style={{ top: "10px" }}>
                                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.36035 7.83911H8.45392" stroke="white" strokeWidth="1.16009" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16.8317 8.61255H14.819C13.439 8.61255 12.3203 9.65129 12.3203 10.9327C12.3203 12.2142 13.439 13.2529 14.819 13.2529H16.8317C16.8962 13.2529 16.9284 13.2529 16.9556 13.2513C17.3727 13.2258 17.7049 12.9174 17.7323 12.5301C17.7341 12.5048 17.7341 12.4749 17.7341 12.4151V9.45036C17.7341 9.39058 17.7341 9.36065 17.7323 9.33536C17.7049 8.94805 17.3727 8.63962 16.9556 8.61417C16.9284 8.61255 16.8962 8.61255 16.8317 8.61255Z" stroke="white" strokeWidth="1.16009" />
                                        <path d="M16.934 8.61256C16.8739 7.16454 16.68 6.27673 16.0549 5.65169C15.1489 4.74561 13.6905 4.74561 10.7739 4.74561H8.45374C5.53709 4.74561 4.07877 4.74561 3.17268 5.65169C2.2666 6.55778 2.2666 8.01612 2.2666 10.9327C2.2666 13.8494 2.2666 15.3077 3.17268 16.2138C4.07877 17.1199 5.53709 17.1199 8.45374 17.1199H10.7739C13.6905 17.1199 15.1489 17.1199 16.0549 16.2138C16.68 15.5888 16.8739 14.7009 16.934 13.2529" stroke="white" strokeWidth="1.16009" />
                                        <path d="M5.36035 4.74571L8.24935 2.83012C9.06289 2.29067 10.1651 2.29067 10.9787 2.83012L13.8677 4.74571" stroke="white" strokeWidth="1.16009" strokeLinecap="round" />
                                        <path d="M14.6338 10.9329H14.6409" stroke="white" strokeWidth="1.54678" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="fw-semibold">
                                e-Wallet Issued
                            </div>
                            <div className="ms-auto">
                                <i className='bi bi-chevron-right fw-bold' />
                            </div>
                        </div>
                        <div onClick={() => { setModal(true), setTitle("Booklets Issued") }} className="shadow rounded-3 p-2 px-3 d-flex align-items-center gap-4 ewallet-details-sub">
                            <div className="d-flex align-item-center justify-content-center position-relative">
                                <div className="">
                                    <svg width="40" height="46" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.386 0.931864C19.3847 0.355224 20.6153 0.355224 21.614 0.931863L38.3046 10.5681C39.3033 11.1448 39.9186 12.2104 39.9186 13.3637V32.6363C39.9186 33.7896 39.3033 34.8552 38.3046 35.4319L21.614 45.0681C20.6153 45.6448 19.3847 45.6448 18.386 45.0681L1.69545 35.4319C0.696682 34.8552 0.0814152 33.7896 0.0814152 32.6363V13.3637C0.0814152 12.2104 0.696682 11.1448 1.69545 10.5681L18.386 0.931864Z" fill={useThemeStyles.primary_color} />
                                    </svg>

                                </div>
                                <div className="position-absolute" style={{ top: "10px" }}>
                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.5 5.18181C8.67492 4.13169 7.40304 3.08157 4.25089 3.00451C4.04385 2.99945 3.875 3.16763 3.875 3.37473C3.875 4.91109 3.875 10.7275 3.875 12.4477C3.875 12.6548 4.04386 12.8175 4.25086 12.8242C7.40304 12.9273 8.67492 14.3248 9.5 15.375M9.5 5.18181C10.3251 4.13169 11.5969 3.08157 14.7491 3.00451C14.9562 2.99945 15.125 3.16385 15.125 3.37095C15.125 5.08835 15.125 10.7298 15.125 12.4472C15.125 12.6543 14.9562 12.8175 14.7492 12.8242C11.597 12.9273 10.3251 14.3248 9.5 15.375M9.5 5.18181V15.375" stroke="white" strokeLinejoin="round" />
                                        <path d="M14.9265 4.5H16.625C16.8321 4.5 17 4.66789 17 4.875V14.6542C17 14.9577 16.6425 15.1593 16.3651 15.0361C15.7688 14.7711 14.7736 14.4474 13.4706 14.4474C11.2647 14.4474 9.5 15.75 9.5 15.75C9.5 15.75 7.73529 14.4474 5.52941 14.4474C4.22634 14.4474 3.23117 14.7711 2.63485 15.0361C2.35751 15.1593 2 14.9577 2 14.6542V4.875C2 4.66789 2.16789 4.5 2.375 4.5H4.07353" stroke="white" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="fw-semibold">
                                Booklet Issued
                            </div>
                            <div className="ms-auto">
                                <i className='bi bi-chevron-right fw-bold' />
                            </div>
                        </div>
                        <div onClick={() => { setModal(true), setTitle("Coupons Redeemed") }} className="shadow rounded-3 p-2 px-3 d-flex align-items-center gap-4 ewallet-details-sub">
                            <div className="d-flex align-item-center justify-content-center position-relative">
                                <div className="">
                                    <svg width="40" height="46" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.386 0.931864C19.3847 0.355224 20.6153 0.355224 21.614 0.931863L38.3046 10.5681C39.3033 11.1448 39.9186 12.2104 39.9186 13.3637V32.6363C39.9186 33.7896 39.3033 34.8552 38.3046 35.4319L21.614 45.0681C20.6153 45.6448 19.3847 45.6448 18.386 45.0681L1.69545 35.4319C0.696682 34.8552 0.0814152 33.7896 0.0814152 32.6363V13.3637C0.0814152 12.2104 0.696682 11.1448 1.69545 10.5681L18.386 0.931864Z" fill={useThemeStyles.primary_color} />
                                    </svg>

                                </div>
                                <div className="position-absolute" style={{ top: "10px" }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_393_548)">
                                            <path d="M2.2463 4.05257C2.2463 3.05536 3.05508 2.24658 4.05149 2.24658H4.87305C5.3489 2.24658 5.80638 2.05815 6.1449 1.72203L6.71899 1.14718C7.42238 0.44059 8.56569 0.437396 9.27228 1.14079L9.27947 1.14718L9.85432 1.72203C10.192 2.05815 10.6495 2.24658 11.1262 2.24658H11.9469C12.9441 2.24658 13.7529 3.05536 13.7529 4.05257V4.87253C13.7529 5.34997 13.9413 5.80666 14.2775 6.14518L14.8523 6.71999C15.5589 7.42338 15.5629 8.5659 14.8595 9.27328L14.8523 9.28047L14.2775 9.85532C13.9413 10.1922 13.7529 10.6505 13.7529 11.1264V11.9479C13.7529 12.9451 12.9441 13.7531 11.9469 13.7531H11.1262C10.6495 13.7531 10.192 13.9423 9.85432 14.2785L9.27947 14.8525C8.57687 15.5599 7.43356 15.5631 6.72617 14.8597C6.72378 14.8573 6.72138 14.8549 6.71899 14.8525L6.1449 14.2785C5.80638 13.9423 5.3489 13.7531 4.87305 13.7531H4.05149C3.05508 13.7531 2.2463 12.9451 2.2463 11.9479V11.1264C2.2463 10.6505 2.05708 10.1922 1.72095 9.85532L1.1469 9.28047C0.439514 8.57708 0.436321 7.43376 1.13971 6.72718L1.1469 6.71999L1.72095 6.14518C2.05708 5.80666 2.2463 5.34997 2.2463 4.87253V4.05257Z" stroke="white" strokeWidth="1.1976" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5.94824 10.0513L10.052 5.94751" stroke="white" strokeWidth="1.1976" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.049 10.6525C9.88932 10.6525 9.73762 10.5886 9.62584 10.4769C9.56996 10.421 9.53004 10.3491 9.4981 10.2773C9.46616 10.2054 9.4502 10.1343 9.4502 10.0537C9.4502 9.97387 9.46616 9.89403 9.4981 9.82217C9.53004 9.75032 9.56996 9.68644 9.62584 9.63056C9.8494 9.407 10.2486 9.407 10.4722 9.63056C10.528 9.68644 10.5759 9.75032 10.6079 9.82217C10.6318 9.89403 10.6478 9.97387 10.6478 10.0537C10.6478 10.1343 10.6318 10.2054 10.6079 10.2773C10.5759 10.3491 10.528 10.421 10.4722 10.4769C10.3604 10.5886 10.2087 10.6525 10.049 10.6525Z" fill="white" />
                                            <path d="M5.94548 6.54883C5.86564 6.54883 5.79379 6.53206 5.72193 6.50013C5.65007 6.46819 5.57822 6.42907 5.52233 6.37321C5.46644 6.30934 5.42652 6.24547 5.39458 6.17361C5.36265 6.10096 5.34668 6.0299 5.34668 5.95006C5.34668 5.86942 5.36265 5.79038 5.39458 5.71852C5.42652 5.64667 5.46644 5.57481 5.52233 5.52691C5.75387 5.30255 6.14508 5.30255 6.36864 5.52691C6.4804 5.63788 6.54428 5.79038 6.54428 5.95006C6.54428 6.0299 6.53629 6.10096 6.50436 6.17361C6.47242 6.24547 6.42452 6.30934 6.36864 6.37321C6.31275 6.42907 6.24888 6.46819 6.17702 6.50013C6.10516 6.53206 6.02532 6.54883 5.94548 6.54883Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_393_548">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="fw-semibold">
                                Coupons Redeemed
                            </div>
                            <div className="ms-auto">
                                <i className='bi bi-chevron-right fw-bold' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-shape position-absolute w-100 two">
                    <img src="https://i.imgur.com/6bAQtCI.png" alt="" />
                </div>
                <ViewMemberShip showModal={showModal} setModal={setModal} title={title} membership_id={membership_id} eWalletissueDesc={eWalletissueDesc} bookletissueDesc={bookletissueDesc} couponsredeemDesc={couponsredeemDesc}

                    eWalletCurrentPage={eWalletCurrentPage}
                    seteWalletCurrentPage={seteWalletCurrentPage}
                    eWalletTotalPages={eWalletTotalPages}

                    bookletCurrentPage={bookletCurrentPage}
                    setBookletCurrentPage={setBookletCurrentPage}
                    bookletTotalPages={bookletTotalPages}

                    couponsCurrentPage={couponsCurrentPage}
                    setCouponsCurrentPage={setCouponsCurrentPage}
                    couponsTotalPages={couponsTotalPages} />
            </div>
        </SkeletonTheme>
    )
}

export default MembershipDetails

function ViewMemberShip({ showModal, setModal, title, eWalletissueDesc, bookletissueDesc, couponsredeemDesc,
    membership_id, eWalletCurrentPage, seteWalletCurrentPage, eWalletTotalPages,
    bookletCurrentPage, setBookletCurrentPage, bookletTotalPages,
    couponsCurrentPage, setCouponsCurrentPage, couponsTotalPages }) {
    // const handlePagination = (pageNumber, type) => {
    //     if (type === 'eWallet') {
    //         seteWalletCurrentPage(pageNumber);
    //     } else if (type === 'Booklets') {
    //         setBookletCurrentPage(pageNumber);
    //     } else if (type === 'Coupons') {
    //         setCouponsCurrentPage(pageNumber);
    //         console.log(pageNumber);
    //     }
    // };
    const handlePaginationDebounced = debounce((pageNumber, type) => {
        if (type === 'eWallet') {
            seteWalletCurrentPage(pageNumber);
        } else if (type === 'Booklets') {
            setBookletCurrentPage(pageNumber);
        } else if (type === 'Coupons') {
            setCouponsCurrentPage(pageNumber);
        }
    }, 1000); // 300ms debounce time, adjust as needed

    const handlePagination = (pageNumber, type) => {
        handlePaginationDebounced(pageNumber, type);
    };
    return (
        <div
            className={`position-absolute h-100 top-0 w-100 view-membership-details
                d-flex justify-content-center align-items-center
            ${showModal ? "show" : ""}`}
        >
            <div
                className="exit-table w-100 h-100 position-absolute"
                onClick={() => setModal(false)}
            ></div>
            <div className="position-absolute w-100 px-3 wallet-paginate">
                <div className="border bg-light rounded-4 shadow membership-drawer-container">
                    <div className="membership-view-header d-flex justify-content-between align-items-center">
                        <span className='fw-semibold'>{title}</span>
                        <i className='bi bi-x fs-5' onClick={() => setModal(false)} />
                    </div>

                    {title === "e-Wallets Issued" && (
                        <div className='ewallet-issue'>
                            <table className='membership-view-table multiple-cell'>
                                <thead>
                                    <tr>
                                        <th>e-Wallet Name</th>
                                        <th>Top-up Value</th>
                                        <th>Validity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eWalletissueDesc.map((wallet, index) => (
                                        <tr key={index}>
                                            <td>{wallet.name}</td>
                                            <td>{wallet.credit}</td>
                                            <td>{wallet.credit_validity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {eWalletTotalPages > 1 && (
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => handlePagination(eWalletCurrentPage - 1, 'eWallet')}
                                        disabled={eWalletCurrentPage === 1}
                                    />
                                    {Array.from({ length: eWalletTotalPages }, (_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === eWalletCurrentPage}
                                            onClick={() => handlePagination(index + 1, 'eWallet')} size="sm">
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePagination(eWalletCurrentPage + 1, 'eWallet')}
                                        disabled={eWalletCurrentPage === eWalletTotalPages}
                                    />
                                </Pagination>
                            )}
                        </div>
                    )}
                    {title === "Booklets Issued" && (
                        <div className='booklet-issue'>
                            <table className='membership-view-table'>
                                <thead>
                                    <tr>
                                        <th>Booklet Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookletissueDesc.map((booklet, index) => (
                                        <tr key={index}>
                                            <Link className='fw-semibold text-decoration-none' to={`/Bookletissue_details/${membership_id}/${booklet.id}/`}>
                                                <td className='d-flex justify-content-between'>
                                                    {booklet.name}
                                                    <span>
                                                        <i className='bi bi-chevron-right' />
                                                    </span>
                                                </td>
                                            </Link>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {bookletTotalPages > 1 && (
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => handlePagination(bookletCurrentPage - 1, 'Booklets')}
                                        disabled={bookletCurrentPage === 1}
                                    />
                                    {Array.from({ length: bookletTotalPages }, (_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === bookletCurrentPage}
                                            onClick={() => handlePagination(index + 1, 'Booklets')}>
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePagination(bookletCurrentPage + 1, 'Booklets')}
                                        disabled={bookletCurrentPage === bookletTotalPages}
                                    />
                                </Pagination>
                            )}
                        </div>
                    )}

                    {title === "Coupons Redeemed" && (
                        <div className='coupon-redeem'>
                            <table className='membership-view-table multiple-cell'>
                                <thead>
                                    <tr>
                                        <th>Coupon Name</th>
                                        <th>Coupon Code</th>
                                        <th>Redeemed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {couponsredeemDesc.map((coupon, index) => (
                                        <tr key={index}>
                                            <td>{coupon.name}</td>
                                            <td>{coupon.token_code}</td>
                                            <td>{coupon.redeem_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {title === "Coupons Redeemed" && couponsTotalPages > 1 && (
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => handlePagination(couponsCurrentPage - 1, 'Coupons')}
                                        disabled={couponsCurrentPage === 1}
                                    />
                                    {Array.from({ length: couponsTotalPages }, (_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === couponsCurrentPage}
                                            onClick={() => handlePagination(index + 1, 'Coupons')}>
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePagination(couponsCurrentPage + 1, 'Coupons')}
                                        disabled={couponsCurrentPage === couponsTotalPages}
                                    />
                                </Pagination>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
