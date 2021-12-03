import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import UploadReport from "./containers/UploadReport";
import ReportHistory from "./containers/ReportHistory";
import DoctorSearch from "./containers/DoctorSearch";
import MyAilments from "./containers/MyAilments";
import ResetPassword from "./containers/ResetPassword";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Profile from "./containers/Profile";
import AilmentTrack from "./containers/AilmentTrack";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <UnauthenticatedRoute exact path="/login">
                <Login />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute exact path="/signup">
                <Signup />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/uploadReport">
                <UploadReport />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/history">
                <ReportHistory />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/search">
                <DoctorSearch />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/ailments">
                <MyAilments />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/profile">
                <Profile />
            </AuthenticatedRoute>
            <UnauthenticatedRoute exact path="/login/reset">
                <ResetPassword />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/ailments/:name" component={AilmentTrack} />
            {/* Finally, catch all unmatched routes */}
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}