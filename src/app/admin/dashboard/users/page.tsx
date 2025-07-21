"use client"
import { Box, Button, Drawer, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import useUser from "@/hooks/admin/useUser";
import { User } from "@prisma/client";

export default function Page() {

    const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false);
    const [userData, setUserData] = useState<User>({
        name: '',
        email: '',
        id: '',
        image: '',
        emailVerified: null,
        password: '',
        role: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        bio: '',
    });
    const { users, addUser, deleteUser } = useUser();

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const submitAddUser = async () => {
        try {
            await addUser(userData);
            alert('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        }
    };

    return (
        <div>
            <h1>Users</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setAddUserDrawerOpen(true)}
            >
                Add User
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        component={Link}
                                        href={`/admin/users/${user.id}`}
                                        size="small"
                                    >
                                        <EditIcon />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete User
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Drawer
                anchor="right"
                open={addUserDrawerOpen}
                onClose={() => setAddUserDrawerOpen(false)}
            >
                <Box sx={{ width: 400 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6">Add User</Typography>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                        <TextField
                            label="Role"
                            variant="outlined"
                            value={userData.role}
                            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitAddUser}
                        >
                            Add User
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};
