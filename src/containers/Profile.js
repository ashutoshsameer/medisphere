import React from "react";
import {FormControl, InputAdornment, TextField, Typography} from "@mui/material";
import {Container} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import EditIcon from '@material-ui/icons/Edit';
import {useAppContext} from "../lib/contextLib";

export default function Profile() {
    // const [values, setValues] = useState({
    //     weight: '',
    //     weightRange: '',
    //     showPassword: false,
    // });

    // const handleChange = (prop) => (event) => {
    //     setValues({ ...values, [prop]: event.target.value });
    // };

    const { userDetails } = useAppContext();

    return (
        <Container maxWidth="xs">
            <Row>
                <Col md={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>About You</Typography>
                </Col>
                <Col md={{span: 6, offset: 0}} style={{padding: '10px'}}>
                    <EditIcon style={{float: 'right'}}/>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <TextField size="small" id="outlined-basic" label="First Name" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="outlined-basic" label="Last Name" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="outlined-basic" label="Gender" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="outlined-basic" label="Email" variant="outlined" disabled
                           style={{paddingBottom: '10px'}} value={userDetails.attributes.email}/>
                <TextField size="small" id="outlined-basic" label="Phone Number" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
                <TextField size="small" id="outlined-basic" label="Area Code" variant="outlined"
                           style={{paddingBottom: '10px'}}/>
            </FormControl>
            <br/>
            <br/>
            <Row>
                <Col md={6}>
                    <Typography color="text.secondary" style={{padding: '10px'}}>Personal Details</Typography>
                </Col>
                <Col md={{span: 6, offset: 0}} style={{padding: '10px'}}>
                    <EditIcon style={{float: 'right'}}/>
                </Col>
            </Row>
            <FormControl sx={{width: '100%'}}>
                <Row>
                    <Col md={6}>
                        <TextField size="small" id="outlined-basic" label="Date of Birth" variant="outlined"
                                   style={{paddingBottom: '10px'}}/>
                    </Col>
                    <Col md={6}>
                        <TextField size="small" id="outlined-basic" label="Blood Type" variant="outlined"
                                   style={{paddingBottom: '10px'}}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <TextField size="small" id="outlined-basic" label="Height" variant="outlined"
                                   style={{paddingBottom: '10px'}} InputProps={{
                            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}/>
                    </Col>
                    <Col md={6}>
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