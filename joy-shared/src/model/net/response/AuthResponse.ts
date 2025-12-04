import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserResponse } from "./UserResponse";

export interface AuthResponse extends UserResponse {
  authToken: AuthTokenDto | null;
}