import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch, BrowserRouter
} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import PollList from '../poll/PollList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import UserComponent from '../components/UserComponent';

import { Layout, notification } from 'antd';
import {PersistentState} from "../util/PersistentState";
import ProfileEdit from "../user/profile/ProfileEdit";
import ForgotPassword from "../user/passwordReset/ForgotPassword";
const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.persistentState = new PersistentState(this, "app", {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        })
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    loadCurrentUser() {
        this.persistentState.setState({
            isLoading: true
        })
        getCurrentUser()
            .then(response => {
                this.persistentState.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.persistentState.setState({
                isLoading: false
            });
        });
    }

    componentDidMount() {
        this.loadCurrentUser();
    }

    handleLogout(redirectTo="/") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.persistentState.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        alert("You're successfully logged out.")
    };

    handleLogin() {
        // notification.success({
        //   message: 'React App',
        //   description: "You're successfully logged in.",
        // });
        alert("You're successfully logged in.")
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    render() {
        if(this.persistentState.getState().isLoading) {
            return <LoadingIndicator />
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.persistentState.getState().isAuthenticated}
                           currentUser={this.persistentState.getState().currentUser}
                           onLogout={this.handleLogout} />

                <Content className="app-content">
                    <div className="container">
                        <BrowserRouter>
                            <Switch>
                                <Route exact path="/"
                                       render={(props) => <PollList isAuthenticated={this.persistentState.getState().isAuthenticated}
                                                                    currentUser={this.persistentState.getState().currentUser} handleLogout={this.handleLogout} {...props} />}>
                                </Route>
                                <Route path="/login"
                                       render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                                <Route path="/signup" component={Signup}/>
                                <Route path="/forgotPassword" component={ForgotPassword}/>
                                <PrivateRoute exact path="/users/:username" authenticated={this.persistentState.getState().isAuthenticated} component={Profile} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users/:username/edit" authenticated={this.persistentState.getState().isAuthenticated} component={ProfileEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/poll/new" authenticated={this.persistentState.getState().isAuthenticated} component={NewPoll} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users" authenticated={this.persistentState.getState().isAuthenticated} component={UserComponent} handleLogout={this.handleLogout}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </BrowserRouter>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
