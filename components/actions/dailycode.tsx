"use client";
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameMonth } from 'date-fns';
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Update path as needed

// Define the type for the daily code storage
export interface DailyCode {
  [key: string]: {
    churchId: string;
    date: string;
    day: string;
    code: string;
  };
}

export const CalendarWithDailyCode: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyCode, setDailyCode] = useState<DailyCode>({});
  const [codeInput, setCodeInput] = useState<string>('');
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date()); // New state for tracking selected month

  // Retrieve churchId from local storage
  useEffect(() => {
    const id = localStorage.getItem("storedChurchId");
    if (id) {
      fetchDailyCodes(id);
    }
  }, []);

  // Fetch daily codes from Firestore
  const fetchDailyCodes = async (churchId: string) => {
    try {
      const snapshot = await getDocs(collection(db, 'dailyCodes'));
      const data: DailyCode = {};
      snapshot.forEach((doc) => {
        const { churchId, date, day, code } = doc.data() as { churchId: string; date: string; day: string; code: string };
        data[doc.id] = { churchId, date, day, code };
      });
      setDailyCode(data);
    } catch (error) {
      console.error('Error fetching daily codes:', error);
    }
  };

  // Save daily code to Firestore
  const saveDailyCode = async (date: string, day: string, code: string) => {
    try {
      const churchId = localStorage.getItem('storedChurchId') || ''; // Ensure churchId is obtained
      const docRef = await addDoc(collection(db, 'dailyCodes'), { churchId, date, day, code });
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error saving daily code:', error);
    }
  };

  // Delete daily code from Firestore
  const deleteDailyCode = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'dailyCodes', id));
    } catch (error) {
      console.error('Error deleting daily code:', error);
    }
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (date > new Date()) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setSelectedDate(date);
      setCodeInput(dailyCode[formattedDate]?.code || '');
    }
  };

  // Handle month change
  const handleMonthChange = (date: Date) => {
    setSelectedMonth(date);
  };

  // Handle the submission of the daily code
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const dayOfWeek = format(selectedDate, 'EEEE');
      saveDailyCode(formattedDate, dayOfWeek, codeInput);
      setDailyCode((prev) => ({
        ...prev,
        [formattedDate]: { churchId: localStorage.getItem('storedChurchId') || '', date: formattedDate, day: dayOfWeek, code: codeInput }
      }));
      setCodeInput(''); // Clear input after submission
      setSelectedDate(null); // Clear selection after saving
    }
  };

  // Handle code deletion
  const handleDelete = (id: string) => {
    deleteDailyCode(id);
    const updatedCodes = { ...dailyCode };
    delete updatedCodes[id];
    setDailyCode(updatedCodes);
    if (selectedCodeId === id) {
      setSelectedDate(null);
      setCodeInput('');
      setSelectedCodeId(null);
    }
  };

  // Set up real-time listener for daily codes
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dailyCodes'), (snapshot) => {
      const data: DailyCode = {};
      snapshot.forEach((doc) => {
        const { churchId, date, day, code } = doc.data() as { churchId: string; date: string; day: string; code: string };
        data[doc.id] = { churchId, date, day, code };
      });
      setDailyCode(data);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // Render content inside each calendar tile
  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    if (view === 'month' && dailyCode[formattedDate]) {
      return <div className="text-sm text-blue-600">{dailyCode[formattedDate].code}</div>;
    }
    return null;
  };

  // Filter daily codes by selected month
  const filteredDailyCodes = Object.entries(dailyCode).filter(([id, { date }]) =>
    isSameMonth(new Date(date), selectedMonth)
  );

  return (
    <div className="flex flex-col items-center h-auto w-full">
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        tileContent={renderTileContent}
        onActiveStartDateChange={({ activeStartDate }) => handleMonthChange(activeStartDate!)}
        className="p-2 border border-gray-300 rounded-lg w-full h-auto"
      />
      {selectedDate && (
        <form onSubmit={handleCodeSubmit} className="mt-4">
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Enter daily code"
              className="px-4 py-2 border rounded-md text-sm focus:outline-none"
            />
            <div className="flex space-x-4 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Save Code
              </button>
              <button
                type="button"
                onClick={() => selectedCodeId && handleDelete(selectedCodeId)}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Delete Code
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="mt-6 w-full ">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              {/* <th className="border border-gray-300 px-4 py-2">Church ID</th> */}
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Day</th>
              <th className="border border-gray-300 px-4 py-2">Code</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDailyCodes
              .sort(([aId], [bId]) => aId.localeCompare(bId))
              .map(([id, { date, day, code }]) => (
                <tr key={id}>
                  {/* <td className="border border-gray-300 px-4 py-2">{churchId}</td> */}
                  <td className="border border-gray-300 px-4 py-2">{date}</td>
                  <td className="border border-gray-300 px-4 py-2">{day}</td>
                  <td className="border border-gray-300 px-4 py-2">{code}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedDate(new Date(date)); // Assuming `date` is in a valid format
                        setCodeInput(code);
                        setSelectedCodeId(id);
                      }}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
