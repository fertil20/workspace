import React from 'react';
import UserService from '../services/UserService';

class UserComponent extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            user:[]
        }
    }

    componentDidMount(){
        UserService.getUsers().then((response) => {
            this.setState({ user: response.data})
        });
    }

    render (){
        return (
            <div>
                <h1 className = "text-center"> User List</h1>
                <table className = "table table-striped">
                    <thead>
                    <tr>
                        <td> User Name</td>
                        <td> User Email</td>
                        <td> User Phone</td>
                    </tr>

                    </thead>
                    <tbody>
                    {
                        this.state.user.map(
                            user =>
                                <tr key = {user.id}>
                                    <td> {user.name}</td>
                                    <td> {user.email}</td>
                                    <td> {user.phone}</td>
                                </tr>
                        )
                    }

                    </tbody>
                </table>

            </div>

        )
    }
}

export default UserComponent