import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Save event to a subcollection under the church document (new collection name: "churchEvents")
export const saveEvent = async (event: any, eventId?: string) => {
  const storedChurchId = localStorage.getItem('storedChurchId');

  if (!storedChurchId) {
    throw new Error("No stored churchId found in local storage.");
  }

  // Reference to the church document (updated collection name "church")
  const churchDocRef = doc(db, 'church', storedChurchId);

  // Reference to the new collection "churchEvents" under the church document
  const eventsCollectionRef = collection(churchDocRef, 'events');

  // Use eventId if updating an existing event, otherwise create a new document
  const eventRef = eventId ? doc(eventsCollectionRef, eventId) : doc(eventsCollectionRef);

  await setDoc(eventRef, event);
  console.log("Event saved:", event);
};

// Fetch a single event from the "churchEvents" subcollection under the church document
export const fetchEvent = async (eventId: string) => {
  const storedChurchId = localStorage.getItem('storedChurchId');

  if (!storedChurchId) {
    throw new Error("No stored churchId found in local storage.");
  }

  // Reference to the church document (updated collection name "church")
  const churchDocRef = doc(db, 'church', storedChurchId);

  // Reference to the specific event document within the "churchEvents" subcollection
  const eventRef = doc(churchDocRef, 'events', eventId);
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    return eventSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Fetch all events for the specific church from the "churchEvents" subcollection
export const fetchAllEvents = async () => {
  const storedChurchId = localStorage.getItem('storedChurchId');

  if (!storedChurchId) {
    throw new Error("No stored churchId found in local storage.");
  }

  // Reference to the church document (updated collection name "church")
  const churchDocRef = doc(db, 'church', storedChurchId);

  // Reference to the new collection "churchEvents" under the church document
  const eventsCollectionRef = collection(churchDocRef, 'events');

  const eventsSnap = await getDocs(eventsCollectionRef);

  const events: any[] = [];
  eventsSnap.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  
  return events;
};

// Delete an event from the "churchEvents" subcollection under the church document
export const deleteEvent = async (id: string) => {
  try {
    const storedChurchId = localStorage.getItem('storedChurchId');

    if (!storedChurchId) {
      throw new Error("No stored churchId found in local storage.");
    }

    // Reference to the church document (updated collection name "church")
    const churchDocRef = doc(db, 'church', storedChurchId);

    // Reference to the specific event document within the "churchEvents" subcollection
    const eventRef = doc(churchDocRef, 'events', id);
    await deleteDoc(eventRef);
    console.log("Event deleted:", id);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// import { doc, setDoc, getDoc, collection, getDocs ,deleteDoc, query, where} from 'firebase/firestore';
// import { db } from '../../firebase';

// // Save event to Firestore
// export const saveEvent = async (event: any, eventId?: string) => {
//   const eventRef = eventId ? doc(db, 'events', eventId) : doc(collection(db, 'events'));
//   await setDoc(eventRef, event);
//   console.log("Passed Events:",event)
// };

// // Fetch an event from Firestore
// export const fetchEvent = async (eventId: string) => {
  
//   const eventRef = doc(db, 'events', eventId);
//   const eventSnap = await getDoc(eventRef);

//   if (eventSnap.exists()) {
//     return eventSnap.data();
//   } else {
//     console.log("No such document!");
//     return null;
//   }
// };

// // Fetch all events from Firestore
// export const fetchAllEvents = async () => {
//   const storedChurchId = localStorage.getItem('storedChurchId');
  
//     if (!storedChurchId) {
//       throw new Error("No stored churchId found in local storage.");
//     }
//   // const eventsRef = collection(db, 'events');
//   const eventsSnap = await getDocs(
//     query(
//       collection(db, 'events'),
//       where('churchId', '==', storedChurchId)
//     )
//   );;
//   const events: any[] = [];
//   eventsSnap.forEach((doc) => {
//     events.push({ id: doc.id, ...doc.data() });
//   });
//   return events;
// };
// export const deleteEvent = async (id: string) => {
//   try {
//     const eventRef = doc(db, "events", id);
//     await deleteDoc(eventRef);
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     throw error;
//   }
// }