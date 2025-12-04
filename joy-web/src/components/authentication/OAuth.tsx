import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
    displayMessage: (message: string, duration: number, bootstrapClasses?: string) => string;
    platformString: string;
}


const displayInfoMessageWithDarkBackground = (message: string, props: Props): void => {
    props.displayMessage(
      message,
      3000,
      "text-white bg-primary"
    );
}


const OAuth = (props: Props) => {
    const platformName = props.platformString.charAt(0).toUpperCase() + props.platformString.slice(1);
    return (
        <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                  `${platformName} registration is not implemented.`,
                  props
                )
              }
        >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`${props.platformString}Tooltip`}>{
                    props.platformString.charAt(0).toUpperCase() + props.platformString.slice(1)
                }</Tooltip>}
            >
            <FontAwesomeIcon icon={["fab", props.platformString as any]} />
            </OverlayTrigger>
        </button>
    )
};

export {OAuth};