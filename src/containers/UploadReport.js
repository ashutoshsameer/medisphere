import React, {useCallback, useState} from "react";
import {useDropzone} from 'react-dropzone';
import './UploadReport.css';
import LoaderButton from "../components/LoaderButton";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import {Col, Row} from "react-bootstrap";

export default function UploadReport() {
    const [myFiles, setMyFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        setMyFiles([...myFiles, ...acceptedFiles])
    }, [myFiles]);

    const [isUploading, setIsUploading] = useState(false);
    const [show, setShow] = useState(false);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({multiple: true, onDrop,});

    const files = myFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    function handleUpload(event) {
        event.preventDefault();

        setIsUploading(true);
        const file = myFiles[0];
        const myHeaders = new Headers();
        const API_GOES_HERE = 'iskns8hh2e.execute-api.us-east-1.amazonaws.com/v2/reportupload';
        myHeaders.append("Content-Type", "application/octet-stream");
        fetch(`https://${API_GOES_HERE}?name=${file.name.replaceAll(' ', '_')}`, {
            body: file,
            headers: myHeaders,
            method: "PUT"
        }).then((response) => {
            setIsUploading(false);
            setMyFiles([]);
            setShow(true);
        }).catch((error) => {
            setIsUploading(true);
        });
    }

    function validateForm() {
        return myFiles.length > 0;
    }

    return (
        <>
            <section className="container">
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                </div>
                <br />
                {
                    myFiles.length > 0 ? <aside>
                        <h4>Files</h4>
                        <ul>{files}</ul>
                    </aside> : null
                }

                <Row>
                    <Col md={2}>
                        <LoaderButton
                            size="md"
                            isLoading={isUploading}
                            disabled={!validateForm()}
                            onClick={handleUpload}
                        >
                            Upload
                        </LoaderButton>
                    </Col>
                    <Col md={10}>
                        <ToastContainer position="top-end">
                            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                                <Toast.Body>File Successfully Uploaded</Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                </Row>
            </section>
        </>
    )
}