import React, {Component} from 'react';
import {getAllUsers} from "../util/APIUtils";
import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {formatDate} from "../util/Helpers";

class UserComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadAllUsers = this.loadAllUsers.bind(this);
    }

    loadAllUsers(id) {
        this.setState({
            isLoading: true
        });

        getAllUsers(id)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.loadAllUsers(id);
    }

    render (){
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="userlist">
                    <h1 className="text-center"> User List</h1>
                {
                    this.state.user ? (
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <td>Name</td>
                                <td>Username</td>
                                <td>Email</td>
                                <td>Joined</td>
                            </tr>

                            </thead>
                            <tbody>
                            {
                                this.state.user.map(
                                    user =>
                                        <tr key={user.id}>
                                            <td> {user.name}</td>
                                            <td> {user.username}</td>
                                            <td> {user.email}</td>
                                            <td> {formatDate(user.joinedAt)}</td>
                                        </tr>
                                )
                            }
                            </tbody>
                        </table>
                    ): null
                }
            </div>

        )
    }
}

export default UserComponent
