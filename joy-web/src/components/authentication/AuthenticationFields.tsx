import bcrypt from "bcryptjs"

interface Props {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>, func: (event: React.KeyboardEvent<HTMLElement>) => void) => void;
    doRegisterOrLogin: (event: React.KeyboardEvent<HTMLElement>) => void;
    checkSubmitButtonStatus: () => boolean;
    setAlias: (alias: string) => void;
    setPassword: (password: string) => void;
}


const AuthenticationFields = (props: Props) => {
    const authenticateOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !props.checkSubmitButtonStatus()) {
          props.doRegisterOrLogin(event);
        }
    }

    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            aria-label="alias"
            placeholder="name@example.com"
            onKeyDown={authenticateOnEnter}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            aria-label="password"
            placeholder="Password"
            onKeyDown={authenticateOnEnter}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    )  
}
export { AuthenticationFields };