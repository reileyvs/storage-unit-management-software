import "./AppNavbar.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  useUserInfoActionsHook,
  useUserInfoHook,
} from "../userInfo/UserInfoHooks";
import { AppNavbarPresenter, AppNavbarView } from "../../presenter/AppNavbarPresenter";
import { useRef } from "react";

const AppNavbar = () => {
  const location = useLocation();
  const { authToken, displayedUser } = useUserInfoHook();
  const { clearUserInfo } = useUserInfoActionsHook();
  const navigate = useNavigate();
  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const listener: AppNavbarView = {
    displayInfoMessage: displayInfoMessage,
    displayErrorMessage: displayErrorMessage,
    deleteMessage: deleteMessage,
    clearUserInfo: clearUserInfo,
    navigate: navigate,
  };

  const presenterRef = useRef<AppNavbarPresenter | null>(null);
  if (presenterRef.current == null) {
    presenterRef.current = new AppNavbarPresenter(listener);
  }

  const logOut = async () => {
    await presenterRef.current!.logout(authToken!)
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
                <span style={{ fontSize: '1.8rem' }}>✨</span>
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
                to={`/feed/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/feed/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Feed
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/home/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/home/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Home
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/connections/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/connections/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Connections
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

export default AppNavbar;
