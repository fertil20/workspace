import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch, BrowserRouter
} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants/constants';

import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../components/header/AppHeader';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import UsersList from '../components/usersList/UsersList';

import { Layout, notification } from 'antd';
import {PersistentState} from "../util/PersistentState";
import ProfileEdit from "../user/profile/ProfileEdit";
import ForgotPassword from "../user/passwordReset/ForgotPassword";
import ForgotPasswordReset from "../user/passwordReset/ForgotPasswordReset";
import Home from "../components/home/Home";
import NewUser from "../user/new/NewUser";
import RoleManager from "../components/roleManager/RoleManager";
import UsersListEdit from "../components/usersList/UsersListEdit";
import AboutCompany from "../components/about/AboutCompany";
import AboutCompanyEdit from "../components/about/AboutCompanyEdit";
import NewEmployee from "../components/about/NewEmployee";
import NewEmployeeEdit from "../components/about/NewEmployeeEdit";
import News from "../components/news/News";
import birthdayPage from "../components/birthday/BirthdayPage";
import MeetingRoomBook from "../components/meetingRoomBook/MeetingRoomBook";
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
            currentUser: this.persistentState.getState().currentUser,
            isAuthenticated: this.persistentState.getState().isAuthenticated,
            isLoading: true
         })
        getCurrentUser()
            .then(response => {
                this._isMounted && this.persistentState.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            })
            .catch(error => {
            this._isMounted && this.persistentState.setState({
                 currentUser: this.persistentState.getState().currentUser,
                 isAuthenticated: this.persistentState.getState().isAuthenticated,
                 isLoading: false
            });
            });
    }

    componentDidMount() {
        this.loadCurrentUser();
        this._isMounted = true;
    }

/*    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.match.params.username !== prevProps.match.params.username) {
            this.loadCurrentUser(this.props.match.params.username)
        }
    }*/

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);

        this.persistentState.setState({
            currentUser: null,
            isAuthenticated: false
        });
        this.props.history.push("/login");
    };

    handleLogin() {
        // notification.success({
        //   message: 'React App',
        //   description: "You're successfully logged in.",
        // });
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
                           onLogout={this.handleLogout} className='header-of-app'/>
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
                                <PrivateRoute exact path="/birthday" authenticated={this.persistentState.getState().isAuthenticated} component={birthdayPage} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/meeting" authenticated={this.persistentState.getState().isAuthenticated} component={MeetingRoomBook} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/news" authenticated={this.persistentState.getState().isAuthenticated} component={News} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users/:username" authenticated={this.persistentState.getState().isAuthenticated} component={Profile} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/newUser" authenticated={this.persistentState.getState().isAuthenticated} component={NewUser} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/roleManager" authenticated={this.persistentState.getState().isAuthenticated} component={RoleManager} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/manageUsers" authenticated={this.persistentState.getState().isAuthenticated} component={UsersListEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/about" authenticated={this.persistentState.getState().isAuthenticated} component={AboutCompany} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/about/edit" authenticated={this.persistentState.getState().isAuthenticated} component={AboutCompanyEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/about/newEmployee" authenticated={this.persistentState.getState().isAuthenticated} component={NewEmployee} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/about/newEmployee/edit" authenticated={this.persistentState.getState().isAuthenticated} component={NewEmployeeEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users/:username/edit" authenticated={this.persistentState.getState().isAuthenticated} component={ProfileEdit} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/poll/new" authenticated={this.persistentState.getState().isAuthenticated} component={NewPoll} handleLogout={this.handleLogout}/>
                                <PrivateRoute exact path="/users" authenticated={this.persistentState.getState().isAuthenticated} component={UsersList} handleLogout={this.handleLogout}/>
                                <Route component={NotFound} />
                            </Switch>
                        </BrowserRouter>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
