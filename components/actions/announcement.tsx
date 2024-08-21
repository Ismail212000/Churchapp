import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
 
// Add a new document to the 'items' collection
interface Item {
    id: string;
    name: string;
    description: string;
  }
 
  // Function to add a new item to the 'items' collection
  export const addItem = async (data: { name: string; description: string }) => {
    try {
      const docRef = await addDoc(collection(db, 'items'), data);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
 
  // Function to fetch all items from the 'items' collection
  export const getItems = async (): Promise<Item[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const items: Item[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
      }));
      return items;
    } catch (e) {
      console.error('Error getting documents: ', e);
      return [];
    }
  };
