import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

// Upload a file to Firebase Storage
export const uploadFile = async (file: File, filePath: string) => {
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};
