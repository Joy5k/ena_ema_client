"use client";

import React, { useState } from "react";
import styles from "./ExpenseTable.module.css";
import { useGetAllExpenseQuery } from "@/src/redux/api/expenseApi";

interface Category {
    category: string;
    amount: number;
    date: string;
}

interface ExpenseData {
    _id: string | null;
    categories: Category[];
    dailyTotal: number;
}

export default function ExpenseTable() {
    const { data } = useGetAllExpenseQuery({});
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

    const openUpdatePrompt = (expense: ExpenseData) => {
        setCurrentExpense(expense);
        setUpdatedCategories(expense.categories);
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
    const handleConfirmUpdate = () => {
        if (updatedCategories && currentExpense) {
            const updatedExpense = {
                ...currentExpense,
                categories: updatedCategories,
                dailyTotal: updatedCategories.reduce((total, cat) => total + cat.amount, 0),
            };

            console.log("Confirming expense update:", updatedExpense);
            // You can add your API call or logic to save the updated expense here.
        }

        closeUpdatePrompt(); // Close the prompt after confirmation
    };

    return (
        <div>
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
                            <button onClick={handleConfirmUpdate}>Yes</button>
                            <button onClick={closeUpdatePrompt}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Table */}
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
                        expenses.map((expense: ExpenseData, index: number) => (
                            <tr key={index} className={styles.dataRow}>
                                <td className={styles.dataCell}>
                                    {expense.categories?.[0]?.date || "No Date"}
                                </td>
                                {categories.map((category, catIndex) => {
                                    const categoryData = expense.categories?.find(
                                        (cat) => cat.category === category
                                    );
                                    return (
                                        <td key={catIndex} className={styles.dataCell}>
                                            {categoryData?.amount || ""}
                                        </td>
                                    );
                                })}
                                <td className={`${styles.dataCell} ${styles.bold}`}>
                                    {expense.dailyTotal || 0}
                                </td>
                                <td
                                    className={`${styles.dataCell} ${styles.update}`}
                                    onClick={() => openUpdatePrompt(expense)}
                                >
                                    Update
                                </td>
                                <td className={`${styles.dataCell} ${styles.delete}`}>
                                    Delete
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
        </div>
    );
}
