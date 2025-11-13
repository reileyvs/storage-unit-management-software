import { NavButton } from "./NavButton";

export function Login() {
  return (
    <>
      <div>Welcome to Joy</div>
      <div>Please log in</div>
      <input type="text" size={50} placeholder={"name@example.com"} />
      <input type="password" size={50} placeholder="secretpassword" />
      <div>
        <NavButton path="/login" buttonText="Login" />
      </div>
    </>
  );
};