"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {FiPlusCircle,FiEdit,FiTrash2,FiX,FiClock,FiUpload,} from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import {toast} from 'sonner'
import { Switch } from "@/components/ui/switch";
import {Card,CardHeader,CardContent,CardFooter,CardTitle,} from "@/components/ui/card";
import { saveEvent, fetchAllEvents, deleteEvent } from "@/components/actions/events";
import Image from "next/image";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, deleteDoc, updateDoc, collection, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface AgendaItem {
  title: string;
  time: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  agenda: AgendaItem[];
  isPaidEvent: boolean;
  banner: string | null;
  repeat: boolean;
  churchId?: string;
}


export default function Events() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("current");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    description: "",
    date: "",
    agenda: [{ title: "", time: "" }],
    isPaidEvent: false,
    banner: null,
    repeat: false,
    churchId: "",
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await fetchAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events.");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
        setEditingEvent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Destructure newEvent properties
    const { title, date, description, agenda, isPaidEvent, banner, repeat } = newEvent;
      const churchId = localStorage.getItem("storedChurchId");
  
    // Validate required fields
    if (!title || !description || !banner || !churchId) {
      toast.error("Please complete all required fields.");
      setLoading(false);
      return;
    }
  
    try {
      // Prepare the event object to save
      const eventToSave = {
        ...newEvent,
        id: editingEvent ? editingEvent.id : uuidv4(), // Use existing ID or generate new
        churchId: churchId || "",
        updatedAt: new Date().toISOString(),
      };
  
      // Reference to the church document and events subcollection
      const churchDocRef = doc(db, 'church', churchId);
      const eventsCollectionRef = collection(churchDocRef, 'events');
      const eventRef = doc(eventsCollectionRef, eventToSave.id);
  
      // Save or update the event in Firestore
      await setDoc(eventRef, eventToSave, { merge: true });
  
      // Update local state
      setEvents((prev) => {
        const updatedEvents = editingEvent
          ? prev.map((event) => (event.id === editingEvent.id ? eventToSave : event))
          : [...prev, eventToSave];
        return updatedEvents;
      });
  
      // Reset form and state
      setNewEvent({
        id: "",
              title: "",
              date: "",
              description: "",
              agenda: [{ title: "", time: "" }],
              isPaidEvent: false,
              banner: null,
              repeat: false,
              churchId: "",
      });
      setShowForm(false);
      setEditingEvent(null);
  
      toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error("Error saving event:", error);
      setError("An error occurred while saving the event.");
    } finally {
      setLoading(false);
    }
  };
// Function to handle editing an existing event
const handleEdit = (event: any) => {
  setEditingEvent(event); // Set the event being edited
  setNewEvent({
    id: event.id,
    title: event.title,
    date:event.date,
    description: event.description,
    agenda: event.agenda, 
    banner: event.banner,
    isPaidEvent: event.isPaidEvent,
    repeat: event.repeat,
  });
  setShowForm(true); // Show the form for editing
};
// Function to handle delete button click
const handleDeleteClick = (id: string) => {
  setSelectedEventId(id); // Store the ID of the selected event for deletion
  setIsPopupOpen(true); // Show confirmation popup
};

