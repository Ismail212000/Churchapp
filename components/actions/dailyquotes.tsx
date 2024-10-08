
// import React, { useState, useEffect } from 'react';
// import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
// import { format } from 'date-fns';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
// import getDay from 'date-fns/getDay';
// import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
// import { db, storage } from '../../firebase'; // Update path as needed
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Image from 'next/image';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const locales = {
//   'en-US': require('date-fns/locale/en-US'),
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// interface DailyQuote {
//   id: string;
//   churchId: string;
//   date: string;
//   day: string;
//   imageUrl: string;
//   quote: string;
// }

// export const CalendarWithDailyquote: React.FC = () => {
//   const [date, setDate] = useState<Date>(new Date());
//   const [dailyQuotes, setDailyQuotes] = useState<Record<string, DailyQuote>>({});
//   const [quoteInput, setQuoteInput] = useState<string>('');
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);

//   useEffect(() => {
//     const churchId = localStorage.getItem("storedChurchId") || uuidv4();
//     localStorage.setItem("storedChurchId", churchId);

//     const unsubscribe = onSnapshot(collection(db, 'dailyquotes'), (snapshot) => {
//       const data: Record<string, DailyQuote> = {};
//       snapshot.forEach((doc) => {
//         const quoteData = doc.data() as DailyQuote;
//         data[quoteData.date] = { ...quoteData, id: doc.id };
//       });
//       setDailyQuotes(data);
//     });
    

//     return () => unsubscribe();
//   }, []);

//   const handleNavigate = (newDate: Date) => {
//     setDate(newDate);
//   };

//   const handleSelectSlot = ({ start }: { start: Date }) => {
//     //@ts-ignore
//     const formattedDate = format(start, 'yyyy-MM-dd');
//     setSelectedDate(start);
//     if (dailyQuotes[formattedDate]) {
//       setQuoteInput(dailyQuotes[formattedDate].quote);
//       setImageUrl(dailyQuotes[formattedDate].imageUrl);
//       setIsEditing(true);
//     } else {
//       setQuoteInput('');
//       setImageUrl(null);
//       setIsEditing(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   const uploadImage = async (): Promise<string> => {
//     if (!imageFile) return '';
//     const storageRef = ref(storage, `dailyquote/${imageFile.name}`);
//     await uploadBytes(storageRef, imageFile);
//     return getDownloadURL(storageRef);
//   };

//   const handleQuoteSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (selectedDate) {
//         const formattedDate = format(selectedDate, 'yyyy-MM-dd');
//         const dayOfWeek = format(selectedDate, 'EEEE');
//         const uploadedImageUrl = await uploadImage();
//         const newImageUrl = uploadedImageUrl || imageUrl;
//         const churchId = localStorage.getItem('storedChurchId') || '';
  
//         const quoteData: DailyQuote = {
//           id: dailyQuotes[formattedDate]?.id || uuidv4(),
//           churchId,
//           date: formattedDate,
//           day: dayOfWeek,
//           quote: quoteInput,
//           imageUrl: newImageUrl || '',
//         };
  
//         await setDoc(doc(db, 'dailyquotes', quoteData.id), quoteData);
//         setQuoteInput('');
//         setImageFile(null);
//         setSelectedDate(null);
//         setIsEditing(false);
//       }
//     } catch (error) {
//       console.error("Error submitting quote: ", error);
//     }
//   };
  

//   const handleDelete = async () => {
//     if (selectedDate) {
//       const formattedDate = format(selectedDate, 'yyyy-MM-dd');
//       if (dailyQuotes[formattedDate]) {
//         await deleteDoc(doc(db, 'dailyquotes', dailyQuotes[formattedDate].id));
//         setSelectedDate(null);
//         setQuoteInput('');
//         setImageUrl(null);
//         setIsEditing(false);
//       }
//     }
//   };

//   // Convert dailyQuotes into events for the calendar
//   const events = Object.values(dailyQuotes).map((quote) => ({
//     title: quote.quote,
//     start: new Date(quote.date),
//     end: new Date(quote.date),
//     allDay: true,
//   }));

