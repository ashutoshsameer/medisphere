import React, {useEffect, useState} from "react";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import {Container, Snackbar} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import EditIcon from '@material-ui/icons/Edit';
import {useAppContext} from "../lib/contextLib";
import SaveIcon from '@material-ui/icons/Save';

export default function Profile() {
    const [clicked1, setClicked1] = useState(false);
    const [clicked2, setClicked2] = useState(false);

    const {userDetails, setUserProfile} = useAppContext();

    useEffect(() => {
        const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
        fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/profile?id=' + userDetails.username,
            {
                method: 'GET',
                headers: headers
            })
            .then(data => data.json())
            .then(data => {
                data['id'] = userDetails.username;
                setValues(data);
                setUserProfile(data);
            })
            .catch((error) => console.error(error));
    }, [userDetails.username]);

    async function awsCall(body) {
        const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
        fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/profile',
            {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(body)
            })
            .then(data => data.json())
            .then(data => {
                setShow(true);
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleClick = (id1, id2, clicked, setClicked) => {
        if (clicked) {
            document.getElementById(id1).style.visibility = "visible";
            document.getElementById(id2).style.visibility = "hidden";
            setClicked(false);
            awsCall(values);
        } else {
            document.getElementById(id1).style.visibility = "hidden";
            document.getElementById(id2).style.visibility = "visible";
            setClicked(true)
        }
    }

    const [values, setValues] = useState({
        weight: '',
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        phone: '',
        area_code: '',
        id: userDetails.username,
        dob: '',
        height: '',
        blood_type: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    const [show, setShow] = useState(false);

    return (
        <Container maxWidth="xs">
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={show}
                onClose={() => setShow(false)}
                message="Data Updated Successfully"
                key={'topright'}
            />
            <Row>
                <Col md={6} xs={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>About You</Typography>
                </Col>
                <Col md={{span: 6, offset: 0}} style={{padding: '10px'}} xs={6}>
                    <EditIcon id="edit1" style={{float: 'right', cursor: 'pointer'}}
                              onClick={() => handleClick("edit1", "save1", clicked1, setClicked1)}/>
                    <SaveIcon id="save1" style={{float: 'right', cursor: 'pointer', visibility: 'hidden'}}
                              onClick={() => handleClick("edit1", "save1", clicked1, setClicked1)}/>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <TextField size="small" id="first_name" label="First Name" variant="outlined"
                           value={values['first_name']}
                           style={{paddingBottom: '10px'}} disabled={!clicked1} onChange={handleChange('first_name')}/>
                <TextField size="small" id="last_name" label="Last Name" variant="outlined"
                           value={values['last_name']}
                           style={{paddingBottom: '10px'}} disabled={!clicked1} onChange={handleChange('last_name')}/>
                <FormControl fullWidth size={'small'} style={{paddingBottom: '10px'}}>
                    <InputLabel id="gender">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={values['gender']}
                        label="Gender"
                        onChange={handleChange('gender')}
                        disabled={!clicked1}
                    >
                        <MenuItem value='m'>Male</MenuItem>
                        <MenuItem value='f'>Female</MenuItem>
                        <MenuItem value='o'>Other</MenuItem>
                    </Select>
                </FormControl>
                <TextField size="small" id="email" label="Email" variant="outlined" disabled
                           style={{paddingBottom: '10px'}} value={userDetails.attributes.email}/>
                <TextField size="small" id="phone" label="Phone Number" variant="outlined"
                           style={{paddingBottom: '10px'}} disabled={!clicked1} value={values['phone']}
                           onChange={handleChange('phone')}/>
                <TextField size="small" id="area_code" label="Area Code" variant="outlined"
                           style={{paddingBottom: '10px'}} disabled={!clicked1} value={values['area_code']}
                           onChange={handleChange('area_code')}/>
            </FormControl>
            <br/>
            <br/>
            <Row>
                <Col md={6} xs={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>Personal Details</Typography>
                </Col>
                <Col md={{span: 6, offset: 0}} style={{padding: '10px'}} xs={6}>
                    <EditIcon id="edit2" style={{float: 'right', cursor: 'pointer'}}
                              onClick={() => handleClick("edit2", "save2", clicked2, setClicked2)}/>
                    <SaveIcon id="save2" style={{float: 'right', cursor: 'pointer', visibility: 'hidden'}}
                              onClick={() => handleClick("edit2", "save2", clicked2, setClicked2)}/>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <Row>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="dob" label="Date of Birth" variant="outlined" value={values['dob']}
                                   style={{paddingBottom: '10px'}} disabled={!clicked2} onChange={handleChange('dob')}/>
                    </Col>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="blood_type" label="Blood Type" variant="outlined"
                                   onChange={handleChange('blood_type')} value={values['blood_type']}
                                   style={{paddingBottom: '10px'}} disabled={!clicked2}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="height" label="Height" variant="outlined"
                                   onChange={handleChange('height')} value={values['height']}
                                   style={{paddingBottom: '10px'}} disabled={!clicked2} InputProps={{
                            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}/>
                    </Col>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="weight" label="Weight" variant="outlined"
                                   onChange={handleChange('weight')} value={values['weight']}
                                   style={{paddingBottom: '10px'}} disabled={!clicked2} InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}/>
                    </Col>
                </Row>
            </FormControl>

            {/*<br/>*/}
            {/*<br/>*/}
            {/*<Row>*/}
            {/*    <Col md={6}>*/}
            {/*        <Typography color="text.secondary" style={{padding: '10px'}}>Health History</Typography>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/*<FormControl sx={{width: '100%'}}>*/}
            {/*    <TextField size="small" id="outlined-basic" label="Ailments" variant="outlined"*/}
            {/*               style={{paddingBottom: '10px'}}/>*/}
            {/*    <TextField size="small" id="outlined-basic" label="Medication" variant="outlined"*/}
            {/*               style={{paddingBottom: '10px'}}/>*/}
            {/*</FormControl>*/}

        </Container>
    );
}