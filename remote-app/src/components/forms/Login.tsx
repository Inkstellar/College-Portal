import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';
import { Stack } from '@mui/material';
import FormContainer from './FormContainer';

export interface LoginProps {
    onLogin?: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onLogin) {
            onLogin(email, password);
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <Stack gap={1}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </Stack>
            </form>
        </FormContainer>
    );
};

export default Login;
