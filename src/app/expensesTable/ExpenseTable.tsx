"use client";

import React, { useState } from "react";
import styles from "./ExpenseTable.module.css";
import { useDeleteExpensesMutation, useGetAllExpenseQuery, useUpdateExpenseMutation } from "@/src/redux/api/expenseApi";
import { toast } from "sonner";

interface Category {
    category: string;
    amount: number;
    date: string;
}

interface ExpenseData {
    _id: string | null;
    categories: Category[];
    dailyTotal: number;
    date:string
}

export default function ExpenseTable() {
    const { data } = useGetAllExpenseQuery({});
    const [updateExpense,{isLoading}]=useUpdateExpenseMutation()
    const [deleteExpenses,{isLoading:deletingExpenses}]=useDeleteExpensesMutation()
    const expenses = data?.data || [];


    
    const categories = [
        "Groceries",
        "Transportation",
        "Healthcare",
        "Utility",
        "Charity",
        "Miscellaneous",
        "other",
    ];
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
    const [currentExpense, setCurrentExpense] = useState<ExpenseData | null>(null);
    const [updatedCategories, setUpdatedCategories] = useState<Category[] | null>(null);

    const openUpdatePrompt = (expense: { date: string; data: Record<string, number>; total: number }) => {
        const categories = Object.entries(expense.data).map(([category, amount]) => ({
            category,
            amount,
            date: expense.date,
        }));
        setCurrentExpense({ _id: null, categories, dailyTotal: expense.total, date: expense.date });
        setUpdatedCategories(categories);
        setShowUpdatePrompt(true);
    };
  
    
    const closeUpdatePrompt = () => {
        setShowUpdatePrompt(false);
    };

    // Handle input change for categories and amounts
    const handleCategoryAmountChange = (category: string, newAmount: number) => {
        if (updatedCategories) {
            const updatedCategory = updatedCategories.map((cat) =>
                cat.category === category ? { ...cat, amount: newAmount } : cat
                
            );
            setUpdatedCategories(updatedCategory);
        }
    };

    // The function that will trigger when the user confirms the update.
    const handleConfirmUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (updatedCategories && currentExpense) {
            const updatedExpense = {
                categories: updatedCategories,
            };
            const date= updatedExpense.categories[0]?.date
            const payload={
                expenseId:date,
                categories:{categories:updatedCategories}
            }
        try {
            const res=await updateExpense(payload).unwrap()
            if(res.success){
              toast.success("Expenses updated successfully")
            }
        } catch (error) {
            // define error and appearing the error if exists 
            const errorMessage = (error as { data?: { message?: string } }).data?.message;
            toast.error(errorMessage ? errorMessage : "something went wrong");
        }
        }

        closeUpdatePrompt(); // Close the prompt after confirmation
    };

    // delete expenses recorded according to date and user email
    const handleDeleteExpenses=async(date:string)=>{
        const res =await deleteExpenses(date).unwrap()
        if(res.success){
            toast.success("Successfully deleted the expenses")
        }
    }


    return (
        <div>
          

            {/*Expenses Table */}
            <table className={styles.table}>
                <thead>
                    <tr className={styles.headerRow}>
                        <th className={styles.headerCell}>Date</th>
                        {categories.map((category, index) => (
                            <th key={index} className={styles.headerCell}>
                                {category}
                            </th>
                        ))}
                        <th className={styles.headerCell}>Total</th>
                        <th className={styles.headerCell}>Update</th>
                        <th className={styles.headerCell}>Delete</th>
                    </tr>
                </thead>
                <tbody>
    {expenses.length > 0 ? (
        Object.entries(
            expenses
                .flatMap((expense:ExpenseData) => expense.categories) // Combine all categories into a single array
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .reduce((acc: Record<string, any>, category:{date:string,amount:number,category:string}) => {
                    const { date, category: catName, amount } = category;
                    if (!acc[date]) {
                        acc[date] = { date, data: {}, total: 0 };
                    }
                    acc[date].data[catName] = (acc[date].data[catName] || 0) + amount; // Aggregate amounts
                    acc[date].total += amount; // Calculate the total for the day
                    return acc;
                }, {})
        )
            .sort(
                ([dateA], [dateB]) =>
                    new Date(dateA).getTime() - new Date(dateB).getTime()
            ) // Sort by date
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map(([date, { data, total }]: [string, any], index: number) => (
                <tr key={index} className={styles.dataRow}>
                    {/** Display the date */}
                    <td className={styles.dataCell}>
                        {new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </td>
                    {/** Display category data */}
                    {categories.map((catName, catIndex) => (
                        <td key={catIndex} className={styles.dataCell}>
                            {data[catName] || ""}
                        </td>
                    ))}
                    <td className={`${styles.dataCell} ${styles.bold}`}>
                        {total || 0}
                    </td>
                    <td
                            className={`${styles.dataCell} ${styles.update} ${styles.tooltipTarget}`}
                            onClick={() => openUpdatePrompt({ date, data, total })}
                            title="Click to update expense" >
                            {isLoading ? "Loading..." : "Update"}
                        </td>

                    <td  className={`${styles.dataCell} ${styles.delete} ${styles.tooltipTarget}`}
    
                    onClick={()=>handleDeleteExpenses(date)}
                    title=" Permanently delete the date "
                    >
                        {deletingExpenses ? "Loading...":"Delete"}
                    </td>
                </tr>
            ))
    ) : (
        <tr className={styles.dataRow}>
            <td className={styles.dataCell} colSpan={categories.length + 3}>
                No Data Available
            </td>
        </tr>
    )}
</tbody>



            </table>


              {/* Update Prompt */}
              {showUpdatePrompt && currentExpense && updatedCategories && (
                <div className={styles.promptOverlay}>
                    <div className={styles.prompt}>
                        <h2>Update Expense</h2>
                        {updatedCategories.map((category, index) => (
                            <div key={index} className={styles.categoryInput}>
                                <label>{category.category}</label>
                                <input
                                    type="number"
                                    value={category.amount}
                                    onChange={(e) =>
                                        handleCategoryAmountChange(category.category, Number(e.target.value))
                                    }
                                    className={styles.amountInput}
                                />
                            </div>
                        ))}
                        <div className={styles.actionButtons}>
                            <button onClick={handleConfirmUpdate}>{isLoading ?"Loading..." :"save"}</button>
                            <button disabled={isLoading} onClick={closeUpdatePrompt}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
