import { baseApi } from "./baseApi";

export const flatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createExpense: build.mutation({
      query: (data) => {
        return {
          url: "/expense/create",
          method: "POST",
          data,
          contentType: "application/json",
        };
      },
      invalidatesTags: ['expense'],
    }),

    getAllExpense: build.query({
      query: () => {
        return {
          url: `/expense/get-all-expense?`,
          method: "GET",
        };
      },
      providesTags: ["expense"],
    }),

  
    updateExpense: build.mutation({
       query: (data) => {
        return {
          url: `/expense/update/${data.expenseId}`,
          method: "PATCH",
          data: data.expenseData,
          contentType: "application/json",
        };
      },
      invalidatesTags: ['expense'],
    }),
    deleteFlatByAdmin: build.mutation({
       query: (expenseId) => {
        return {
          url: `/expense/delete/${expenseId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["expense"],
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useGetAllExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteFlatByAdminMutation,
  
} = flatApi;
