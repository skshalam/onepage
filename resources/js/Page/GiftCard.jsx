import React from 'react'
import { Link } from 'react-router-dom'

function GiftCard() {
    return (
        <div className='body-container'>
            <div className="sticky-top">
                <div className="navHeader">
                    <div className="prev-btn">
                        <Link to={"/Home"}>
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                        <span>GIFT CARD</span>
                    </div>
                </div>
            </div>

            <div className="card-container">
                <div className="innerCard">
                    <div className="brandName">
                        <span>Coffee To Go</span>
                    </div>

                    <div className="info">
                        <div className="infoLeftHalf">
                            <img src="https://i.imgur.com/ZoluTbe.png" alt="" />
                        </div>
                        <div className="infoRightHalf">
                            <p className='fw-bold m-0'>Gift Card</p>
                            <span>Have a gift code? Let's enter it to claim!</span>
                        </div>
                    </div>

                    <div className="gift-card-input">
                        <input type="text" placeholder='Enter your gift card code' />
                        <button>CLAIM</button>
                    </div>
                </div>

                <div className="purchase-gift-card-container">
                    <button><i className='bi bi-plus' /></button>
                    <div className="purchase-info">
                        <span>Purchase a Gift Card</span>
                        <span>or view previously bought gift card details</span>
                    </div>
                </div>
            </div>
            <div className="powered-ewards">
                <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
                    <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
            </div>
        </div>
    )
}

export default GiftCard
