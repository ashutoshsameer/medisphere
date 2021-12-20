import React, {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import Routes from "./Routes";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import {LinkContainer} from "react-router-bootstrap";
import {AppContext} from "./lib/contextLib";
import {Auth} from "aws-amplify";
import {useHistory} from "react-router-dom";
import {onError} from "./lib/errorLib";
import {KinesisClient, PutRecordsCommand} from "@aws-sdk/client-kinesis";


function App() {
    const history = useHistory();
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [userDetails, setUserDetails] = useState({});
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        onLoad();
    }, [userDetails.username]);

    useEffect(() => {
        if (isAuthenticated && userDetails.username) {
            const client = new KinesisClient({apiVersion: '2013-12-02', region: "us-east-1", credentials: {
                    accessKeyId: 'AKIAYUJVM6RATJKCTDVW',
                    secretAccessKey: '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'
                }});
            const interval = setInterval(() => {
                console.log('Running now---', userDetails.username);
                fetch(`https://elae370y2e.execute-api.us-east-1.amazonaws.com/v4/glucosedata?user=${userDetails.username}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                        const data = JSON.stringify({
                            code: res.code,
                            value: res.value,
                            username: userDetails.username,
                            time: new Date().toISOString().replace('T', ' ').slice(0, -5)
                        });
                        console.log(data);
                        const params = {
                            StreamName: "glucose-data",
                            Records: [
                                {
                                    Data: new TextEncoder().encode(data),
                                    PartitionKey: 'partition-' + userDetails.username
                                }
                            ]
                        };
                        const command = new PutRecordsCommand(params);
                        client
                            .send(command)
                            .then((data) => {
                                console.log(data);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => console.error(error));
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, userDetails.username]);

    async function onLoad() {
        try {
            await Auth.currentSession();
            const userDetails = await Auth.currentUserInfo();
            const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
            fetch('https://ujap4eccgg.execute-api.us-east-1.amazonaws.com/v1/profile?id=' + userDetails.username,
                {
                    method: 'GET',
                    headers: headers
                })
                .then(data => data.json())
                .then(data => {
                    setUserProfile(data);
                })
                .catch((error) => console.error(error));
            userHasAuthenticated(true);
            setUserDetails(userDetails);
        } catch (e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }

        setIsAuthenticating(false);
    }

    async function handleLogout() {
        await Auth.signOut();

        userHasAuthenticated(false);
        history.push("/login");
    }

    return (
        !isAuthenticating && (
            <div className="App container py-3">
                <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                    <LinkContainer to="/">
                        <Navbar.Brand className="font-weight-bold text-muted">
                            MediSphere
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle/>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav activeKey={window.location.pathname}>
                            {isAuthenticated ? (
                                <>
                                    <LinkContainer to="/search">
                                        <Nav.Link>Search Doctors</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/ailments">
                                        <Nav.Link>My Ailments</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/history">
                                        <Nav.Link>Report History</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/uploadReport">
                                        <Nav.Link>Upload Report</Nav.Link>
                                    </LinkContainer>
                                    <NavDropdown title="Settings" id="basic-nav-dropdown">
                                        <LinkContainer to="/profile">
                                            <Nav.Link>Profile</Nav.Link>
                                        </LinkContainer>
                                        <NavDropdown.Divider/>
                                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to="/signup">
                                        <Nav.Link>Signup</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <Nav.Link>Login</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <AppContext.Provider value={{
                    isAuthenticated,
                    userHasAuthenticated,
                    userDetails,
                    setUserDetails,
                    userProfile,
                    setUserProfile
                }}>
                    <Routes/>
                </AppContext.Provider>
            </div>
        )
    );
}

export default App;