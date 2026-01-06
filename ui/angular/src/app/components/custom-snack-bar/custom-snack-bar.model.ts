export type CustomSnackBarData = {
  message: string;
  duration: number;
}

export enum CustomSnackBarType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error'
}
