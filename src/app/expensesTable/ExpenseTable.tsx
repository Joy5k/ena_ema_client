"use client";

import React from 'react';
import styles from './ExpenseTable.module.css';

export default function ExpenseTable() {
  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Date</th>
            <th className={styles.headerCell}>Groceries</th>
            <th className={styles.headerCell}>Transportation</th>
            <th className={styles.headerCell}>Healthcare</th>
            <th className={styles.headerCell}>Utility</th>
            <th className={styles.headerCell}>Charity</th>
            <th className={styles.headerCell}>Miscellaneous</th>
            <th className={styles.headerCell}>Total</th>
            <th className={styles.headerCell}>Update</th>
            <th className={styles.headerCell}>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.dataRow}>
            <td className={styles.dataCell}>Example Header</td>
            <td className={styles.dataCell}>90</td>
            <td className={styles.dataCell}>$100</td>
            <td className={styles.dataCell}>$50</td>
            <td className={styles.dataCell}>$200</td>
            <td className={styles.dataCell}>$75</td>
            <td className={styles.dataCell}>$75</td>
            <td className={`${styles.dataCell} ${styles.bold}`}>$475</td>
            <td className={`${styles.dataCell} ${styles.update}`}>Update</td>
            <td className={`${styles.dataCell} ${styles.delete}`}>Delete</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
