import { db } from '../../firebase'; // Import your Firebase config
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const fetchEvent = async (eventId: string) => {
  const docRef = doc(db, 'events', eventId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as any) : null;
};

export const saveEvent = async (event: any, eventId?: string) => {
  const docRef = doc(db, 'events', eventId || 'new');
  return await setDoc(docRef, event, { merge: true });
};
