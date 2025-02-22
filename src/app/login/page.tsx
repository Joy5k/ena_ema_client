'use client';

import { useLoginMutation } from '@/src/redux/api/autApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import styles from './Login.module.css'; // Import the CSS module
import { setToLocalStorage } from '@/src/utils/local-storage';

function LoginPage() {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError]=useState<string>("")
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login({ email, password }).unwrap();

            if(response.success){
                setToLocalStorage("accessToken",response?.data?.accessToken)
                toast.success('Login successful!');
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = (error as { data?: { message?: string } }).data?.message;
            setError(errorMessage ? errorMessage : "something went wrong")
            toast.error('Login failed! Please check your credentials.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <p className={styles.demoCR}>Email: user@gmail.com</p>
                <p className={styles.demoCR}>password: 123456</p>
                <hr />
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
                <button
                    type="submit"
                    className={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                {error && <p className={styles.errorMessage}>{error || 'Login failed'}</p>}

                <Link href="/register" className={styles.link}>
                    Don&apos;t have an account? Register
                </Link>
            </form>
        </div>
    );
}

export default LoginPage;
