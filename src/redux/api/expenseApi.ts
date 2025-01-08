import { getFromLocalStorage } from "@/src/utils/local-storage";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const accessToken=getFromLocalStorage("accessToken")
export const flatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createExpense: build.mutation({
      query: (data) => {
        console.log(data)
        return {
          url: "/expense/tasks",
          method: "POST",
         headers: {
          Authorization: accessToken || "",
      },
          contentType: "application/json",
          body:data,
        };
      },
      invalidatesTags: [tagTypes.expense],
    }),

    getAllExpense: build.query({
      query: (query) => {
        return {
          url: `/expense/tasks?filter=${query ? query : ""}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.expense],
    }),

  
    updateExpense: build.mutation({
       query: (data) => {
        return {
          url: `/expense/tasks/${data.expenseId}`,
          method: "PATCH",
          data: data.expenseData,
          contentType: "application/json",
        };
      },
      invalidatesTags: [tagTypes.expense],
    }),
    deleteFlatByAdmin: build.mutation({
       query: (expenseId) => {
        return {
          url: `/expense/tasks/${expenseId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [tagTypes.expense],
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useGetAllExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteFlatByAdminMutation,
  
} = flatApi;
