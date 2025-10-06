export interface UsernameCheckResponse {
  success: boolean;
  data: {
    exist: boolean;
  };
  message: string;
}
