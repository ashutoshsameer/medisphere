import React, { useState } from "react";
import {Card, Col, Row, ListGroup} from "react-bootstrap";
import {Button} from "@mui/material";

export default function DoctorSearch() {

    const [docs, setDocs] = useState([]);

    async function awsCall(lat, lon, searchString, dist) {
        const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
        fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/doctors?lat='+lat+'&lon='+lon+'&searchString='+searchString+'&dist='+dist,
        {
            method: 'GET',
            headers: headers,
        })
        .then(data=>data.json())
        .then(data=>{
            console.log(data)
            setDocs(data)
        });
    }

    async function searchDoctors(searchString) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                awsCall(position.coords.latitude, position.coords.longitude, searchString, "100km")
            }, function(position){
                awsCall(43.295, -75.577, searchString, "100km")
            });
          } else { 
            console.log('No location service')
          }
    }

    return (
        <div>
            <Row>
                <Col md={{ span: 6, offset: 3 }} style={{display: 'flex'}}>
                    <input id="searchString" className="form-control mr-sm-2" type="search" placeholder="Search for speciality" aria-label="Search"/>
                    <Button onClick={() => {
                        searchDoctors(document.getElementById('searchString').value)
                    }}>Go</Button>
                </Col>
            </Row>
            <Row xs={1} md={3} className="g-4">
                {docs.map(doctor => (
                    <Col key={`result`}>
                        <Card style={{marginTop: '15px'}}>
                            {/*<Card.Img variant="top" src="holder.js/100px160" />*/}
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