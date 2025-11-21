import { useNavigate } from "react-router-dom";
import { NavButton } from "../NavButton";

interface Props {
  setUser: (user: string) => void,
  setPassword: (password: string) => void
}

export function Login(props: Props) {
  const nav = useNavigate()
  return (
    <>
      <div>Welcome to Joy</div>
      <div>Please log in</div>
      <input type="text" size={50} placeholder={"name@example.com"} onChange={(event) => props.setUser(event.target.value)}/>
      <input type="password" size={50} placeholder="secretpassword" onChange={(event) => props.setPassword(event.target.value)} />
      <div>
        <NavButton path="/home" buttonText="Login" />
      </div>
    </>
  );
};