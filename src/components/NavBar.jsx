import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import getCognitoURL from "../auth/getCognitoURL";

const Navigation = () => {
  const navigate = useNavigate();
  const { user, removeUser } = useUserContext();

  const logOutHandler = () => {
    removeUser();
    navigate("/");
  };

  const handleClickLogin = () => {
    const loginUrl = getCognitoURL();
    window.location.href = loginUrl;
  };

  return (
    <Navbar
      fixed="top"
      expand="lg"
      className="navbar-dark bg-dark p-2"
      id="top"
    >
      <Container fluid>
        <Navbar.Brand href={user ? "/performPage" : "/"}>
          Improvise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/about">
              About this project
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/playerProfile">
                Player Profile
              </Nav.Link>
            )}
          </Nav>

          {user ? (
            <Nav>
              <Nav.Link href="#" onClick={logOutHandler}>
                <h4>Logout</h4>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="#login" onClick={handleClickLogin}>
                <h4>Login</h4>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
