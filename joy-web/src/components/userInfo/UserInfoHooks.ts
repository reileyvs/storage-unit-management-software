import { useContext } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";

export const useUserInfoHook = () => { return useContext(UserInfoContext); }
export const useUserInfoActionsHook = () => { return useContext(UserInfoActionsContext)}
