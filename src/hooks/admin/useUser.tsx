import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const useUser = () => {
    const [users, setUsers] = useState<User[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    
    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch user');       
            setLoading(false);
        }
    };
    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUsers((prevUsers) => prevUsers?.filter((user) => user.id !== userId));  
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        }
    };

    const addUser = async (userData: User) => {
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                if (!users) {
                    setUsers([userData]);
                } else {
                    setUsers((prevUsers) => [...(prevUsers || []), userData]);
                }
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setError('Failed to add user');
        }
    };

    const updateUser = async (userData: User) => {
        try {
            const response = await fetch(`/api/user/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                setUsers((prevUsers) => prevUsers?.map((user) => user.id === userData.id ? userData : user));
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user');
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    return { users, addUser, deleteUser, updateUser, loading, error };
};

export default useUser;