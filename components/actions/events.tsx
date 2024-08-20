import { doc, setDoc, getDoc, collection, getDocs ,deleteDoc, query, where} from 'firebase/firestore';
import { db } from '../../firebase';

// Save event to Firestore
export const saveEvent = async (event: any, eventId?: string) => {
  const eventRef = eventId ? doc(db, 'events', eventId) : doc(collection(db, 'events'));
  await setDoc(eventRef, event);
};

// Fetch an event from Firestore
export const fetchEvent = async (eventId: string) => {
  
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    return eventSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Fetch all events from Firestore
export const fetchAllEvents = async () => {
  const storedChurchId = localStorage.getItem('storedChurchId');
  
    if (!storedChurchId) {
      throw new Error("No stored churchId found in local storage.");
    }
  // const eventsRef = collection(db, 'events');
  const eventsSnap = await getDocs(
    query(
      collection(db, 'events'),
      where('churchId', '==', storedChurchId)
    )
  );;
  const events: any[] = [];
  eventsSnap.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
};
export const deleteEvent = async (id: string) => {
  try {
    const eventRef = doc(db, "events", id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}