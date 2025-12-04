import { Link } from "react-router-dom";
import { User } from "joy-shared";

import { useUserNavigationHook } from "../userNavigation/useUserNavigationHook";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  const { navigateToUser } = useUserNavigationHook();

  const handleNavigation = async (event: React.MouseEvent) => {
    await navigateToUser(event, props.featurePath);
  }

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${props.user.alias}`}
                onClick={handleNavigation}
              >
                {props.user.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
