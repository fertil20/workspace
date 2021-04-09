import React, {Component, useState} from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout } from 'antd';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

const Header = Layout.Header;



class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick() {
        this.props.onLogout();
    }

    render() {
//        let menuItems;
        if(this.props.currentUser) {
          return(
            <NavBarLogged currentUser={this.props.currentUser} handleMenuClick={this.handleMenuClick}/>
          )
        } else {
          return(
              <NavBarNotLogged/>
          )
        }
    }
}

// function ProfileDropdownMenu(props) {
//   const dropdownMenu = (
//     <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
//       <Menu.Item key="user-info" className="dropdown-item" disabled>
//         <div className="user-full-name-info">
//           {props.currentUser.name}
//         </div>
//         <div className="username-info">
//           @{props.currentUser.username}
//         </div>
//       </Menu.Item>
//       <Menu.Divider />
//       <Menu.Item key="profile" className="dropdown-item">
//         <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
//       </Menu.Item>
//         <Menu.Item key="userlist" className="dropdown-item">
//             <Link to={`/users`}>View Users</Link>
//         </Menu.Item>
//       <Menu.Item key="logout" className="dropdown-item">
//           <Link to={`/`}>Logout</Link>
//       </Menu.Item>
//     </Menu>
//   );
//
//   return (
//     <Dropdown
//       overlay={dropdownMenu}
//       trigger={['click']}
//       getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
//       <a className="ant-dropdown-link">
//          <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
//       </a>
//     </Dropdown>
//   );
// }

const NavBarNotLogged = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">WSpace</NavbarBrand>
                    <NavbarToggler onClick={toggle}/>
                    <Collapse isOpen={isOpen} navbar style={{marginLeft: 950}}>
                        <Nav>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    ···
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href="/login">
                                        Login
                                    </DropdownItem>
                                    <DropdownItem href="/signup">
                                        Sign Up
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
}


const Navconst = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
}
function NavBarLogged(props){

    return (
        <div >
            <Navbar  color="light" light expand="md" >
                <NavbarBrand href="/">WSpace</NavbarBrand>
                <NavbarToggler onClick={Navconst.toggle}/>
                <Collapse isOpen={Navconst.isOpen} navbar style={{marginLeft: 950}}>
                    <Nav>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                ···
                            </DropdownToggle>
                            <DropdownMenu right >
                                    <div style={{textAlign:'center'}}>{props.currentUser.username}</div>
                                    <div style={{textAlign:'center'}}> @{props.currentUser.username}</div>
                                <DropdownItem divider />
                                <DropdownItem href="/">
                                    Home
                                </DropdownItem>
                                <DropdownItem href="/poll/new">
                                    Poll
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href={`/users/${props.currentUser.username}`}>
                                    Profile
                                </DropdownItem>
                                <DropdownItem href="/users">
                                    Users
                                </DropdownItem>
                                <DropdownItem  onClick={props.handleMenuClick} href="/">
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}

export default withRouter(AppHeader);


