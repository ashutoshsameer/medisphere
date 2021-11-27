import React from "react";
import {Typography} from "@mui/material";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import {Grid, Paper} from "@material-ui/core";
import groupBy from 'lodash/groupBy';
import moment from 'moment';

export default function ReportHistory() {

    const files = [
        {
            url: '',
            name: 'abc.png',
            dateUploaded: '11/27/2021',
            type: '',
        },
        {
            url: '',
            name: 'report.pdf',
            dateUploaded: '11/26/2021',
            type: '',
        }
    ];

    const transformedFiles = files.map(e => ({
        ...e,
        dateUploaded: moment(e.dateUploaded, "MM/DD/YYYY").format("MMMM Do YYYY")
    }));

    const groupedFiles = groupBy(transformedFiles, 'dateUploaded');
    console.log(groupedFiles);

    function download(fileUrl, fileName) {
        const a = document.createElement("a");
        a.href = fileUrl;
        a.setAttribute("download", fileName);
        a.click();
    }

    return (
        <div>
            {
                Object.keys(groupedFiles).map((key, index) => (
                    <div key={`${key}_${index}_div`}>
                        <Typography style={{color: '#ababab9e'}} key={`${key}_${index}`}>{key}</Typography>
                        <Grid style={{padding: '15px'}} key={`${key}_${index}_grid`} container spacing={1}>
                            {
                                groupedFiles[key].map((f, index) => (
                                    <Grid
                                        item
                                        key={`history_${index}`}
                                        xs={3}
                                    >
                                        <Paper
                                            onClick={() => download(f.url, f.name)}
                                            variant="outlined"
                                            style={{cursor: 'Pointer'}}
                                        >
                                            <Typography padding={1}>
                                                <InsertDriveFileIcon/>
                                                {f.name}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </div>
                ))
            }
        </div>
    );
}