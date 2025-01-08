'use client';

import { useRegisterMutation } from '@/src/redux/api/autApi';
import { setToLocalStorage } from '@/src/utils/local-storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import styles from './Register.module.css'; // Import the CSS module

function Register() {
    const router = useRouter();
    const [registerMutation] = useRegisterMutation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, email, password };
        try {
            const res = await registerMutation(payload).unwrap();

            if (res?.success && res?.data?.accessToken) {
                // save the accessToken on localstorage
                setToLocalStorage("accessToken", res?.data?.accessToken);
                toast.success('Successfully registered');
                
            //delay one second for ensure accessToken save localstorage successfully
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                toast.error(res?.message || 'Registration failed');
            }
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                toast.error(err.message || 'An error occurred during registration');
            } else {
                toast.error('An error occurred during registration');
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Your Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label className={styles.passwordLabel}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <button type="submit" className={styles.button}>
                    Register
                </button>
                <Link href="/login" className={styles.link}>
                    Login
                </Link>
            </form>
        </div>
    );
}

export default Register;
 