import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/image"

export const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logOut = async () => {

  };

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"/bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Joy</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink
                to={`/posts/`}
                className={() =>
                  location.pathname.startsWith("/posts/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Posts
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/giving/`}
                className={() =>
                  location.pathname.startsWith("/giving/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Giving
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/lending/`}
                className={() =>
                  location.pathname.startsWith("/lending/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Lending
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                id="logout"
                onClick={logOut}
                to={location.pathname}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};