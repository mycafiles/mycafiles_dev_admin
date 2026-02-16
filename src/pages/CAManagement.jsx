import { useState, useEffect } from 'react';
import {
    Table,
    Group,
    Text,
    ActionIcon,
    Button,
    Modal,
    TextInput,
    PasswordInput,
    Stack,
    Title,
    Badge,
    rem,
    Paper,
    LoadingOverlay,
    Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { caService } from '../services/caService';
import { notifications } from '@mantine/notifications';

export default function CAManagement() {
    const [cas, setCas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState(false);
    const [editingCa, setEditingCa] = useState(null);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [caToDelete, setCaToDelete] = useState(null);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => {
                if (editingCa) {
                    return value && value.length < 5 ? 'Password must be at least 6 characters' : null;
                }
                return value.length < 5 ? 'Password must be at least 6 characters' : null;
            },
            confirmPassword: (value, values) =>
                values.password && value !== values.password ? 'Passwords do not match' : null,
        },
    });

    const fetchCas = async () => {
        setLoading(true);
        try {
            const response = await caService.getCas();
            setCas(response.data);
        } catch (error) {
            console.error('Failed to fetch CAs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCas();
    }, []);

    const handleAddEdit = async (values) => {
        try {
            const payload = { ...values };
            delete payload.confirmPassword;
            if (editingCa && !payload.password) {
                delete payload.password;
            }

            if (editingCa) {
                await caService.updateCa(editingCa._id, payload);
            } else {
                await caService.createCa(payload);
            }
            setOpened(false);
            form.reset();
            setEditingCa(null);
            fetchCas();
        } catch (error) {
            console.error('Failed to save CA:', error);
        }
    };

    const handleDelete = async () => {
        if (!caToDelete) return;
        try {
            await caService.deleteCa(caToDelete._id);
            setDeleteModalOpened(false);
            setCaToDelete(null);
            fetchCas();
        } catch (error) {
            console.error('Failed to delete CA:', error);
        }
    };

    const toggleStatus = async (ca) => {
        try {
            const newStatus = ca.status === 'active' ? 'inactive' : 'active';
            await caService.updateStatus(ca._id, newStatus);
            fetchCas();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const openEditModal = (ca) => {
        setEditingCa(ca);
        form.setValues({
            name: ca.name,
            email: ca.email,
            password: '',
            confirmPassword: '',
        });
        setOpened(true);
    };

    const rows = cas.map((ca) => (
        <Table.Tr key={ca._id}>
            <Table.Td>
                <Text size="sm" fw={500}>
                    {ca.name}
                </Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm" c="dimmed">
                    {ca.email}
                </Text>
            </Table.Td>
            <Table.Td>
                <Badge
                    color={ca.status === 'active' ? 'green' : 'red'}
                    variant="light"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleStatus(ca)}
                >
                    {ca.status}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray" onClick={() => openEditModal(ca)}>
                        <IconEdit style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => {
                            setCaToDelete(ca);
                            setDeleteModalOpened(true);
                        }}
                    >
                        <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Box pos="relative">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

            <Group justify="space-between" mb="xl">
                <Title order={2}>CA Management</Title>
                <Button leftSection={<IconPlus size={18} />} onClick={() => {
                    setEditingCa(null);
                    form.reset();
                    setOpened(true);
                }}>
                    Add CA
                </Button>
            </Group>

            <Paper withBorder radius="md">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>

            {/* Add/Edit Modal */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={editingCa ? 'Edit CA' : 'Add New CA'}
                size="md"
            >
                <form onSubmit={form.onSubmit(handleAddEdit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="John Doe"
                            required
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Email"
                            placeholder="ca@example.com"
                            required
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            label={editingCa ? "New Password (leave blank to keep current)" : "Password"}
                            placeholder="Secure password"
                            required={!editingCa}
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm password"
                            required={!editingCa || !!form.values.password}
                            {...form.getInputProps('confirmPassword')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="light" onClick={() => setOpened(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Confirm Deletion"
                size="sm"
            >
                <Text size="sm">
                    Are you sure you want to delete <b>{caToDelete?.name}</b>? This action cannot be undone.
                </Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={() => setDeleteModalOpened(false)}>Cancel</Button>
                    <Button color="red" onClick={handleDelete}>Delete</Button>
                </Group>
            </Modal>
        </Box>
    );
}
