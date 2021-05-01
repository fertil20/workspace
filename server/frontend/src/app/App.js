import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch, BrowserRouter
} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import UsersAdminList from '../components/UsersAdminList';

import { Layout, notification } from 'antd';
import {PersistentState} from "../util/PersistentState";
import ProfileEdit from "../user/profile/ProfileEdit";
import ForgotPassword from "../user/passwordReset/ForgotPassword";
import ForgotPasswordReset from "../user/passwordReset/ForgotPasswordReset";
import Home from "../common/Home";
import NewUser from "../user/new/NewUser";
import RoleManager from "../user/rolemanager/RoleManager";
import UsersAdminListEdit from "../components/UsersAdminListEdit";
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

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);

        this.persistentState.setState({
            currentUser: null,
            isAuthenticated: false
        });
        alert("You're successfully logged out.")
        this.props.history.push("/login");
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
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.persistentState.getState().isAuthenticated}
                           currentUser={this.persistentState.getState().currentUser}
/*                           privilege={this.persistentState.getState().currentUser.role.privilege}*/
                           onLogout={this.handleLogout} />

                <Content className="app-content">
                    <div className="container">
                        <BrowserRouter>
                            <Switch>
                                <PrivateRoute exact path="/" authenticated={this.persistentState.getState().isAuthenticated} component={Home}/>
                                <Route path="/login"
                                       render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                                <Route path="/signup" component={Signup}/>
                                <Route path="/forgotPassword" component={ForgotPassword}/>
                                <Route path="/resetPassword" component={ForgotPasswordReset}/>
                                <PrivateRoute exact path="/users/:username" authenticated={this.persistentState.getState().isAuthenticated} component={Profile} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/newUser" authenticated={this.persistentState.getState().isAuthenticated} component={NewUser} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/roleManager" authenticated={this.persistentState.getState().isAuthenticated} component={RoleManager} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/editUsers" authenticated={this.persistentState.getState().isAuthenticated} component={UsersAdminListEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users/:username/edit" authenticated={this.persistentState.getState().isAuthenticated} component={ProfileEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/poll/new" authenticated={this.persistentState.getState().isAuthenticated} component={NewPoll} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users" authenticated={this.persistentState.getState().isAuthenticated} component={UsersAdminList} handleLogout={this.handleLogout}/>
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
