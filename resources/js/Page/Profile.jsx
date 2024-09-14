import { Avatar, Divider } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

function Profile() {
  return (
    <div className='body-container'>
      <div className="position-sticky top-0 z-1 shadow-sm">
        <div className="navHeader">
          <div className="prev-btn">
            <Link to={"/About"}>
              <i className="bi bi-chevron-left"></i>
            </Link>
            <span>PROFILE</span>
          </div>
        </div>
      </div>
      <div className="border my-4 text-center">
        <Avatar size={80} icon={<i class="bi bi-person-fill" />} />
      </div>

      <div className="mx-4 p-4 profile-navigation-container rounded-4">
        <Link to={"/Myaccount"}>
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img className='' src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/tpakyx8irfmmosxuxma9.svg" alt="" />
            <p className='mb-0'>My Account</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
        </Link>
        <Divider className='m-0' />
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/zvdgbkljkuhvcaqdmxo6.svg" alt="" />
            <p className='mb-0'>About Us</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
        <Divider className='m-0' />
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/t0avoukmt5fscuolt8w9.svg" alt="" />
            <p className='mb-0'>Refer & Earn</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
        <Divider className='m-0' />
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/wztf1f95mpxhhvutobqs.svg" alt="" />
            <p className='mb-0'>Contact Us</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
        <Divider className='m-0' />
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/wztf1f95mpxhhvutobqs.svg" alt="" />
            <p className='mb-0'>Terms & Conditions</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
        <Divider className='m-0' />
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/n4iyfs8cuetah8i9rryu.svg" alt="" />
            <p className='mb-0'>Log Out</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
