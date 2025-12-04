import { Link } from "react-router-dom";
import { Status, Type } from "joy-shared";
import { useUserNavigationHook } from "../userNavigation/useUserNavigationHook";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const { navigateToUser } = useUserNavigationHook();

  const handleNavigation = async (event: React.MouseEvent) => {
    await navigateToUser(event, props.featurePath);
  }

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={`${props.featurePath}/${segment.text}`}
            onClick={handleNavigation}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
