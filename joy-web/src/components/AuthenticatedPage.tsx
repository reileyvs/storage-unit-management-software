import { NavButton } from "./NavButton";

interface Props {

}

export function Home(props: Props) {
  return (
    <NavButton path="/login" buttonText="Login" />
  )
}