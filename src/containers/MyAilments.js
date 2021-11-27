import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';

export default function MyAilments() {

    const ailments = [
        {
            name: 'Diabetes',
            otherData: {
                addedOn: moment('11/27/2021', 'MM/DD/YYYY').format("MMMM Do YYYY")
            }
        }
    ];

    return (
        <div>
            {ailments.map((ail, index) => (
                <Card sx={{ maxWidth: 275 }} raised>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {ail.name}
                        </Typography>
                        <br/>
                        <Typography variant="body2" color="text.secondary">
                            added on
                            <br />
                            {ail.otherData.addedOn}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Track</Button>
                    </CardActions>
                </Card>
            ))}
        </div>
    );
}