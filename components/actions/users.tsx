
import {  collection, getDocs, doc, deleteDoc, query, where} from "firebase/firestore";
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
  churchId: ""
}


export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    // Retrieve the stored churchId from local storage
    const storedChurchId = localStorage.getItem('storedChurchId');
  
    if (!storedChurchId) {
      throw new Error("No stored churchId found in local storage.");
    }
  
    // Query the 'users' collection where 'churchId' matches the storedChurchId
    const querySnapshot = await getDocs(
      query(
        collection(db, 'users'),
        where('churchId', '==', storedChurchId)
      )
    );
  
    // Map the querySnapshot to UserData[]
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

