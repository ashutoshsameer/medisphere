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


function App() {
    const history = useHistory();
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            await Auth.currentSession();
            const userDetails = await Auth.currentUserInfo();
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
                <AppContext.Provider value={{isAuthenticated, userHasAuthenticated, userDetails, setUserDetails}}>
                    <Routes/>
                </AppContext.Provider>
            </div>
        )
    );
}

export default App;