import { axiosBaseQuery } from "@/src/helpers/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: () => ({}),
  tagTypes: ['expense'],
});
