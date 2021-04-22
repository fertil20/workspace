import React, {Component, useState} from 'react';
import {
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
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


