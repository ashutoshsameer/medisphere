import React, {useEffect, useState} from "react";
import LineChart from "../charts/LineChart";
import moment from "moment";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {Col, Row, Card, ListGroup} from "react-bootstrap";
import CardMedia from '@mui/material/CardMedia';
import {DateTimePicker} from "@mui/lab";
import {Button, CircularProgress, TextField} from "@mui/material";
import {useAppContext} from "../lib/contextLib";

export default function AilmentTrack(props) {
    const {userDetails} = useAppContext();
    const [range, setRange] = useState([]);
    useEffect(() => {
        fetch(`https://p58nhtnt9j.execute-api.us-east-1.amazonaws.com/v1/range?user_id=${userDetails.username}`)
            .then(res => res.json())
            .then(res => setRange(res))
            .catch(error => console.error(error));
    }, [userDetails.username]);

    const [data, setData] = useState([]);

    const d = new Date();

    const [fromDate, setFromDate] = React.useState(d.setHours(d.getHours() - 1));
    const [toDate, setToDate] = React.useState(new Date());

    function handleSearch() {
        const from = moment(fromDate).format('YYYY-MM-DD HH:mm');
        const to = moment(toDate).format('YYYY-MM-DD HH:mm');
        console.log(userDetails.username);
        fetch(`https://elae370y2e.execute-api.us-east-1.amazonaws.com/v3/diabetes?user_id=${userDetails.username}&from=${from}&to=${to}`)
            .then(res => res.json())
            .then(res => {
                const transformed = res.map(r => ({time: new Date(r.time), value: r.value}));
                setData(transformed);
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
        fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/test?user=' + userDetails.username,
            {
                method: 'GET',
                headers: headers
            })
            .then(data => data.json())
            .then(data => {
                // console.log(data);
                const obj = JSON.parse(data.body);
                // console.log(obj);
                // console.log(obj.ailments.M.pnemonia.L);
                setPnem({pnemonia: obj.ailments.M.pnemonia.L});
                // console.log({pnemonia: obj.ailments.M.pnemonia.L})
                // console.log(pnem);
            });
    }, [userDetails.username]);

    const [pnem, setPnem] = useState({
        pnemonia: [

        ]
    });

    console.log(pnem);

    return (
        <div>
            <h5>{props.match.params.name}</h5>

            
            {props.match.params.name !== 'Pneumonia' ?
            <div>
                <p>{range.length > 0 ? `Tracking from ${moment(range[0], 'YYYY-MM-DD HH:mm:ss').format("MMMM Do YYYY HH:mm")} till ${moment(range[1], 'YYYY-MM-DD HH:mm:ss').format("MMMM Do YYYY HH:mm")}` : <CircularProgress color="inherit"/>}</p>
            <br/>
            <Row>
                <Col md={3} xs={12}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DateTimePicker
                            renderInput={(props) => <TextField style={{width: '100%'}} {...props} />}
                            label="From"
                            value={fromDate}
                            onChange={(newValue) => {
                                setFromDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </Col>
                <Col md={3} xs={12}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DateTimePicker
                            renderInput={(props) => <TextField style={{width: '100%'}} {...props} />}
                            label="To"
                            value={toDate}
                            onChange={(newValue) => {
                                setToDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </Col>
                <Col md={1} xs={12}>
                    <Button style={{height: '100%'}} onClick={handleSearch}>Go</Button>
                </Col>
            </Row>
            <br/>
            {
                data.length > 0 ? <LineChart data={data} width={400} height={300}/> : <p>No data Points in the specified range</p>
            }
            </div>: 
            <Row xs={1} md={3} className="g-4">
                {
                    pnem.pnemonia.map((element, i) => (
                        // console.log(element);
                        <Col key={`result_${i}`}>
                            <Card style={{marginTop: '15px'}}>
                                <Card.Body>
                                <Card.Title id="card_title">{element['M']['date']['S']}</Card.Title>
                                    <ListGroup variant="flush">
                                    {element['M']['result']['S']==='0' ? <ListGroup.Item>Suggested Diagnosis: Pneumonia not detected</ListGroup.Item> 
                                    : <ListGroup.Item>Suggested Diagnosis: Pneumonia detected</ListGroup.Item>}
                                    </ListGroup>
                                </Card.Body>
                                <CardMedia
                                    image={element['M']['file']['S']}
                                    component="img"
                                    alt='xray'
                                />
                            </Card>
                        </Col>
                ))}
            </Row>}
        </div>
    );
}