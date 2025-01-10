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

    createMonthlyExpenseLimit:build.mutation({
      query: (data) => {
        return {
          url: "/expense/limit-create",
          method: "POST",
         headers: {
          Authorization: accessToken || "",
      },
          contentType: "application/json",
          body:{spendingLimits:data.spendingLimits},
        };
      },
      invalidatesTags: [tagTypes.expense],
    }),

    getAllExpense: build.query({
      query: (query) => {
        return {
          url: `/expense/tasks?filter=${query ? query : ""}`,
          method: "GET",
          headers: {
            Authorization: accessToken || "",
        },
        };
      },
      providesTags: [tagTypes.expense],
    }),

  
    updateExpense: build.mutation({
       query: (data) => {
        console.log(data.categories,'in redux')
        return {
          url: `/expense/tasks/${data.expenseId}`,
          method: "PUT",
          headers: {
            Authorization: accessToken || "",
        },
          body: data.categories,
          contentType: "application/json",
        };
      },
      invalidatesTags: [tagTypes.expense],
    }),
    deleteExpenses: build.mutation({
       query: (expenseId) => {
        return {
          url: `/expense/tasks/${expenseId}`,
          method: "DELETE",
          headers: {
            Authorization: accessToken || "",
        },
        };
      },
      invalidatesTags: [tagTypes.expense],
    }),


  }),
});

export const {
  useCreateExpenseMutation,
  useCreateMonthlyExpenseLimitMutation,
  useGetAllExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteExpensesMutation,
  
} = flatApi;
