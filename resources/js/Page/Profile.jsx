import { Avatar, Col, Divider, Modal, Row } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeContext from '../Providers/Contexts/ThemeContext';
import axiosSetup from '@/axiosSetup';

function Profile() {
  const [deleteModal, setDeleteModal] = useState(false);
  const {useThemeStyles} = useContext(ThemeContext);
  const [referPermission,setReferPermission] = useState({})
  const targetDiv = useRef(null)
  const merchant_id = sessionStorage.getItem('merchant_base');
  const [Profileimg, setProfileimg] = useState({})
  useEffect(() => {
    axiosSetup.post('/api/referErn',{merchant_id})
        .then(response => {
          setProfileimg(response.data.user_image);
          setReferPermission(response.data.refer);
        })
        .catch(error => {
            console.log(error);
        });
}, []);
const handleLogout = () => {
  axiosSetup.post('/api/onePageLogout')
    .then(response => {
      // Handle logout success, navigate to login or home page
      console.log('Logout successful');
      setDeleteModal(false); // Close modal after success
      localStorage.removeItem('access_token');
      window.location.reload();
    })
    .catch(error => {
      console.log('Logout failed:', error);
    });
};
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
      <div className="my-5 text-center z-2">
        <Avatar className='z-2 bg-light' size={80} src={Profileimg.image} />
      </div>
      <div className="mx-4 p-4 profile-navigation-container z-3 position-relative rounded-4">
        <Link to={"/Myaccount"} className='cust_text_primary text-decoration-none'>
          <Row className='px-2 py-3' gutter={[15, 0]} align={"middle"}>
            <Col span={3}>
              <div className="text-center">
                <img className='' src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/tpakyx8irfmmosxuxma9.svg" alt="" />
              </div>
            </Col>
            <Col span={21}>
              <div className="d-flex justify-content-between align-items-center">
                <span className='cust_text_primary fw-semibold'>My Account</span>
                <span>
                  <i className='bi bi-chevron-right fs-5' />
                </span>
              </div>
            </Col>
          </Row>
        </Link>
        <Link to={"/Aboutus"} className='cust_text_primary text-decoration-none'>
          <Divider className='m-0' />
          <Row className='px-2 py-3' gutter={[15, 0]} align={"middle"}>
            <Col span={3}>
              <div className="text-center">
                <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/zvdgbkljkuhvcaqdmxo6.svg" alt="" />
              </div>
            </Col>
            <Col span={21}>
              <div className="d-flex justify-content-between align-items-center">
                <span className='cust_text_primary fw-semibold'>About Us</span>
                <span>
                  <i className='bi bi-chevron-right fs-5' />
                </span>
              </div>
            </Col>
          </Row>
        </Link>
        {
          referPermission.referral_permission===1&&
          <Link to={"/Referal"} className='cust_text_primary text-decoration-none'>
          <Divider className='m-0' />
          <Row className='px-2 py-3' gutter={[15, 0]} align={"middle"}>
            <Col span={3}>
              <div className="text-center">
                <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/t0avoukmt5fscuolt8w9.svg" alt="" />
              </div>
            </Col>
            <Col span={21}>
              <div className="d-flex justify-content-between align-items-center">
                <span className='cust_text_primary fw-semibold'>{referPermission.referral_dynamic_name}</span>
                <span>
                  <i className='bi bi-chevron-right fs-5' />
                </span>
              </div>
            </Col>
          </Row>
        </Link>
        }
        <Link to={"/Contact"} className='cust_text_primary text-decoration-none'>
          <Divider className='m-0' />
          <Row className='px-2 py-3' gutter={[15, 0]} align={"middle"}>
            <Col span={3}>
              <div className="text-center">
                <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/wztf1f95mpxhhvutobqs.svg" alt="" />
              </div>
            </Col>
            <Col span={21}>
              <div className="d-flex justify-content-between align-items-center">
                <span className='cust_text_primary fw-semibold'>Contact Us</span>
                <span>
                  <i className='bi bi-chevron-right fs-5' />
                </span>
              </div>
            </Col>
          </Row>
        </Link>
        <Link to={"/T&c"} className='cust_text_primary text-decoration-none'>
          <Divider className='m-0' />
          <Row className='px-2 py-3' gutter={[15, 0]} align={"middle"}>
            <Col span={3}>
              <div className="text-center">
                <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726655651/Frame_277132298_m6wxf0.svg" alt="" />
              </div>
            </Col>
            <Col span={21}>
              <div className="d-flex justify-content-between align-items-center">
                <span className='cust_text_primary fw-semibold'>Terms And Conditions</span>
                <span>
                  <i className='bi bi-chevron-right fs-5' />
                </span>
              </div>
            </Col>
          </Row>
        </Link>
        <Divider className='m-0' />
        <Row className='px-2 py-3' gutter={[15, 0]} align={"middle"} onClick={() => setDeleteModal(true)}>
          <Col span={3}>
            <div className="text-center">
              <img src="https://res.cloudinary.com/dy4g09dtw/image/upload/v1726290869/n4iyfs8cuetah8i9rryu.svg" alt="" />
            </div>
          </Col>
          <Col span={21}>
            <div className="d-flex justify-content-between align-items-center">
              <span className='cust_text_primary fw-semibold'>Logout</span>
              <span>
                <i className='bi bi-chevron-right fs-5' />
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <div className="bg-layer-1 position-absolute bottom-0 z-2">

      </div>
      <div className="bg-layer-2 position-absolute bottom-0 z-2 overflow-hidden">
        <img width={"100%"} src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726483722/Group_1286_izipw4.png" alt="" />
      </div>
      <div className="powered-ewards z-3 position-relative text-light">
        <p> Powered by <a data-v-317407fb="" href="https://myewards.com/" target="_blank" className="">
          <span>e<span className="ewards-color-set">W</span>ards</span></a></p>
      </div>
      {/* Modal */}
      <Modal
        open={deleteModal}
        onOk={handleLogout}
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
            <svg width="345" height="166" viewBox="0 0 345 166" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M345 91.3234L1.65989 165.285C1.10338 165.405 0.548585 165.475 0 165.497V-1H345V91.3234Z" fill={useThemeStyles?.primary_color} />
            </svg>
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