// Function to confirm event deletion
const handleConfirmDelete = async () => {
  if (selectedEventId) {
    try {
      const churchId = localStorage.getItem("storedChurchId");
      if (!churchId) {
        throw new Error("Church ID is missing.");
      }

      // Reference to the event document
      const churchDocRef = doc(db, 'church', churchId);
      const eventsCollectionRef = collection(churchDocRef, 'events');
      const eventRef = doc(eventsCollectionRef, selectedEventId);

      // Delete event from the database
      await deleteDoc(eventRef);

      // Update local state
      setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));

      // Reset popup and selected event state
      setIsPopupOpen(false);
      setSelectedEventId(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("An error occurred while deleting the event.");
    }
  }
};
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  
  //   console.log("Starting handleSubmit function");
  
  //   const { title, date, description, agenda, isPaidEvent, banner, repeat } = newEvent;
  //   const churchId = localStorage.getItem("storedChurchId");
  
  //   console.log("Gathered form data:", { title, date, description, agenda, churchId });
  
  //   // Check if required fields are filled
  //   if (!title || !date || !description || !churchId || agenda.some(ag => !ag.title || !ag.time)) {
  //     console.log("Missing required fields");
  //     alert("Please complete all required fields.");
  //     setLoading(false);
  //     return;
  //   }
  
  //   try {
  //     console.log("Preparing eventToSave object");
  //     const eventToSave = {
  //       ...newEvent,
  //       // Use existing ID if editing, otherwise generate a new one
  //       id: editingEvent ? editingEvent.id : uuidv4(),
  //       churchId: churchId || "",
  //     };
  //     console.log("eventToSave prepared:", eventToSave);
  
  //     if (!churchId) {
  //       console.error("Church ID is missing");
  //       throw new Error("Church ID is missing.");
  //     }
  
  //     console.log("Creating database references");
  //     const churchDocRef = doc(db, 'church', churchId);
  //     const eventsCollectionRef = collection(churchDocRef, 'events');
  //     const eventRef = doc(eventsCollectionRef, eventToSave.id);
  
  //     console.log("Database references created:", { churchDocRef, eventsCollectionRef, eventRef });
  
  //     console.log(`Attempting to ${editingEvent ? 'update' : 'create'} event`);
  //     await setDoc(eventRef, {
  //       ...eventToSave,
  //       updatedAt: new Date().toISOString()
  //     }, { merge: true });
  
  //     console.log(`Event ${editingEvent ? 'updated' : 'created'} successfully:`, eventToSave);
  
  //     // Update local state
  //     setEvents((prev) => {
  //       const updatedEvents = editingEvent
  //         ? prev.map((event) => (event.id === editingEvent.id ? eventToSave : event))
  //         : [...prev, eventToSave];
  //       console.log("Updated events state:", updatedEvents);
  //       return updatedEvents;
  //     });
  
  //     // Reset the form
  //     setNewEvent({
  //       id: "",
  //       title: "",
  //       date: "",
  //       description: "",
  //       agenda: [{ title: "", time: "" }],
  //       isPaidEvent: false,
  //       banner: null,
  //       repeat: false,
  //       churchId: "",
  //     });
  //     setShowForm(false);
  //     setEditingEvent(null);
  
  //     console.log("Form reset and state updated");
  
  //     alert(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
  //   } catch (error: unknown) {
  //     console.error("Error in handleSubmit:", error);
  //     if (error instanceof Error) {
  //       alert(`An error occurred: ${error.message}`);
  //       setError(`An error occurred: ${error.message}`);
  //     } else {
  //       alert("An unknown error occurred");
  //       setError("An unknown error occurred");
  //     }
  //   } finally {
  //     setLoading(false);
  //     console.log("handleSubmit function completed");
  //   }
  // };

  // // Function to handle editing an existing event
  // const handleEdit = (event: Event) => {
  //   setEditingEvent(event); // Set the event being edited
  //   setNewEvent(event); // Populate the form with event data
  //   setShowForm(true); // Show the form for editing
  // };

  // // Function to handle delete button click
  // const handleDeleteClick = (id: string) => {
  //   setSelectedEventId(id); // Store the ID of the selected event for deletion
  //   setIsPopupOpen(true); // Show confirmation popup
  // };

  // // Function to confirm event deletion
  // const handleConfirmDelete = async () => {
  //   if (selectedEventId) {
  //     try {
  //       // Ensure churchId is valid and not null
  //       const churchId = localStorage.getItem("storedChurchId");
  //       if (!churchId) {
  //         throw new Error("Church ID is missing.");
  //       }

  //       // Reference to the event document
  //       const churchDocRef = doc(db, 'church', churchId);
  //       const eventsCollectionRef = collection(churchDocRef, 'events');
  //       const eventRef = doc(eventsCollectionRef, selectedEventId);

  //       // Delete event from the database
  //       await deleteDoc(eventRef);

  //       // Remove the event from the local state
  //       setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));

  //       // Reset popup and selected event state
  //       setIsPopupOpen(false);
  //       setSelectedEventId(null);
  //     } catch (err) {
  //       console.error("Error deleting event:", err);
  //       setError("An error occurred while deleting the event.");
  //     }
  //   }
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgendaChange = (
    index: number,
    field: "title" | "time",
    value: string
  ) => {
    setNewEvent((prev) => {
      const newAgenda = [...prev.agenda];
      newAgenda[index] = { ...newAgenda[index], [field]: value };
      return { ...prev, agenda: newAgenda };
    });
  };

  const addAgendaItem = () => {
    setNewEvent((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { title: "", time: "" }],
    }));
  };

  const handleSwitchChange = (
    checked: boolean,
    field: "isPaidEvent" | "repeat"
  ) => {
    setNewEvent((prev) => ({ ...prev, [field]: checked }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Get a reference to the storage service and a reference to the file path
      const storage = getStorage();
      const storageRef = ref(storage, `event/${file.name}`);

      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optionally, you can handle the upload progress here
          console.log(`Upload is ${Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Update form data with the download URL of the profile photo
            setNewEvent((prev) => ({
              ...prev,
              banner: downloadURL,
            }));
          });
        }
      );
    }
  };

  // // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  // //   const file = event.target.files?.[0];
  // //   if (file) {
  // //     // Validate file type
  // //     if (!file.type.startsWith("image/")) {
  // //       setError("Only image files are allowed.");
  // //       return;
  // //     }

  // //     setError(null);
  // //     // Handle the image file (e.g., upload to server or preview)
  // //     console.log("Selected file:", file);
  // //   }
  // // };


  const isCurrentEvent = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj.toDateString() === today.toDateString();
  };

  const isUpcomingEvent = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj > today;
  };

  const isPreviousEvent = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj < today;
  };

  const filterEvents = (events: Event[], currentTab: string) => {
    switch (currentTab) {
      case "current":
        return events.filter((event) => isCurrentEvent(event.date));
      case "upcoming":
        return events.filter((event) => isUpcomingEvent(event.date));
      case "previous":
        return events.filter((event) => isPreviousEvent(event.date));
      default:
        return events;
    }
  };
  console.log("new Events:", newEvent)



  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const handleSeeMore = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <>
      {/* event header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl">Events</h1>
          <p className="text-[#9898A3] text-xs">View all church events here</p>
        </div>

        <div>
          <Button
            className="bg-[#280559] text-white flex gap-2"
            onClick={() => {
              const storedChurchId = localStorage.getItem('storedChurchId') || "";
              setShowForm(true);
              setEditingEvent(null);
              setNewEvent({
                id: "",
                title: "",
                description: "",
                date: "",
                agenda: [{ title: "", time: "" }],
                isPaidEvent: false,
                banner: null,
                repeat: false,
                churchId: storedChurchId
              });
            }}
          >
            <FiPlusCircle />
            <p>Create New Event</p>
          </Button>
        </div>
      </div>

      {/* main screen */}
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-[90%] bg-white rounded-3xl">
        {/* active tabs */}
        <div className="flex justify-start items-center mb-4">
          <div
            className={`${currentTab === "current"
              ? "border-b-2 text-[#280559] border-[#280559]"
              : "text-[#92929D]"
              } transition-all ease-in-out duration-500`}
            onClick={() => setCurrentTab("current")}
          >
            <p className="sm:px-4 lg:px-8 sm:text-base lg:text-md font-bold cursor-pointer mt-10">
              Current
            </p>
          </div>

          <div
            className={`${currentTab === "upcoming"
              ? "border-b-2 rounded text-[#280559] border-[#280559]"
              : " text-[#92929D]"
              }  transition-all ease-in-out duration-500 ml-4`}
            onClick={() => setCurrentTab("upcoming")}
          >
            <p className="sm:px-4 lg:px-8 sm:text-base lg:text-md font-bold cursor-pointer mt-10">
              Upcoming
            </p>
          </div>

          <div
            className={`${currentTab === "previous"
              ? "border-b-2 rounded text-[#280559] border-[#280559]"
              : "text-[#92929D]"
              } transition-all ease-in-out duration-500 ml-4`}
            onClick={() => setCurrentTab("previous")}
          >
            <p className="sm:px-4 lg:px-8 sm:text-base lg:text-md font-bold cursor-pointer mt-10">
              Previous
            </p>
          </div>
        </div>
        {/* Event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 justify-items-center">
          {filterEvents(events, currentTab).map((event) => {
            const isExpanded = expandedEventId === event.id;

            const handleClosePopup = () => {
              setIsPopupOpen(false);
              setSelectedEventId(null);
            };

            return (
              <Card key={event.id} className="w-full max-w-xs">
                {event.banner && (
                  <div className="w-full h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}


                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {isExpanded ? event.description : `${event.description.slice(0, 50)}...`}
                  </p>
                  {event.description.length > 50 && (
                    <button
                      onClick={() => handleSeeMore(event.id)}
                      className="text-blue-600 underline mt-2"
                    >
                      {isExpanded ? 'See Less' : 'See More'}
                    </button>
                  )}
                  {event.isPaidEvent && (
                    <p className="mt-2 text-green-600">Paid Event</p>
                  )}
                  {event.repeat && (
                    <p className="mt-2 text-blue-600">Repeating Event</p>
                  )}
                </CardContent>
                <CardFooter className="justify-center gap-2">
                  <Button
                    onClick={() => handleEdit(event)}
                    size="sm"
                    variant="outline"
                    className="bg-[#047857] text-white"
                  >
                    Edit
                  </Button>
                  <div>
                    <Button
                      onClick={() => handleDeleteClick(event.id)}
                      size="sm"
                      variant="outline"
                    >
                      <FiTrash2 className="text-[#047857]" />
                    </Button>
                    {isPopupOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                          <div className="text-lg font-semibold mb-4">
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18em" height="3em" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1" />
                              </svg>
                            </div>
                            <p className="text-gray-400 font-normal">Are you sure you want to Delete now?</p>
                          </div>
                          <div className="flex justify-center space-x-4">
                            <button
                              onClick={handleClosePopup}
                              className="bg-[#23D81E] text-gray-700 px-4 py-2 rounded hover:bg-green-700">
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirmDelete}
                              className="bg-black text-white px-4 py-2 rounded hover:bg-black">
                              Yes, Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>



        {/* Side form */}
        {showForm && (
          <div
            ref={formRef}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white p-4 md:p-6 shadow-lg overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Create an Event</h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <FiX />
              </Button>
            </div>
           
            <form  onSubmit={handleSubmit}  >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Name of event"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Details about event"
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Agenda</label>
                {newEvent.agenda.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-2 mb-2"
                  >
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleAgendaChange(index, "title", e.target.value)
                      }
                      placeholder="Title"
                      className="w-full md:w-1/2 p-2 border rounded"
                    />
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) =>
                        handleAgendaChange(index, "time", e.target.value)
                      }
                      className="w-full md:w-1/2 p-2 border rounded"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addAgendaItem}
                  variant="outline"
                  size="sm"
                >
                  <FiPlusCircle className="mr-2" /> Add Agenda Item
                </Button>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Paid Event</span>
                <Switch
                  checked={newEvent.isPaidEvent}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "isPaidEvent")
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Upload Banner</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <div>
    <input
      type="file"
      id="events"
      accept="image/*"
      onChange={handleFileUpload}
      className="hidden"
    />
    
    {/* Image preview */}
   
  </div>
                  </label>
                </div>
                {newEvent.banner && (
      <Image
        src={newEvent.banner}
        alt="Event Banner Preview"
        width={1200}
        height={1200}
        className="w-32 h-32 mt-2 p-2 object-cover mb-2"
      />
    )}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Repeat</span>
                <Switch
                  checked={newEvent.repeat}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "repeat")
                  }
                />
              </div>
              <Button type="submit" className="w-full bg-[#280559] text-white">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}