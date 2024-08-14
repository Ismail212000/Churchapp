
import {  collection, getDocs, doc, deleteDoc} from "firebase/firestore";
import { db } from "../../firebase"; // Import `db` from firebase configuration


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
  password:string;
  address: string;
  members: FamilyMember[];
  [key: string]: any; 
}


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

