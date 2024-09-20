// Upload Profile Pic Component
// CHILD
import { Avatar } from 'antd';
import React from 'react';

function UploadProfilePic({ URL, file }) {
    // URL - set function to return the base64Url to parent component state,
    // file - image url state from the parent component
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                URL(reader.result);
            };

            reader.onerror = (error) => {
                console.error('Error reading file:', error);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <>
            <label htmlFor="fileInput" className='position-relative profile-upload-in'>
                <Avatar size={66} src={file} />
                <div className='position-absolute pp-btn' style={{...custStyle.inputBtn}}>
                    <img src="https://res.cloudinary.com/dh8etdmdv/image/upload/v1726730499/Vector_gmvkzf.svg" alt="" />
                </div>
            </label>
            <input style={{ ...custStyle.inputStyle }} type="file" id="fileInput" onChange={handleFileChange} />
        </>
    );
}

export default UploadProfilePic;
// Css Styles Object
const custStyle = {
    inputStyle: {
        display: "none",
    },
    inputBtn:{
        height:"30px",
        width:"30px",
        top:"45px",
        right:"-15px",
        borderRadius:"5px"
    },
    avatarStyle:{
        border:"2px solid #0b0b59",
    }
}