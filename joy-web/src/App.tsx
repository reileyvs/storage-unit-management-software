import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/authentication/Login";
import { Register } from "./components/authentication/Register";
import MainLayout from "./components/MainLayout";
import { useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [password, setPassword] = useState("");
  const isAuthenticated = () => {
    console.log(user)
    return !!user;
  };
  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes user={user} authToken={authToken} />
        ) : (
          <UnAuthenticatedRoutes setUser={setUser} setPassword={setPassword} />
        )}
      </BrowserRouter>
    </div>
  );
}

interface Prop {
  user: string | undefined;
  authToken: string | undefined;
}

const AuthenticatedRoutes = (props: Prop) => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`home`} />} />
        <Route path="home" element={<Register />} />
      </Route>
    </Routes>
  );
};
interface Props {
  setUser: (user: string) => void;
  setPassword: (password: string) => void;
}
const UnAuthenticatedRoutes = (props: Props) => {
  return (
    <Routes>
      <Route index element={<Navigate to={"/login"} />} />
      <Route
        path="login"
        element={
          <Login setUser={props.setUser} setPassword={props.setPassword} />
        }
      />
      <Route path="register" element={<Register />} />
    </Routes>
  );
};
export default App;
