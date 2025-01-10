"use client"

import React, { useEffect, useState } from 'react';
import styles from './Home.module.css'; 
import { getFromLocalStorage } from '../utils/local-storage';
import { useRouter } from 'next/navigation';
import { useCreateExpenseMutation, useCreateMonthlyExpenseLimitMutation } from '../redux/api/expenseApi';
import { toast } from 'sonner';
import ExpenseTable from './expensesTable/ExpenseTable';

function Home() {
  const router=useRouter()
  const [createMonthlyExpense,{isLoading}]=useCreateMonthlyExpenseLimitMutation()
  const [createExpense]=useCreateExpenseMutation()
  const accessToken = getFromLocalStorage("accessToken");

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [router,accessToken]);

  useEffect(() => {
    const isFirstVisit = getFromLocalStorage('firstVisit') === null;
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
  }, []);

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



  const [expense, setExpense] = useState<{ [key: string]: number|string }>({});
  const [expensesCalculation, setExpenseCalculation] = useState<{ [key: string]: number }>({});
  const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous'];
  const [error,setError]=useState<string>("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setError("")
      const { name, value } = e.target;
      setExpense({ ...expense, [name]: value });
      setExpenseCalculation({ ...expensesCalculation, [name]: parseFloat(value) || 0 });
    };

  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  setError("")
try {
  const data={...expense,amount:Number(expense.amount)}
    const res=await  createExpense(data).unwrap()
    if(res?.success){
      toast.success("created expenses successfully")
    }
} catch (error) {
    const errorMessage = (error as { data?: { message?: string } }).data?.message;
    toast.error(errorMessage ? errorMessage : "something went wrong");
    setError(errorMessage ? errorMessage : "something went wrong");
}

  };
  const handleSetExpenseLimit = async (e: React.FormEvent<HTMLFormElement>): Promise<void>=> {
    e.preventDefault();
    setError("")
    // Combine all form data
    const formData = {
      spendingLimits: Object.entries(expense).map(([category, amount]) => ({
        category,
        amount,
      })),
    };

try {
  const res= await createMonthlyExpense(formData).unwrap()
  if(res?.success){
    toast.success("Monthly Expenses goal created Successfully")
  }
} catch (error) {
  const errorMessage = (error as { data?: { message?: string } }).data?.message;
  setError(errorMessage ? errorMessage : "something went wrong")
  toast.error(errorMessage ? errorMessage : "something went wrong");

}


  }

  return (
    <div>
   <div className={`${styles.container} ${styles.mb10}`} style={{fontFamily:"sans-serif"}}>
      <div id="overlay" className={styles.overlay} onClick={closePrompt}></div>
      <h2
        style={{
          fontFamily: 'sans-serif',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Set Your Monthly Expense Limit
      </h2>
      <div id="promptContainer" className={styles.promptContainer}>
        <div className={styles.prompt}>
          <h2>Welcome to the Expense Tracker!</h2>
          <p>Please add your first expense or set a monthly expense goal.</p>
          <form  style={{ padding: '10px' }} onSubmit={handleSetExpenseLimit}>
            <label>
              Monthly Expense Goal:{Object.values(expense).reduce<number>(
                  (acc, curr) => acc + (Number(curr) || 0),
                  0
                ).toString()}
             
            </label>
            <br />

            {categories.map((category) => (
              <div
                key={category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  marginTop: '10px',
                }}
              >
                <label style={{ flex: 1 }}>{category}:</label>
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
           <p style={{color:"red"}}>{error}</p>
            <button type="submit" style={{ marginRight: '5px' }}>
             {isLoading ? "Loading..." :"Set Goal"}
            </button>
            <button
              type="button"
              className={styles.closeButton}
              onClick={closePrompt}
              style={{ marginBottom: '20px' }}
            >
              Close
            </button>
          </form>
        </div>
      </div>
      <button
        className={styles.showPrompt}
        onClick={() => {
          const overlay = document.getElementById('overlay');
          if (overlay) {
            overlay.style.display = 'block';
          }
          const promptContainer = document.getElementById('promptContainer');
          if (promptContainer) {
            promptContainer.style.display = 'block';
          }
        }}
      >
        Set Your Limit
      </button>
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
            <select name="category"  onChange={handleChange} style={{ padding: "3px" }} required>
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
          
          <p style={{color:"red"}}>{error}</p>

          <br />
          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div className={`${styles.mt20} ${styles.tableContainer}`} style={{ margin: "20px auto" }}>
        <h2 className={styles.title}>Expenses Summary</h2>
        <ExpenseTable></ExpenseTable>
      </div>
    </div>
  );
}

export default Home;
