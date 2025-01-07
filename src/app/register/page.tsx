'use client'; 

import {  useRegisterMutation } from '@/src/redux/api/autApi';
import { setToLocalStorage } from '@/src/utils/local-storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function Register() {
    const router=useRouter()
    const [registerMutation]=useRegisterMutation()
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, email, password };
        try {
            const res = await registerMutation(payload).unwrap();
            console.log(res.data.accessToken,"response");
            if (res?.success&& res?.data?.accessToken) {
                setToLocalStorage("accessToken",res?.data?.accessToken)
                toast.success('Successfully registered');
                router.push("/")
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:"500px", height: '100vh',margin:"0 auto" }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <label style={{ marginBottom: '10px' }}>
                    Your Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </label>
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
                <button type="submit" style={{
                     padding: '10px', 
                     width: '100%',
                     backgroundColor: '#007BFF', 
                     color: 'white',
                      border: 'none',
                     cursor: 'pointer' 
                     }}>
                    Register
                </button>
                <Link href="/register">Login</Link>

            </form>
        </div>
    );
}

export default Register;
