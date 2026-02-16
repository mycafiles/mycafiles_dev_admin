// src/pages/Login.jsx
import { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Notification,
    Box,
    Flex,
    Stack,
    rem
} from '@mantine/core';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Try CA Login first as this is for the CA panel
            const data = await authService.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            if (data.role === 'CAADMIN') {
                navigate('/dashboard/home');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Flex
            h="100vh"
            direction={{ base: 'column', md: 'row' }}
            bg="gray.0"
            style={{ overflow: 'hidden' }}
        >
            {/* Left Side: Brand Panel */}
            <Box
                visibleFrom="md"
                flex={1}
                bg="blue.7"
                style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #1c7ed6 0%, #101113 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative Elements */}
                <Box
                    style={{
                        position: 'absolute',
                        width: '150%',
                        height: '150%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                        top: '-25%',
                        left: '-25%',
                        zIndex: 1
                    }}
                />

                <Stack align="center" gap="xs" style={{ zIndex: 2, textAlign: 'center', padding: rem(40) }}>
                    <Title order={1} c="white" size={rem(48)} fw={900} style={{ letterSpacing: rem(-1) }}>
                        MRD SaaS
                    </Title>
                    <Text c="blue.1" size="md" fw={500} maw={400} opacity={0.8}>
                        The ultimate management platform for modern businesses. Streamlined, powerful, and built for scale.
                    </Text>
                </Stack>
            </Box>

            {/* Right Side: Login Form */}
            <Box
                flex={1}
                p={{ base: 'xl', md: rem(80) }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff'
                }}
            >
                <Container size={420} p={0} w="100%">
                    <Stack gap="xs" mb={rem(40)}>
                        <Title ta={{ base: 'center', md: 'left' }} order={2} fw={800} size={rem(32)}>
                            Welcome back
                        </Title>
                        <Text c="dimmed" size="sm" ta={{ base: 'center', md: 'left' }}>
                            Super Admin Access Only. Please enter your credentials.
                        </Text>
                    </Stack>

                    <Paper p={0} bg="transparent" withBorder={false} shadow="none">
                        {error && (
                            <Notification color="red" onClose={() => setError(null)} mb="md" withBorder>
                                {error}
                            </Notification>
                        )}

                        <form onSubmit={handleLogin}>
                            <Stack gap="md">
                                <TextInput
                                    label="Email Address"
                                    placeholder="admin@mrd.com"
                                    required
                                    size="md"
                                    radius="md"
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Your secure password"
                                    required
                                    size="md"
                                    radius="md"
                                    value={password}
                                    onChange={(e) => setPassword(e.currentTarget.value)}
                                />

                                {/* <Group justify="space-between">
                                    <Checkbox label="Remember me" size="sm" />
                                    <Anchor component="button" type="button" size="sm" fw={600}>
                                        Forgot password?
                                    </Anchor>
                                </Group> */}

                                <Button
                                    fullWidth
                                    size="md"
                                    radius="md"
                                    type="submit"
                                    loading={loading}
                                    mt="md"
                                    style={{
                                        transition: 'transform 0.1s ease',
                                    }}
                                    content="Sign in"
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    <Text ta="center" mt="xl" size="xs" c="dimmed">
                        © 2026 MRD SaaS Admin Inc. All rights reserved.
                    </Text>
                </Container>
            </Box>
        </Flex>
    );
}
