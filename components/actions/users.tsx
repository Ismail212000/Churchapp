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
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../../firebase"; // Ensure to export your Firebase app configuration
//import { UserData } from "../../../types"; // Import renamed type
interface UserData {
  id: string;
  profilePhoto: string | null;
  familyHeadName: string;
  contact: string;
  email: string;
  address: string;
  memberName: string;
  relationship: string;
  gender: string;
  age: string;
}
const db = getFirestore(app);

export const saveUser = async (userData: UserData) => {
  try {
    await addDoc(collection(db, "users"), userData);
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: UserData[] = querySnapshot.docs.map(doc => ({
      id: doc.id, // Add the document ID here
      ...doc.data(),
    } as UserData));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
