import axios, { AxiosError } from "axios";

/**
 * Handles Axios errors consistently across the app
 */
export function handleApiError(error: unknown): {
  title: string;
  message: string;
  statusCode?: number;
} {
  // Default error messages
  let title = "Something went wrong";
  let message = "Please try again later.";
  let statusCode;

  if (axios.isAxiosError(error)) {
    statusCode = error.response?.status;

    switch (statusCode) {
      case 400:
        title = "Invalid Request";
        message =
          "The request was not valid. Please check the URL or parameters.";
        break;

      case 401:
        title = "Unauthorized";
        message = "You need to log in to access this resource.";
        break;

      case 403:
        title = "Forbidden";
        message = "You don't have permission to view this content.";
        break;

      case 404:
        title = "Not Found";
        message = "No products found for this category.";
        break;

      case 500:
        title = "Server Error";
        message = "Something went wrong on our end. Please try again later.";
        break;

      default:
        title = "Error";
        message =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
    }
  } else if (error instanceof Error) {
    // Handle network or generic JS errors
    message = error.message || message;
  }

  return { title, message, statusCode };
}