//   const dayStyleGetter = (date: Date) => {
//     const formattedDate = format(date, 'yyyy-MM-dd');
//     const imageUrl = dailyQuotes[formattedDate]?.imageUrl;
//     return {
//       backgroundColor: imageUrl ? 'transparent' : '#fff', // Default color if no image
//       backgroundImage: imageUrl ? `url(${imageUrl})` : '#fff',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     };
//   };

  
//   return (
//     <div className="w-full lg:w-1/2 p-4 mx-auto">

//       <h1 className="font-bold text-2xl text-20 text-start text-[#3A3A3A]">Daily Quotes</h1>
//       <p className='text-[#9898A3] mb-3'>View all status from the dashbaord</p>
//       <div style={{ height: '600px' }}>
//         <BigCalendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 500 }}
//           onNavigate={handleNavigate}
//           onSelectSlot={handleSelectSlot}
//           date={date}
//           views={['month']}
//           selectable
//           dayPropGetter={(date) => ({ style: dayStyleGetter(date) })}
//         />
//       </div>

//       {/* Dialog for adding/editing quotes */}
//       {selectedDate && (
//         <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit Quote</DialogTitle>
//               <DialogDescription>
//                 Edit or add your daily quote and image for {format(selectedDate, 'MMMM dd, yyyy')} - {format(selectedDate, 'EEEE')} .
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleQuoteSubmit}>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="quoteImage" className="block text-sm font-medium text-gray-700">Image</Label>
//                   <Input
//                     type="file"
//                     id="quoteImage"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="mt-1 block w-full"
//                   />
//                 </div>
//                 {imageUrl && (
//                   <Image src={imageUrl} alt="Preview" width={500} height={500} className="mt-2 w-40 h-40 max-w-xs" />
//                 )}
//                 <div>
//                   <Label htmlFor="quoteText" className="block text-sm font-medium text-gray-700">Quote</Label>
//                   <textarea
//                     id="quoteText"
//                     value={quoteInput}
//                     onChange={(e) => setQuoteInput(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                     rows={3}
//                   />
//                 </div>
//               </div>
//               <DialogFooter className='mt-3'>
//                 <Button type="submit">Save Quote</Button>
//                 {isEditing && (
//                   <Button type="button" onClick={handleDelete} variant="destructive">
//                     Delete Quote
//                   </Button>
//                 )}
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, subDays } from 'date-fns';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase'; // Update path as needed
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      deleteOldQuotes(data);

      const today = new Date();
      const formattedToday = format(today, 'yyyy-MM-dd');
      if (data[formattedToday]) {
        setSelectedDate(today);
        setQuoteInput(data[formattedToday].quote);
        setImageUrl(data[formattedToday].imageUrl);
        setIsEditing(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const deleteOldQuotes = async (quotes: Record<string, DailyQuote>) => {
    const today = new Date();
    const oneWeekAgo = subDays(today, 7);
    const formattedOneWeekAgo = format(oneWeekAgo, 'yyyy-MM-dd');

    for (const date in quotes) {
      if (date < formattedOneWeekAgo) {
        await deleteDoc(doc(db, 'dailyquotes', quotes[date].id));
      }
    }
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      return;
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-2 text-xs text-center">
            {quote.quote}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        tileContent={renderTileContent}
        onActiveStartDateChange={({ activeStartDate }) =>
          handleMonthChange(activeStartDate as Date)
        }
      />
      {selectedDate && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogTrigger asChild>
            <div></div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Quote</DialogTitle>
              <DialogDescription>
                Edit or add your daily quote and image for {format(selectedDate, 'MMMM dd, yyyy')} - {format(selectedDate, 'EEEE')}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleQuoteSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quoteImage" className="block text-sm font-medium text-gray-700">Image</Label>
                  <Input
                    type="file"
                    id="quoteImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full"
                  />
                </div>
                {imageUrl && (
                  <Image src={imageUrl} alt="Preview" width={500} height={500} className="mt-2 w-40 h-40 max-w-xs " />
                )}
                {/* <div>
                  <Label htmlFor="quoteText" className="block text-sm font-medium text-gray-700">Quote</Label>
                  <textarea
                    id="quoteText"
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div> */}
              </div>
              <DialogFooter className='mt-3'>
                <Button type="submit">Save Quote</Button>
                {isEditing && (
                  <Button type="button" onClick={handleDelete} variant="destructive">
                    Delete Quote
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
