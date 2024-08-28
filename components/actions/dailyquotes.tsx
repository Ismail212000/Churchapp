"use client";
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase'; // Update path as needed
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface DailyQuote {
  id: string;
  churchId: string;
  date: string;
  day: string;
  imageUrl: string;
  quote: string;
}

export const CalendarWithDailyquote: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyQuotes, setDailyQuotes] = useState<Record<string, DailyQuote>>({});
  const [quoteInput, setQuoteInput] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem("storedChurchId") || uuidv4();
    localStorage.setItem("storedChurchId", id);
    const unsubscribe = onSnapshot(collection(db, 'dailyquotes'), (snapshot) => {
      const data: Record<string, DailyQuote> = {};
      snapshot.forEach((doc) => {
        const quoteData = doc.data() as DailyQuote;
        data[quoteData.date] = { ...quoteData, id: doc.id };
      });
      setDailyQuotes(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSelectedDate(null);
        setQuoteInput('');
        setImageUrl(null);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (date: Date) => {
    const today = new Date();
    if (date < today) {
      return; // Prevent selection of past dates
    }
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    if (dailyQuotes[formattedDate]) {
      setQuoteInput(dailyQuotes[formattedDate].quote);
      setImageUrl(dailyQuotes[formattedDate].imageUrl);
      setIsEditing(true);
    } else {
      setQuoteInput('');
      setImageUrl(null);
      setIsEditing(false);
    }
  };

  const handleMonthChange = (date: Date) => {
    setSelectedMonth(date);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    const storageRef = ref(storage, `dailyquote/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const dayOfWeek = format(selectedDate, 'EEEE');
      const uploadedImageUrl = await uploadImage();
      const newImageUrl = uploadedImageUrl || imageUrl;
      const churchId = localStorage.getItem('storedChurchId') || '';
      const quoteData: DailyQuote = {
        id: dailyQuotes[formattedDate]?.id || uuidv4(),
        churchId,
        date: formattedDate,
        day: dayOfWeek,
        quote: quoteInput,
        imageUrl: newImageUrl || '',
      };
      await setDoc(doc(db, 'dailyquotes', quoteData.id), quoteData);
      setQuoteInput('');
      setImageFile(null);
      setSelectedDate(null);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      if (dailyQuotes[formattedDate]) {
        await deleteDoc(doc(db, 'dailyquotes', dailyQuotes[formattedDate].id));
        setSelectedDate(null);
        setQuoteInput('');
        setImageUrl(null);
        setIsEditing(false);
      }
    }
  };

  const renderTileContent = ({ date }: { date: Date }) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const quote = dailyQuotes[formattedDate];
    if (quote) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={quote.imageUrl} 
            alt="Daily Quote" 
            width={500}
            height={500}
            className="w-full h-full object-cover absolute top-0 left-0 opacity-50"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
            {quote.quote.substring(0, 20)}...
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center h-full w-full p-4">
      <div className="w-full h-screen max-w-4xl"> {/* Increased size */}
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          tileContent={renderTileContent}
          onActiveStartDateChange={({ activeStartDate }) => handleMonthChange(activeStartDate!)}
          className="w-full h-full border border-gray-300 rounded-lg shadow-lg"
          tileClassName={({ date }) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            return dailyQuotes[formattedDate] ? 'bg-blue-100' : null;
          }}
        />
      </div>
      
      {selectedDate && (
        <div
          ref={cardRef}
          className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-4xl"
        >
          <h3 className="text-lg font-semibold mb-2">
            {format(selectedDate, 'MMMM dd, yyyy')} - {format(selectedDate, 'EEEE')}
          </h3>
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full"
              />
            </div>
            {imageUrl && (
              <Image src={imageUrl} alt="Preview" width={500} height={500} className="mt-2 max-w-xs h-auto" />
            )}
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditing ? 'Update' : 'Save'} Quote
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Quote
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
