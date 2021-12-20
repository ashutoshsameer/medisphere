import React, {useCallback, useState} from "react";
import {useDropzone} from 'react-dropzone';
import './UploadReport.css';
import LoaderButton from "../components/LoaderButton";
import {Col, Row} from "react-bootstrap";
import {Snackbar} from "@material-ui/core";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useAppContext} from "../lib/contextLib";

export default function UploadReport() {
    const [myFiles, setMyFiles] = useState([]);
    const [reportType, setReportType] = useState('');

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

    const reportTypes = [
        {
            label: 'X Ray',
            value: 1
        },
        {
            label: 'MRI',
            value: 2
        },
        {
            label: 'PET Scan',
            value: 3
        },
        {
            label: 'CT Scan',
            value: 4
        },
        {
            label: 'Ultrasound',
            value: 5
        },
        {
            label: 'Blood Test',
            value: 6
        },
        {
            label: 'Other',
            value: 7
        },
    ];

    const { userDetails } = useAppContext();

    function handleUpload(event) {
        event.preventDefault();

        setIsUploading(true);
        const file = myFiles[0];
        const myHeaders = new Headers();
        myHeaders.append("file_name", `${userDetails.username}/${file["name"]}`);
        myHeaders.append("Content-Type", "application/octet-stream");

        fetch(`https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/file`,{
            body: file,
            headers: myHeaders,
            method: "PUT"
        }).then((response) => {
            setIsUploading(false);
            setMyFiles([]);
            setShow(true);
            setReportType('');
        }).catch((error) => {
            setIsUploading(true);
        });
    }

    function validateForm() {
        return myFiles.length > 0 && reportType !== '';
    }

    function handleReportTypeChange(event) {
        setReportType(event.target.value);
    }

    return (
        <div>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={show}
                onClose={() => setShow(false)}
                message="File Uploaded Successfully"
                key={'topright'}
            />
            <section className="container">
                <Col md={4}>
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Report Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={reportType}
                                label="Report Type"
                                onChange={handleReportTypeChange}
                            >
                                {
                                    reportTypes.map((type, idx) => (
                                        <MenuItem value={type.value} key={`report_type_${idx}`}>{type.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </Col>
                <br/>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                </div>
                <br/>
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
                </Row>
            </section>
        </div>
    )
}