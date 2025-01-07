'use client';

import { useLoginMutation } from '@/src/redux/api/autApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function LoginPage() {
    const router=useRouter()
    const [login, { isLoading, error }] = useLoginMutation(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login({ email, password }).unwrap();
            console.log('Login successful:', response);

            toast.success('Login successful!');
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed! Please check your credentials.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '500px',
                height: '100vh',
                margin: '0 auto',
            }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <label style={{ marginBottom: '10px' }}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </label>
                <label style={{ marginBottom: '20px' }}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        width: '100%',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                {error && <p style={{ color: 'red' }}>{error?.data?.message  || 'Login failed'}</p>} {/* Show error message if available */}
                
                <Link href="/register" style={{ textAlign: 'center', marginTop: '10px' }}>
                    Don&apos;t have an account? Register
                </Link>
            </form>
        </div>
    );
}

export default LoginPage;
