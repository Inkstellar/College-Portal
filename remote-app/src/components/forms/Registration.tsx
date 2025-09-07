import React, { useState } from 'react';
import { TextField } from './TextField';
import { Button } from './Button';
import FormContainer from './FormContainer';
import { Stack } from '@mui/material';

export interface RegistrationProps {
    onRegister?: (name: string, email: string, password: string) => void;
}
const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (onRegister) {
            onRegister(name, email, password);
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
            <Stack gap={1}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
                </Stack>
            </form>
        </FormContainer>
    );
};

export default Registration;
