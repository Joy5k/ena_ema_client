"use client"

import React, { useState } from 'react';
import styles from './Home.module.css';  // Import the CSS module

function Home() {
  interface Expense {
    date: string;
    category: string;
    purpose: string;
    amount: string;
  }

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expense, setExpense] = useState({ category: '', purpose: '', amount: '' });
  const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newExpense: Expense = { ...expense, date: new Date().toLocaleString() };
    setExpenses([...expenses, newExpense]);
    setExpense({ category: '', purpose: '', amount: '' });
  };

  return (
    <div>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Expense Tracker</h1>
          <p>Track your expenses and stay on budget.</p>
        </header>

        <h2 className={styles.title}>Expense Input</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Category:
            <select  name="category" value={expense.category} onChange={handleChange} 
            style={{
              padding:"3px"
            }}
             required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Purpose:
            <input type="text" name="purpose" value={expense.purpose} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Amount:
            <input type="number" name="amount" value={expense.amount} onChange={handleChange} required />
          </label>
          <br />
          <button type="submit">Add Expense</button>
        </form>
      </div>

     <div className={`${styles.mt20 } ${styles.container} `} 
     style={{  margin:" 20px auto"}}>
     <h2 className={styles.title}>Expenses Summary</h2>
      <ul>
        {expenses.map((exp, index) => (
          <li key={index}>
            {exp.date} - {exp.category}: {exp.purpose} - ${exp.amount}
          </li>
        ))}
      </ul>
     </div>
    </div>
  );
}

export default Home;
