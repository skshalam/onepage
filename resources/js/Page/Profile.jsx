import { Avatar, Divider, Modal } from 'antd'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Profile() {
  const [deleteModal, setDeleteModal] = useState(false);
  const targetDiv = useRef(null)
  return (
    <div className='body-container position-relative'>
      <div className="position-absolute h-100 w-100 top-0 bg-layer-main z-1">
        <img width={"100%"} src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726483790/Frame_277132424_hzs2a6.png" alt="" />
      </div>
      <div className="bg-overlay position-absolute w-100 h-100 top-0 bg-dark z-1"></div>
      <div className="position-sticky top-0 z-3 shadow-sm">
        <div className="navHeader">
          <div className="prev-btn">
            <Link to={"/About"}>
              <i className="bi bi-chevron-left"></i>
            </Link>
            <span>PROFILE</span>
          </div>
        </div>
      </div>
      <div className="my-4 text-center z-3">
        <Avatar className='z-3 bg-light' size={80} icon={<i class="bi bi-person-fill text-dark" />} />
      </div>
      <div className="mx-4 p-4 profile-navigation-container z-3 position-relative rounded-4">
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
        <Link to={"/T&c"}>
        <div className="navigaiton-container d-flex justify-content-between p-3">
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/wztf1f95mpxhhvutobqs.svg" alt="" />
            <p className='mb-0'>Terms & Conditions</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
        </Link>
        <Divider className='m-0' />
        <div className="navigaiton-container d-flex justify-content-between p-3" onClick={()=>setDeleteModal(true)}>
          <div className="d-flex gap-2">
            <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/n4iyfs8cuetah8i9rryu.svg" alt="" />
            <p className='mb-0'>Log Out</p>
          </div>
          <div className="">
            <i className='bi bi-chevron-right' />
          </div>
        </div>
      </div>
      <div className="bg-layer-1 position-absolute bottom-0 z-2">

      </div>
      <div className="bg-layer-2 position-absolute bottom-0 z-2 overflow-hidden">
        <img width={"100%"} src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726483722/Group_1286_izipw4.png" alt="" />
      </div>
      {/* Modal */}
      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        closable={false}
        centered
        getContainer={targetDiv.current}
        width={300}
        rootClassName='cust-css-ant-modal'
        styles={{
          footer: {
            display: "grid",
            margin: "20px 10px",
            padding: "0px 20px",
            gridTemplateColumns: "1fr 1fr"
          },
          content: {
            padding: "0px",
            overflow: "hidden",
          }
        }}
      >
        <div className="del-ac-modal-content position-relative">
          <div className="modal-bg position absolute">
            <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726480398/xdbtbbvmgyt91wxi3dj6.png" alt="" />
          </div>
          <div className="position-absolute modal-icon d-flex flex-column gap-0">
            <i className='bi bi-exclamation-circle text-light' />
            <span>Logout ?</span>
          </div>
          <div className="text-center fw-semibold modal-txt px-4">
            <p className='mb-0'>You will be logged out of your account.
            Do you wish to proceed?</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile
