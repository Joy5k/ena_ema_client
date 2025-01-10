"use client";

import React, { useState, useEffect } from "react";
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
    date: string;
}

export default function ExpenseTable() {
    const { data } = useGetAllExpenseQuery({});
    const [updateExpense, { isLoading }] = useUpdateExpenseMutation();
    const [deleteExpenses, { isLoading: deletingExpenses }] = useDeleteExpensesMutation();
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

    // Hydration fix: Only render after the component mounts
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Avoid rendering before the component has mounted
    }

    const openUpdatePrompt = (expense: { date: string; data: Record<string, number>; total: number }) => {
        const categories = Object.entries(expense?.data || {}).map(([category, amount]) => ({
            category,
            amount,
            date: expense?.date,
        }));
        setCurrentExpense({ _id: null, categories, dailyTotal: expense.total, date: expense?.date });
        setUpdatedCategories(categories);
        setShowUpdatePrompt(true);
    };

    const closeUpdatePrompt = () => {
        setShowUpdatePrompt(false);
    };

    const handleCategoryAmountChange = (category: string, newAmount: number) => {
        if (updatedCategories) {
            const updatedCategory = updatedCategories.map((cat) =>
                cat.category === category ? { ...cat, amount: newAmount } : cat
            );
            setUpdatedCategories(updatedCategory);
        }
    };

    const handleConfirmUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (updatedCategories && currentExpense) {
            const updatedExpense = {
                categories: updatedCategories,
            };
            const date = updatedExpense?.categories[0]?.date;
            const payload = {
                expenseId: date,
                categories: { categories: updatedCategories },
            };
            try {
                const res = await updateExpense(payload).unwrap();
                if (res.success) {
                    toast.success("Expenses updated successfully");
                }
            } catch (error) {
                const errorMessage = (error as { data?: { message?: string } }).data?.message;
                toast.error(errorMessage ? errorMessage : "something went wrong");
            }
        }

        closeUpdatePrompt();
    };

    const handleDeleteExpenses = async (date: string) => {
        const res = await deleteExpenses(date).unwrap();
        if (res.success) {
            toast.success("Successfully deleted the expenses");
        }
    };

    return (
        <div>
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
                        (Object.entries(
                            expenses
                                .flatMap((expense: ExpenseData) => expense.categories)
                                .reduce((acc: Record<string, { date: string; data: Record<string, number>; total: number }>, category: Category) => {
                                    const { date, category: catName, amount } = category || {};
                                    if (!date) return acc; // Skip if category is undefined
                                    if (!acc[date]) {
                                        acc[date] = { date, data: {}, total: 0 };
                                    }
                                    acc[date].data[catName] = (acc[date].data[catName] || 0) + amount;
                                    acc[date].total += amount;
                                    return acc;
                                }, {})
                        ) as [string, { date: string; data: Record<string, number>; total: number }][])
                            .sort(
                                ([dateA], [dateB]) =>
                                    new Date(dateA).getTime() - new Date(dateB).getTime()
                            )
                            .map(([date, { data, total }], index) => (
                                <tr key={index} className={styles.dataRow}>
                                    <td className={styles.dataCell}>
                                        {new Date(date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    {categories.map((catName, catIndex) => (
                                        <td key={catIndex} className={styles.dataCell}>
                                            {data?.[catName] || ""}
                                        </td>
                                    ))}
                                    <td className={`${styles.dataCell} ${styles.bold}`}>
                                        {total || 0}
                                    </td>
                                    <td
                                        className={`${styles.dataCell} ${styles.update} ${styles.tooltipTarget}`}
                                        onClick={() => openUpdatePrompt({ date, data, total })}
                                        title="Click to update expense"
                                    >
                                        {isLoading ? "Loading..." : "Update"}
                                    </td>
                        
                                    <td
                                        className={`${styles.dataCell} ${styles.delete} ${styles.tooltipTarget}`}
                                        onClick={() => handleDeleteExpenses(date)}
                                        title=" Permanently delete the date "
                                    >
                                        {deletingExpenses ? "Loading..." : "Delete"}
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
                            <button onClick={handleConfirmUpdate}>{isLoading ? "Loading..." : "Save"}</button>
                            <button disabled={isLoading} onClick={closeUpdatePrompt}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
