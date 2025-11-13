import { NavButton } from "./NavButton";

export function Register() {
  return (
    <>
      <div>Welcome to Joy</div>
      <div>Please register</div>
      <input type="text" size={50} placeholder={"name@example.com"} />
      <input type="password" size={50} placeholder="secretpassword" />
      <div>
        <NavButton path="/register" buttonText="Register" />
      </div>
    </>
  );
};