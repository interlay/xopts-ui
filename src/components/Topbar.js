import { Navbar, Nav, Form, Image } from "react-bootstrap";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class TopBar extends Component {

  static defaultProps = {
    eth : {}
  }

  render() {
    console.log(this.props);
    return (
      <Navbar bg="light" expand="md" className="border-bottom shadow-sm">
        <Navbar.Brand href="/">XOpts</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link className="nav-link" to="/insure">
              Insure
            </Link>
            <Link className="nav-link" to="/underwrite">
              Underwrite
            </Link>
          </Nav>





            <Nav.Link href="/dashboard">
            {this.props.address}
            </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopBar;