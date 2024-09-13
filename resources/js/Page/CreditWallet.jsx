import React from 'react'
import { Link } from 'react-router-dom'

function CreditWallet() {
    return (
        <div className='body-container '>
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
                <h6>TOTAL CREDIT BALANCE</h6>
                <span>5,124</span><span> points</span>
            </div>
            <div className="mx-4 rounded-4 wallet-balance-table">
                <div className="wallet-filter-header d-flex justify-content-between align-items-center py-2 px-3">
                    <div className="filter-header-left">
                        Transaction Log
                    </div>

                    <div className="filter-header-right d-flex gap-2">
                        <i className='bi bi-calendar p-1 px-2 rounded-2' />
                        <i className='bi bi-funnel p-1 px-2  rounded-2' />
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
                                <p className='mb-0'>+1,000</p><i className='bi bi-chevron-down'/>
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
        </div>
    )
}

export default CreditWallet
