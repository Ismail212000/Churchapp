"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiX,
  FiClock,
  FiUpload,
} from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { saveEvent, fetchAllEvents } from "@/components/actions/events"; // Ensure these functions are implemented

interface AgendaItem {
  title: string;
  time: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  agenda: AgendaItem[];
  isPaidEvent: boolean;
  banner: string | null;
  repeat: boolean;
}

export default function Events() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentTab, setCurrentTab] = useState("current"); // Default to current events
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    description: "",
    date: "",
    agenda: [{ title: "", time: "" }],
    isPaidEvent: false,
    banner: null,
    repeat: false,
  });

  const formRef = useRef<HTMLDivElement>(null);

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
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventToSave = {
        ...newEvent,
        id: editingEvent ? editingEvent.id : Date.now(),
      };

      if (editingEvent) {
        await saveEvent(eventToSave, editingEvent.id.toString());
      } else {
        await saveEvent(eventToSave);
      }

      setEvents((prev) => {
        return editingEvent
          ? prev.map((event) =>
              event.id === editingEvent.id ? eventToSave : event
            )
          : [...prev, eventToSave];
      });

      setNewEvent({
        id: 0,
        title: "",
        date: "",
        description: "",
        agenda: [{ title: "", time: "" }],
        isPaidEvent: false,
        banner: null,
        repeat: false,
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving the event.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent((prev) => ({ ...prev, banner: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
              setShowForm(true);
              setEditingEvent(null);
              setNewEvent({
                id: 0,
                title: "",
                description: "",
                date: "",
                agenda: [{ title: "", time: "" }],
                isPaidEvent: false,
                banner: null,
                repeat: false,
              });
            }}
          >
            <FiPlusCircle />
            <p>Create New Event</p>
          </Button>
        </div>
      </div>

      {/* main screen */}
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-screen bg-white rounded-3xl">
        {/* active tabs */}
        <div className="flex justify-start items-center mb-4">
          <div
            className={`${
              currentTab === "current"
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
            className={`${
              currentTab === "upcoming"
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
            className={`${
              currentTab === "previous"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 justify-items-center">
        {filterEvents(events, currentTab).map((event) => (
           <Card key={event.id} className="w-full max-w-sm">
           {event.banner && (
             <img
               src={event.banner}
               alt={event.title}
               className="w-full h-40 object-cover rounded-t-lg"
             />
           )}
           <CardHeader>
             <CardTitle>{event.title}</CardTitle>
           </CardHeader>
           <CardContent>
             <p>{event.description}</p>
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
               <FiEdit className="mr-2" />
               Edit
             </Button>
             <Button
               onClick={() => handleDelete(event.id)}
               size="sm"
               variant="outline"
             >
               <FiTrash2 className="text-[#047857]" />
             </Button>
           </CardFooter>
         </Card>
          ))}
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
            <form onSubmit={handleSubmit}>
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
                <label className="block text-sm font-medium mb-1">
                  Upload Banner
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
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
