'use client'; 

import {  useRegisterMutation } from '@/src/redux/api/autApi';
import React, { useState } from 'react';
import { toast } from 'sonner';

function Register() {
    const [registerMutation]=useRegisterMutation()
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const res=await registerMutation({name,email,password}).unwrap()
        if(res.success){
            toast.success("Expense added successfully")
        }
       
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width:"500px", height: '100vh',margin:"0 auto" }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <label style={{ marginBottom: '10px' }}>
                    Your Name:
                    <input
                        type="text"
                        value={email}
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
                    Login
                </button>
            </form>
        </div>
    );
}

export default Register;
