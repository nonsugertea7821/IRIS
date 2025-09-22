import { Button } from "@mui/material";
import { JSX } from "react";
import { callApiNeedAuthDeleteTest, callApiNeedAuthGetTest, callApiNeedAuthPostTest, callApiNeedAuthPutTest } from "../../store/api/common/auth/authTestApi";
import AppContainer from "../layout/AppContainer";

export default function Home(): JSX.Element {
    return (
        <AppContainer>
            <h1>Home</h1>
            <p>Welcome to the Home page!</p>
            <Button onClick={callApiNeedAuthGetTest}>Get-Test</Button>
            <Button onClick={callApiNeedAuthPostTest}>Post-Test</Button>
            <Button onClick={callApiNeedAuthPutTest}>Put-Test</Button>
            <Button onClick={callApiNeedAuthDeleteTest} >Delete-Test</Button>
        </AppContainer>
    );
}