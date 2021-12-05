import React, {useState} from "react";
import LineChart from "../charts/LineChart";
import moment from "moment";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {Col, Row} from "react-bootstrap";
import {DateTimePicker} from "@mui/lab";
import {Button, TextField} from "@mui/material";
import {useAppContext} from "../lib/contextLib";

export default function AilmentTrack(props) {

    const {userDetails} = useAppContext();

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

    return (
        <div>
            <h5>{props.match.params.name}</h5>
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
                data.length > 0 ? <LineChart data={data} width={400} height={300}/> : <p>No data Points</p>
            }
        </div>
    );
}