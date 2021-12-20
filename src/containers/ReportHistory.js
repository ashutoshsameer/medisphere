import React, {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import {Grid, Paper} from "@material-ui/core";
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import {useAppContext} from "../lib/contextLib";

export default function ReportHistory() {

    const { userDetails } = useAppContext();
    const [files,setFiles] = useState([]);

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("userid", userDetails.username);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "/*/");
        myHeaders.append("Access-Control-Allow-Origin","*");
        fetch(`https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/file`,{
            headers: myHeaders,
            method: "GET"
        }).then((response) => {
            return response.json()
        }).then((response) => {
            console.log(response)
            setFiles(response)
        }).catch((error) => {
            console.log(error)
        });
    }, [userDetails.username]);

    // const files = [
    //     {
    //         url: '',
    //         name: 'abc.png',
    //         dateUploaded: '11/27/2021',
    //         type: '',
    //     },
    //     {
    //         url: '',
    //         name: 'report.pdf',
    //         dateUploaded: '11/26/2021',
    //         type: '',
    //     }
    // ];
    // 2021-12-05T20:09:04+00:00

    const transformedFiles = files.map(e => ({
        ...e,
        dateUploaded: moment(e[2].dateUploaded).format("MMMM Do YYYY"),
        url: e[1],
        name: e[0]
    }));

    const groupedFiles = groupBy(transformedFiles, 'dateUploaded');

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