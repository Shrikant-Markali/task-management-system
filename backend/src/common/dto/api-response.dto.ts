export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T | null;

  private constructor(success: boolean, message: string, data: T | null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'OK'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(true, message, data);
  }

  static error(message: string): ApiResponseDto<null> {
    return new ApiResponseDto<null>(false, message, null);
  }
}