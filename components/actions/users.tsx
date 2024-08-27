"use client";
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // Import `db` from firebase configuration
import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../firebase'; 

interface FamilyMember {
  name: string;
  relationship: string;
  gender: string;
  age: string;
}

interface UserData {
  id: string;
  profilePhoto: string | null;
  familyHeadName: string;
  contact: string;
  email: string;
  password: string;
  address: string;
  members: FamilyMember[];
  [key: string]: any; 
  churchId: string; // Changed from "" to string
}

export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    const storedChurchId = localStorage.getItem('storedChurchId');
    if (!storedChurchId) {
      throw new Error("No stored churchId found in local storage.");
    }

    const querySnapshot = await getDocs(
      query(
        collection(db, 'users'),
        where('churchId', '==', storedChurchId)
      )
    );

    const users: UserData[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as UserData));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  if (!userId) throw new Error('User ID is required');

  try {
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const MyComponent: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        alert('Password updated successfully.');
      } else {
        setError('User not logged in.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <button type="submit">Change Password</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default MyComponent;
