import React, {useState} from "react";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import {Container} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import EditIcon from '@material-ui/icons/Edit';
import {useAppContext} from "../lib/contextLib";
import SaveIcon from '@material-ui/icons/Save';

export default function Profile() {
    const [clicked1, setClicked1] = useState(false)
    const [clicked2, setClicked2] = useState(false)

    const {userDetails} = useAppContext();

    async function awsCall(body) {
        const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
        fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/profile',
        {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        })
        .then(data=>data.json())
        .then(data=>{
            console.log(data)
        });
    }

    const handleClick = (id1, id2, clicked, setClicked) => {
        if (clicked) {
            document.getElementById(id1).style.visibility="visible";
            document.getElementById(id2).style.visibility="hidden";
            setClicked(false)
            if (id1 === "edit1") {
                var body={}
                body['first_name'] = document.getElementById('first_name').value
                body['last_name'] = document.getElementById('last_name').value
                body['gender'] = document.getElementById('gender').value
                body['email'] = document.getElementById('email').value
                body['phone'] = document.getElementById('phone').value
                body['area_code'] = document.getElementById('area_code').value
                body['id'] = userDetails.username
                console.log(body)
                awsCall(body)
            }
        } else {
            document.getElementById(id1).style.visibility="hidden";
            document.getElementById(id2).style.visibility="visible";
            setClicked(true)
        }
    }

    const [values, setValues] = useState({
        weight: '',
        age: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    return (
        <Container maxWidth="xs">
            <Row>
                <Col md={6} xs={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>About You</Typography>
                </Col>
                <Col md={{span: 6, offset: 0}} style={{padding: '10px'}} xs={6}>
                    <EditIcon id="edit1" style={{float: 'right', cursor: 'pointer'}} onClick={() => handleClick("edit1", "save1", clicked1, setClicked1)}/>
                    <SaveIcon id="save1" style={{float: 'right', cursor: 'pointer', visibility: 'hidden'}} onClick={() => handleClick("edit1", "save1", clicked1, setClicked1)}/>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <TextField size="small" id="first_name" label="First Name" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="last_name" label="Last Name" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <FormControl fullWidth size={'small'} style={{paddingBottom: '10px'}}>
                    <InputLabel id="gender">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={values.age}
                        label="Age"
                        onChange={handleChange('age')}
                    >
                        <MenuItem value='m'>Male</MenuItem>
                        <MenuItem value='f'>Female</MenuItem>
                        <MenuItem value='o'>Other</MenuItem>
                    </Select>
                </FormControl>
                <TextField size="small" id="email" label="Email" variant="outlined" disabled
                           style={{paddingBottom: '10px'}} value={userDetails.attributes.email}/>
                <TextField size="small" id="phone" label="Phone Number" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="area_code" label="Area Code" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
            </FormControl>
            <br/>
            <br/>
            <Row>
                <Col md={6} xs={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>Personal Details</Typography>
                </Col>
                <Col md={{span: 6, offset: 0}} style={{padding: '10px'}} xs={6}>
                    <EditIcon id="edit2" style={{float: 'right', cursor: 'pointer'}} onClick={() => handleClick("edit2", "save2", clicked2, setClicked2)}/>
                    <SaveIcon id="save2" style={{float: 'right', cursor: 'pointer', visibility: 'hidden'}} onClick={() => handleClick("edit2", "save2", clicked2, setClicked2)}/>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <Row>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="outlined-basic" label="Date of Birth" variant="outlined"
                                   style={{paddingBottom: '10px'}}/>
                    </Col>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="outlined-basic" label="Blood Type" variant="outlined"
                                   style={{paddingBottom: '10px'}}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="outlined-basic" label="Height" variant="outlined"
                                   style={{paddingBottom: '10px'}} InputProps={{
                            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}/>
                    </Col>
                    <Col md={6} xs={6}>
                        <TextField size="small" id="outlined-basic" label="Weight" variant="outlined"
                                   style={{paddingBottom: '10px'}} InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}/>
                    </Col>
                </Row>
            </FormControl>

            <br/>
            <br/>
            <Row>
                <Col md={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>Health History</Typography>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <TextField size="small" id="outlined-basic" label="Ailments" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="outlined-basic" label="Medication" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
            </FormControl>

        </Container>
    );
}