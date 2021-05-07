/*
import React from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";


const PublicRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (userEmail === userToken) ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);


export default PublicRoute*/
