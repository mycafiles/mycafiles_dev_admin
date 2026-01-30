// src/layouts/DashboardLayout.jsx
import { AppShell, Burger, Group, Text, Button, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { IconUsers, IconLogout } from '@tabler/icons-react';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [opened, { toggle }] = useDisclosure();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const adminLinks = (
        <>
            <Text fw={500} size="sm" c="dimmed" mb="xs">ADMIN MENU</Text>
            <Stack gap={4}>
                <Button
                    component={Link}
                    to="/dashboard/ca"
                    variant={location.pathname === '/dashboard/ca' ? 'light' : 'subtle'}
                    fullWidth
                    justify="flex-start"
                    leftSection={<IconUsers size={18} />}
                >
                    Manage CAs
                </Button>
            </Stack>
        </>
    );

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text fw={700}>MRD SaaS Admin</Text>
                    </Group>
                    <Button variant="light" color="red" size="xs" leftSection={<IconLogout size={16} />} onClick={handleLogout}>Logout</Button>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                {adminLinks}
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}