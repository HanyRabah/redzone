import { User } from "next-auth";
import { useEffect, useState } from "react";

const useUser = () => {
    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
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
            setError('Failed to delete user');
        }
    };

    const addUser = async (userData: any) => {
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                setUsers((prevUsers) => [...prevUsers, userData]);
            }
        } catch (error) {
            setError('Failed to add user');
        }
    };

    const updateUser = async (userData: any) => {
        try {
            const response = await fetch(`/api/user/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                setUsers((prevUsers) => [...prevUsers, userData]);
            }
        } catch (error) {
            setError('Failed to update user');
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    return { users, addUser, deleteUser, updateUser, loading, error };
};

export default useUser;