import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import DateAdapter from '@mui/lab/AdapterMoment';
import { Backdrop, Box, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import AddIcon from '@material-ui/icons/Add';
import { Row } from "react-bootstrap";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import './MyAilments.css';
import { useAppContext } from "../lib/contextLib";
import { TrafficOutlined } from "@material-ui/icons";
import { assignIn } from "lodash";

export default function MyAilments() {
    const history = useHistory();
    const {userDetails} = useAppContext();
    const [reportType, setReportType] = useState('');
    const [diabetesStart, setDiabetesStart] = useState('');

    // const [ailments, setAilments] = useState([]);
    const [ailments, setAilments] = useState([
        {
            name: 'Pneumonia',
            otherData: {
                addedOn: moment('12/20/2021', 'MM/DD/YYYY').format("MMMM Do YYYY")
            }
        }
    ]);

    useEffect(() => {
        fetch(`https://p58nhtnt9j.execute-api.us-east-1.amazonaws.com/v1/range?user_id=${userDetails.username}`)
            .then(res => res.json())
            .then(res => {
                if (res['errorMessage']) {
                    setDiabetesStart('');
                    setAilments(ailments.filter(e => e.name !== 'Diabetes'));
                } else {
                    setDiabetesStart(res);
                    ailments.push({
                        name: 'Diabetes',
                        otherData: {
                            addedOn: moment(res[0], 'YYYY-MM-DD HH:mm:ss').format("MMMM Do YYYY")
                        }
                    });
                    setAilments(ailments);
                }
            })
            .catch(error => {
                setDiabetesStart('');
                setAilments(ailments.filter(e => e.name !== 'Diabetes'));
            });
    }, [userDetails.username]);

    const reportTypes = [
        {
            label: 'Diabetes',
            value: 1
        },
        {
            label: 'Pneumonia',
            value: 2
        }
    ];

    

    function trackAilment(ailment) {
        history.push(`/ailments/${ailment}`);
    }

    const [openForm, setOpenForm] = React.useState(false);
    const handleClose = () => {
        setOpenForm(false);
    };
    const handleToggle = () => {
        setOpenForm(!openForm);
    };


    function handleReportTypeChange(event) {
        event.preventDefault();
        setReportType(event.target.value);
    }

    const now = new Date();

    const [value, setValue] = React.useState(now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear());

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleAddAilment = () => {
        const ail = {
            name: reportTypes.find(e => e.value === reportType).label,
            otherData: {
                addedOn: moment(value, 'MM/DD/YYYY').format("MMMM Do YYYY")
            }
        };
        const ails = [...ailments];
        ails.push(ail);
        setAilments(ails);
        setReportType('');
        handleClose();
    };

    function validate() {
        return reportType !== '';
    }

    console.log(diabetesStart);

    return (
        <>
            <Grid container spacing={4}>
                {ailments.map((ail, index) => (
                    <Grid item xs={12} md={4} key={`ailment_${index}`}>
                        <Card raised>
                            <CardContent>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" component="div">
                                        {ail.name}
                                    </Typography>
                                </Box>
                                <br />
                                <Typography variant="body2" color="text.secondary">
                                    added on
                                    <br />
                                    {ail.otherData.addedOn}
                                </Typography>
                                <br />
                                {/* {ail.name === 'Pnemonia' ? <Typography variant="body2" color="text.secondary">
                                    Suggested Result:
                                    <br />
                                    {ail.otherData.result}
                                </Typography>
                                    : null} */}
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => trackAilment(ail.name)}>Track</Button>
                            </CardActions>
                            {/* // <CardMedia
                            //     image={ail.otherData.image}
                            //     component="img"
                            //     alt='xray'
                            // />}   */}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Fab color="primary" aria-label="add" className="fab" onClick={handleToggle}>
                <AddIcon />
            </Fab>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openForm}
            >
                <div style={{ background: 'white', padding: '20px' }}>
                    <Box sx={{ textAlign: 'right' }} onClick={handleClose}>
                        <Typography variant="p" color="text.secondary" style={{ cursor: 'pointer' }}>
                            X
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" color="text.secondary">
                            Add an Ailment
                        </Typography>
                    </Box>
                    <br />
                    <Stack spacing={3}>
                        <Row>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Ailment Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={reportType}
                                        label="Ailment Type"
                                        onChange={handleReportTypeChange}
                                    >
                                        {
                                            reportTypes.map((type, idx) => (
                                                <MenuItem value={type.value}
                                                    key={`report_type_${idx}`}>{type.label}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Row>
                        <Row>
                            <LocalizationProvider dateAdapter={DateAdapter}>
                                <DesktopDatePicker
                                    label="Track From"
                                    inputFormat="MM/DD/YYYY"
                                    value={value}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Row>
                        <Row>
                            <Button disabled={!validate()} onClick={handleAddAilment}>Add</Button>
                        </Row>
                    </Stack>
                </div>
            </Backdrop>
        </>
    );
}