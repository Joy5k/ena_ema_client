"use client"

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';  // Import the CSS module
import { getFromLocalStorage } from '../utils/local-storage';
import { useRouter } from 'next/navigation';
import { IExpense } from '../types';

function Home() {
  const router=useRouter()
  useEffect(() => {
    const accessToken = getFromLocalStorage("accessToken");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  const isFirstVisit = localStorage.getItem('firstVisit') === null;
  useEffect(() => {
    if (isFirstVisit) {
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.style.display = 'block';
      }
      const promptContainer = document.getElementById('promptContainer');
      if (promptContainer) {
        promptContainer.style.display = 'block';
      }
      localStorage.setItem('firstVisit', 'false');
    }
  }, [isFirstVisit]);

  const closePrompt = () => {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    const promptContainer = document.getElementById('promptContainer');
    if (promptContainer) {
      promptContainer.style.display = 'none';
    }
  };



  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [expense, setExpense] = useState({ category: '', purpose: '', amount: '' });
  const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newExpense: IExpense = { ...expense, date: new Date().toISOString() }; // Use ISO format
    setExpenses([...expenses, newExpense]);
    setExpense({ category: '', purpose: '', amount: '' });
  };

  

  return (
    <div>
   <div className={styles.container}>
      <div id="overlay" className={styles.overlay} onClick={closePrompt}></div>
      <div id="promptContainer" className={styles.promptContainer}>

        <div className={styles.prompt}>
          <h2>Welcome to the Expense Tracker!</h2>
          <p>Please add your first expense or set a monthly expense goal.</p>
          <form style={{padding:"10px"}}>
            <label>
              Monthly Expense Goal:
              <input
              type="number"
              name="monthlyGoal"
              placeholder={Object.values(expense).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0).toString()}
              
              />
            </label>
            <br />

    {categories.map((category) => (
      <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px',marginTop:"10px" }}>
      <label style={{ flex: 1 }}>
        {category}:
      </label>
      <input
        type="number"
        style={{ flex: 2, marginLeft: '10px', padding: '5px' }}
        name={`category-${category}`}
        onChange={(e) => {
        const value = parseFloat(e.target.value) || 0;
        setExpense((prev) => ({ ...prev, [category]: value }));
        }}
      />
      </div>
    ))}



            <button type="submit" style={{marginRight:"5px"}}>Set Goal</button>
          <button type="button" className={styles.closeButton} onClick={closePrompt} style={{marginBottom:"20px"}}>Close</button>
          </form>

        </div>
      </div>
      <button className={styles.showPrompt} onClick={() => {
        const overlay = document.getElementById('overlay');
        if (overlay) {
          overlay.style.display = 'block';
        }
        const promptContainer = document.getElementById('promptContainer');
        if (promptContainer) {
          promptContainer.style.display = 'block';
        }
      }}>Set Your Limit</button>
    </div>


      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Expense Tracker</h1>
          <p>Track your expenses and stay on budget.</p>
        </header>

        <h2 className={styles.title}>Expense Input</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Category:
            <select name="category" value={expense.category} onChange={handleChange} style={{ padding: "3px" }} required>
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

      <div className={`${styles.mt20} ${styles.container}`} style={{ margin: "20px auto" }}>
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
