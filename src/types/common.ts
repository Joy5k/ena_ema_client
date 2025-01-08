

export type IMeta = {
  page: number;
  limit: number;
  total: number;
};



export type ResponseSuccessType = {
  data: unknown;
  meta?: IMeta;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

 export interface IExpense {
    date: string;
    category: string;
    purpose: string;
    amount: string;
  }