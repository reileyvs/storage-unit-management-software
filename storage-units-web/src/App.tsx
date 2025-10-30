import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to={"/login"} />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const RegisterPage = () => {
  return (
    <>
      <div>Welcome to Storage Unit Management</div>
      <div>Please register</div>
      <input type="text" size={50} placeholder={"name@example.com"} />
      <input type="password" size={50} placeholder="secretpassword" />
      <div>
        <LoginButton />
      </div>
    </>
  );
};
const LoginPage = () => {
  return (
    <>
      <div>Welcome to Storage Unit Management</div>
      <div>Please log in</div>
      <input type="text" size={50} placeholder={"name@example.com"} />
      <input type="password" size={50} placeholder="secretpassword" />
      <div>
        <RegisterButton />
      </div>
    </>
  );
};

const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/login");
      }}
    >
      Login
    </button>
  );
};
const RegisterButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/register");
      }}
    >
      Register
    </button>
  );
};

export default App;
