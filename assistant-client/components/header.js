// File - /components/Header.js
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, } from 'react-bootstrap'
import { logOut } from '../controllers/loginController'

const headerStyle = {};

let Home = ""
let Users = ""
let Vms = ""
let CompanyBot = ""
let Impostazioni = ""

function Header(props) {
    // setto i link del menu
    switch (props.selected) {
        case "Home": {
            Home = "true"
            Users = ""
            Vms = ""
            CompanyBot = ""
            break;
        }
        case "Users": {
            Home = ""
            Users = "true"
            Vms = ""
            CompanyBot = ""
            Impostazioni = ""
            break;
        }
        case "Vms": {
            Home = ""
            Users = ""
            Vms = "true"
            CompanyBot = ""
            Impostazioni = ""
            break;
        }
        case "CompanyBot": {
            Home = ""
            Users = ""
            Vms = ""
            CompanyBot = "true"
            Impostazioni = ""
            break;
        }
        case "Impostazioni": {
            Home = ""
            Users = ""
            Vms = ""
            CompanyBot = ""
            Impostazioni = "true"
            break;
        }
        default: {
            Home = ""
            Users = ""
            Vms = ""
            CompanyBot = ""
            break;
        }
    }

    return (
        <Navbar  className="navbar navbar-expand navbar-light bg-light" id="navBarCustom">
            <Navbar.Brand href="/">CompanyAssistant</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/" active={Home}>Home</Nav.Link>
                <NavDropdown active={Users} title="Gestione Utenti" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/nuovaHome">Utenti</NavDropdown.Item>
                    <NavDropdown.Item href="/groups">Gruppi</NavDropdown.Item>
                    <NavDropdown.Item href="/roles">Ruoli</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/vms" active={Vms}>Macchine Virtuali</Nav.Link>
                <Nav.Link href="/impostazioni" active={Impostazioni}>Impostazioni</Nav.Link>
            </Nav>
            <Form inline>

                <Button variant="outline-primary" onClick={logOut}>Logout</Button>
            </Form>
        </Navbar>

    );
}

export default Header;