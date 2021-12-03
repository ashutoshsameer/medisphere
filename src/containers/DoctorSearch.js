import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";

export default function DoctorSearch() {
    return (
        <div>
            <Row>
                <Col md={{ span: 6, offset: 3 }} style={{display: 'flex'}}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                    <Button>Go</Button>
                </Col>
            </Row>
            <Row xs={1} md={3} className="g-4">
                {Array.from({length: 4}).map((_, idx) => (
                    <Col key={`result_${idx}`}>
                        <Card style={{marginTop: '15px'}}>
                            {/*<Card.Img variant="top" src="holder.js/100px160" />*/}
                            <Card.Body>
                                <Card.Title>Card title</Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}