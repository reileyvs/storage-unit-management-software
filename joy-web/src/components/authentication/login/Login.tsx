// import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthenticationFields } from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActionsHook } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthView } from "../../../presenter/AuthPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActionsHook();
  const { displayErrorMessage } = useMessageActions();

  const listener: AuthView = {
    setIsLoading: setIsLoading,
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage
  }

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (presenterRef.current == null) {
    presenterRef.current =props.presenter ?? new LoginPresenter(listener);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenterRef.current!.doLogin(rememberMe, alias, password, props.originalUrl);
    }
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        onKeyDown={loginOnEnter}
        doRegisterOrLogin={() => presenterRef.current!.doLogin(rememberMe, alias, password, props.originalUrl)}
        checkSubmitButtonStatus={checkSubmitButtonStatus}
        setAlias={setAlias}
        setPassword={setPassword}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => presenterRef.current!.doLogin(rememberMe, alias, password, props.originalUrl)}
    />
  );
};

export default Login;
