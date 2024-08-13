
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Import `db` from firebase configuration
import { v4 as uuidv4 } from "uuid";
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
  address: string;
  members: FamilyMember[];
  [key: string]: any; // This allows for additional properties
}

// Use `db` for all Firestore operations
// export const saveUser = async (userData: UserData) => {
//   try {
//     await addDoc(collection(db, "users"), userData);
//   } catch (error) {
//     console.error("Error saving user:", error);
//     throw error;
//   }
// };

export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
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

// export const updateUser = async (userData: UserData): Promise<UserData[]> => {
//   const { id, ...data } = userData;
//   try {
//     const userDocRef = doc(db, "users", id);
//     await updateDoc(userDocRef, data);
//     return fetchUsers(); // Fetch the updated list of users
//   } catch (error) {
//     console.error("Error updating user:", error);
//     throw error;
//   }
// };
export async function saveUser(formData: any) {
  try {
    const usersCollection = collection(db, 'users'); // Replace 'users' with your collection name
    const userDoc = doc(usersCollection, formData.id);

    if (!formData.id) {
      // If no ID, create a new document
      formData.id = uuidv4();
      await updateDoc(userDoc, formData);
    } else {
      // Check if the document exists
      const docSnapshot = await getDoc(userDoc);

      if (docSnapshot.exists()) {
        // If document exists, update it
        await updateDoc(userDoc, formData);
      } else {
        // If document does not exist, create it
        await setDoc(userDoc, formData);
      }
    }
    console.log('User saved successfully');
  } catch (error) {
    console.error('Error saving user:', error);
  }
}
// import { storage, db } from '../../firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { collection, doc, setDoc } from 'firebase/firestore';

// export const uploadImage = async (file: File | null, folderName: string): Promise<string | null> => {
//     if (!file) return null;
  
//     try {
//       const fileRef = ref(storage, `${folderName}/${Date.now()}`);
//       const uploadTask = await uploadBytes(fileRef, file);
//       const downloadUrl = await getDownloadURL(uploadTask.ref);
//       return downloadUrl;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return null;
//     }
//   };

// export const addUser = async (userData: any) => {
//   const userRef = doc(collection(db, 'users'));
//   await setDoc(userRef, userData);
// };
// src/components/actions/users.ts

// actions/users.ts
// components/actions/users.tsx
