import { Avatar, Upload } from 'antd';
import React, { useState } from 'react';

function FileUploader() {
    const [fileUrl, setFileUrl] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const handleFileChange = (file) => {
        const fileObj = file.file.originFileObj

    }


    return (
        <div>
            {/* <input type="file" onChange={handleFileChange} /> */}
            <Upload
                fileList={fileUrl}
                onChange={handleFileChange}
            >
                <Avatar size={70} />
            </Upload>
        </div>
    );
}

export default FileUploader;
