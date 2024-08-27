import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData, CollectionReference } from 'firebase/firestore';
import { app } from '../../firebase'; 
interface FirestoreContextType {
  data: any[];
  loading: boolean;
  error: any;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
};

interface FirestoreProviderProps {
  children: ReactNode;
  collectionPath: string; 
}

export const FirestoreProvider: React.FC<FirestoreProviderProps> = ({ children, collectionPath }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const db = getFirestore(app); 

  useEffect(() => {
    const collectionRef: CollectionReference<DocumentData> = collection(db, collectionPath);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const updatedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(updatedData);
        setLoading(false);
      },
      (error: any) => {
        console.error('Error fetching data: ', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, db]);

  return (
    <FirestoreContext.Provider value={{ data, loading, error }}>
      {children}
    </FirestoreContext.Provider>
  );
};
