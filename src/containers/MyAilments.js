import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import {useHistory} from "react-router-dom";
import {Box, Grid} from "@mui/material";

export default function MyAilments() {
    const history = useHistory();
    const ailments = [
        {
            name: 'Diabetes',
            otherData: {
                addedOn: moment('11/27/2021', 'MM/DD/YYYY').format("MMMM Do YYYY")
            }
        }
    ];

    function trackAilment(ailment) {
        history.push(`/ailments/${ailment}`);
    }

    return (
        <Grid container spacing={4}>
            {ailments.map((ail, index) => (
                <Grid item xs={12} md={4} key={`ailment_${index}`}>
                    <Card raised>
                        <CardContent>
                            <Box sx={{textAlign: 'center'}}>
                                <Typography variant="h5" component="div">
                                    {ail.name}
                                </Typography>
                            </Box>
                            <br/>
                            <Typography variant="body2" color="text.secondary">
                                added on
                                <br/>
                                {ail.otherData.addedOn}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => trackAilment(ail.name)}>Track</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}