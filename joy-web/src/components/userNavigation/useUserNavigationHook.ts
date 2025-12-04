import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";
import { useRef } from "react";
import { useUserInfoActionsHook, useUserInfoHook } from "../userInfo/UserInfoHooks";

export const useUserNavigationHook = () => {
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfoHook();
  const { setDisplayedUser } = useUserInfoActionsHook();

  const listener: UserNavigationView = {
    displayErrorMessage: displayErrorMessage,
    extractAlias: (value: string): string => {
      const index = value.indexOf("@");
      return value.substring(index);
    },
    navigate: navigate,
    setDisplayedUser: setDisplayedUser
  };
  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (presenterRef.current == null) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }
  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string
  ): Promise<void> => {
    event.preventDefault();

    await presenterRef.current!.navigateToUser(event, featurePath, displayedUser!, authToken!);
  };

  /*
    appnav----
    postStatus----
    login----
    register----
    userInfo----
    story----
    feed----
    navHook----
    userItemScroller (abstract)----
    statusItemScroller (abstract)----
    followee----
    follower----
    */

  return { navigateToUser };
};
