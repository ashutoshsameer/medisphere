import React from "react";
import "./Home.css";
import {useAppContext} from "../lib/contextLib";


export default function Home() {

    const {userDetails, isAuthenticated} = useAppContext();

    return (
        <div className="Home">
            {isAuthenticated ?
                <p style={{padding: '0px 15px'}} className="text-muted">Hi {userDetails.attributes.email},</p> : null}
            <div className="lander">
                <h1>Medi Sphere</h1>
                <p className="text-muted">Your Health Companion</p>
            </div>
        </div>
    );
}