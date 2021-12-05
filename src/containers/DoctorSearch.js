import React, {useState} from "react";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import {Backdrop, Button, CircularProgress} from "@mui/material";
import {Snackbar} from "@material-ui/core";

export default function DoctorSearch() {

    const [docs, setDocs] = useState([]);
    const [searchString, setSearchString] = useState('');
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    function awsCall(lat, lon, searchString, dist) {
        const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
        fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/doctors?lat=' + lat + '&lon=' + lon + '&searchString=' + searchString + '&dist=' + dist,
            {
                method: 'GET',
                headers: headers,
            })
            .then(data => data.json())
            .then(data => {
                setDocs(data);
                setOpen(false);
            })
            .catch(error => {
                setOpen(false);
            });
    }

    function searchDoctors() {
        setOpen(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                awsCall(position.coords.latitude, position.coords.longitude, searchString, "100km")
            }, function (position) {
                awsCall(43.295, -75.577, searchString, "100km")
            });
        } else {
            setOpen(false);
            setShow(true);
        }
    }

    function handleChange(event) {
        event.preventDefault();
        setSearchString(event.target.value);
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
                message="No location service"
                key={'topright'}
            />
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Row>
                <Col md={{span: 6, offset: 3}} style={{display: 'flex'}}>
                    <input id="searchString" className="form-control mr-sm-2" type="search"
                           placeholder="Search for speciality" aria-label="Search" onChange={handleChange}/>
                    <Button onClick={searchDoctors}>Go</Button>
                </Col>
            </Row>
            <Row xs={1} md={3} className="g-4">
                {docs.map((doctor, idx) => (
                    <Col key={`result_${idx}`}>
                        <Card style={{marginTop: '15px'}}>
                            <Card.Body>
                                <Card.Title id="card_title">{doctor.name}</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{doctor.speciality}</ListGroup.Item>
                                    <ListGroup.Item>{doctor.contact}</ListGroup.Item>
                                    <ListGroup.Item>{doctor.address}</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}