import { UserService } from "../model.service/UserService";
import { ChangeEvent } from "react";
import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import bcrypt from "bcryptjs"

export class RegisterPresenter extends AuthPresenter {
  private service: UserService;
  private setImageBytes: (bytes: Uint8Array) => void;
  private setImageUrl: (url: string) => void;
  private setImageFileExtension: (ext: string) => void;

  public constructor(
    view: AuthView,
    setImageBytes: (bytes: Uint8Array) => void,
    setImageUrl: (url: string) => void,
    setImageFileExtension: (ext: string) => void
  ) {
    super(view);
    this.service = new UserService();
    this.setImageBytes = setImageBytes;
    this.setImageUrl = setImageUrl;
    this.setImageFileExtension = setImageFileExtension;
  }

  handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  };

  handleImageFile = (file: File | undefined) => {
    if (file) {
      this.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.setImageFileExtension(fileExtension);
      }
    } else {
      this.setImageUrl("");
      this.setImageBytes(new Uint8Array());
    }
  };

  getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    this.doAuthenticationOperation(
      async (navLocation: string) => {
        const [user, authToken] = await this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        );

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigate(`${navLocation}/${user.alias}`);
      },
      "/feed",
      "register user"
    );
  }
}
