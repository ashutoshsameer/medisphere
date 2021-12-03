import React, {useState} from "react";
import {Auth} from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import LoaderButton from "../components/LoaderButton";
import {useAppContext} from "../lib/contextLib";
import {useFormFields} from "../lib/hooksLib";
import {onError} from "../lib/errorLib";
import "./Login.css";
import YourSvg from "../goog.png";
import { Link } from "react-router-dom";

export default function Login() {
    const {userHasAuthenticated, setUserDetails} = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(fields.email, fields.password);
            const userDetails = await Auth.currentUserInfo();
            setUserDetails(userDetails);
            userHasAuthenticated(true);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="Login">
                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={fields.password}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Link to="/login/reset">Forgot password?</Link>
                    <LoaderButton
                        variant="primary"
                        size="md"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Login
                    </LoaderButton>
                    <hr/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button variant="link" onClick={() => Auth.federatedSignIn({provider: 'Google'})}><img
                            src={YourSvg} alt={'Google Login'}/></Button>
                    </div>
                </Form>

            </div>

        </>
    );
}