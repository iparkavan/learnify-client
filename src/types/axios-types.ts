export interface AxiosErrorMessage {
  response?: {
    data?: {
      message?: string;
    };
  };
}
