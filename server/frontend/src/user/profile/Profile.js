import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar, Tabs } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import PollList from "../../poll/PollList";
import { Container, Row, Col } from 'reactstrap';

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
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
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
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
            // <div className="profile">
            //     {
            //         this.state.user ? (
            //             <div className="user-profile">
            //                 <div className="user-details">
            //                     <div className="user-avatar">
            //                         <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
            //                             {this.state.user.name.toUpperCase()}
            //                         </Avatar>
            //                     </div>
            //                     <div className="user-summary">
            //                         <div className="full-name">{this.state.user.name}</div>
            //                         <div className="username">@{this.state.user.username}</div>
            //                         <div className="email">{this.state.user.email}</div>
            //                         {/*<div className="phone">{this.state.user.phone}</div>*/}
            //                         <div className="user-joined">
            //                             Joined {formatDate(this.state.user.joinedAt)}
            //                         </div>
            //                     </div>
            //                 </div>
            //                 <div className="user-poll-details">
            //                     <Tabs defaultActiveKey="1"
            //                         animated={false}
            //                         tabBarStyle={tabBarStyle}
            //                         size="large"
            //                         className="profile-tabs">
            //                         <TabPane tab={`${this.state.user.pollCount} Polls`} key="1">
            //                             <PollList username={this.props.match.params.username} type="USER_CREATED_POLLS" />
            //                         </TabPane>
            //                         <TabPane tab={`${this.state.user.voteCount} Votes`}  key="2">
            //                             <PollList username={this.props.match.params.username} type="USER_VOTED_POLLS" />
            //                         </TabPane>
            //                     </Tabs>
            //                 </div>
            //             </div>
            //         ): null
            //     }
            // </div>
            <div className="profile" >
                     {
                       this.state.user ? (
                <Row >
                    <Col sm={{ size: 4 }} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                        <div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>
                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                {this.state.user.name.toUpperCase()}
                            </Avatar>
                        </div>
                        <Row>
                            <Col>
                                <div style={{color: 'gray', paddingTop:5, fontWeight: 'bold'}}>E-mail:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Рабочий номер:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Telegram:</div>
                            </Col>
                            <Col>
                                <div style={{paddingTop:5}}>{this.state.user.email}</div>
                                <div style={{paddingTop:20}}>{this.state.user.phone}</div>
                                <div style={{paddingTop:20}}>@{this.state.user.tg}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={{ size: 5, offset: 1}} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                        <Row>
                            <Col>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Ф.И.О:</div>
                                <div style={{color: 'gray', paddingTop:50, fontWeight: 'bold'}}>О себе:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Должность:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Департамент:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Офис:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Рабочие часы:</div>
                                <div style={{color: 'gray', paddingTop:50, fontWeight: 'bold'}}>В компании с:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Дата рождения:</div>
                                <div style={{color: 'gray', paddingTop:20, fontWeight: 'bold'}}>Секретная заметка:</div>
                            </Col>
                            <Col>
                                <div style={{paddingTop:20}}>{this.state.user.name}</div>
                                <div style={{paddingTop:50}}>{this.state.user.about}</div>
                                <div style={{paddingTop:20}}>{this.state.user.position}</div>
                                <div style={{paddingTop:20}}>{this.state.user.department}</div>
                                <div style={{paddingTop:20}}>{this.state.user.office}</div>
                                <div style={{paddingTop:20}}>{this.state.user.wTimes.time}//todo разобраться со временем</div>
                                <div style={{paddingTop:50}}>{formatDate(this.state.user.joinedAt)}</div>
                                <div style={{paddingTop:20}}>{formatDate(this.state.user.birthday)}</div>
                                <div style={{paddingTop:20}}>{this.state.user.secretNote}</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                       ): null
                                }
            </div>
        );
    }
}

export default Profile;