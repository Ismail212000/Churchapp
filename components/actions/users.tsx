import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

export const uploadImage = async (file: File | null, folderName: string): Promise<string | null> => {
    if (!file) return null;
  
    try {
      const fileRef = ref(storage, `${folderName}/${Date.now()}`);
      const uploadTask = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

export const addUser = async (userData: any) => {
  const userRef = doc(collection(db, 'users'));
  await setDoc(userRef, userData);
};
