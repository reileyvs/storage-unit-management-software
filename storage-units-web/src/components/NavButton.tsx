import { useNavigate } from "react-router-dom";
interface Props {
  path: string
  buttonText: string
}
export function NavButton(props: Props) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(props.path)
      }}
    >
      {props.buttonText}
    </button>
  )
}
