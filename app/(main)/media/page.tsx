"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {  FiEdit, FiTrash2, FiX, } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import {  Card, CardHeader, CardContent, CardFooter, CardTitle,} from "@/components/ui/card";
import {  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose,} from "@/components/ui/dialog";
import Image from "next/image";
import AddMedia from "@/components/actions/media";
interface AgendaItem {
  title: string;
  time: string;
}

interface media {
  id: number;
  title: string;
  description: string;
  date: string;
  agenda: AgendaItem[];
  isPaidEvent: boolean;
  banner: string | null;
  repeat: boolean;
  type: string; 
}

export default function media() {
  const [showForm, setShowForm] = useState(false);
  const [media, setmedia] = useState<media[]>([]);
  const [editingmedia, setEditingmedia] = useState<media | null>(null);
  const [currentTab, setCurrentTab] = useState("current"); // Default to current events
  const [mediaToDelete, setmediaToDelete] = useState<media | null>(null);
  const [newmedia, setNewmedia] = useState<media>({
    id: 0,
    title: "",
    description: "",
    date: "",
    agenda: [{ title: "", time: "" }],
    isPaidEvent: false,
    banner: null,
    repeat: false,
    type: "Video",
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
        setEditingmedia(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const defaultNewmedia = {
      id: Date.now(),
      title: "",
      date: "",
      description: "",
      agenda: [] as AgendaItem[], // Initializing as an empty array
      isPaidEvent: false,
      banner: "",
      repeat: false,
      type: currentTab,  
    };

    const mediaToSave = { ...defaultNewmedia, ...newmedia };

    if (editingmedia) {
      setmedia((prev) =>
        prev.map((item) => (item.id === editingmedia.id ? mediaToSave : item))
      );
    } else {
      setmedia((prev) => [...prev, mediaToSave]);
    }

    setNewmedia({
      id: 0,
      title: "",
      date: "",
      description: "",
      agenda: [] as AgendaItem[], // Resetting to an empty array
      isPaidEvent: false,
      banner: "",
      repeat: false,
      type: currentTab,  
    });

    setShowForm(false);
    setEditingmedia(null);
  };

  const handleEdit = (item: media) => {
    setEditingmedia(item);
    setNewmedia(item);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setmedia((prev) => prev.filter((item) => item.id !== id));
    setmediaToDelete(null); // Close the dialog after deletion
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewmedia((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgendaChange = (
    index: number,
    field: "title" | "time",
    value: string
  ) => {
    setNewmedia((prev) => {
      const newAgenda = [...prev.agenda];
      newAgenda[index] = { ...newAgenda[index], [field]: value };
      return { ...prev, agenda: newAgenda };
    });
  };

  const addAgendaItem = () => {
    setNewmedia((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { title: "", time: "" }],
    }));
  };

  const handleSwitchChange = (
    checked: boolean,
    field: "isPaidEvent" | "repeat"
  ) => {
    setNewmedia((prev) => ({ ...prev, [field]: checked }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewmedia((prev) => ({ ...prev, banner: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
//   const filteredMedia = mediaItems.filter(
//     (item) => item.type.toLowerCase() === currentTab.toLowerCase()
//   );

  return (
    <>
      {/* media header */}
      <div className="flex justify-between items-center mb-5 ">
        <div>
          <h1 className="text-[#280559] font-bold text-xl sm:text-lg">media</h1>
          <p className="text-[#9898A3] text-xs">View all media here</p>
        </div>
      </div>

      {/* main screen */}
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-[90%] bg-white rounded-3xl">
        {/* active tabs */}
        <AddMedia 
        className="text-white flex gap-2"
        onClick={() => {
          setShowForm(true);
          setEditingmedia(null);
          setNewmedia({
            id: 0,
            title: "",
            description: "",
            date: "",
            agenda: [{ title: "", time: "" }],
            isPaidEvent: false,
            banner: null,
            repeat: false,
            type: currentTab,
          });
        }}
        />
      
        {/* media cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 justify-items-center">
          {media.map((item) => (
            <Card key={item.id} className="w-full max-w-sm">
              {item.banner && (
                <Image
                  src={item.banner}
                  alt={item.title}
                  width={50}
                  height={40}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <CardTitle className="text-sm md:text-base lg:text-lg">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm md:text-base">
                <p>{item.description}</p>
                {item.isPaidEvent && (
                  <p className="mt-2 text-green-600">Paid Event</p>
                )}
                {item.repeat && (
                  <p className="mt-2 text-blue-600">Repeating Event</p>
                )}
              </CardContent>
              <CardFooter className="justify-center gap-2">
                <Button
                  onClick={() => handleEdit(item)}
                  size="sm"
                  variant="outline"
                  className="bg-[#047857] text-white"
                >
                  <FiEdit className="mr-2" />
                  Edit
                </Button>
                {/* Delete Button with Confirmation Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <FiTrash2 className="text-[#047857]" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white"
                      >
                        Yes
                      </Button>
                      <DialogClose asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-500"
                        >
                          No
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Side form */}
        {showForm && (
          <div
            ref={formRef}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white p-4 md:p-6 shadow-lg overflow-y-auto z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Create =tries</h2>
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
                  value={newmedia.title}
                  onChange={handleInputChange}
                  placeholder="Name of media"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newmedia.description}
                  onChange={handleInputChange}
                  placeholder="Description of media"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newmedia.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Agenda</label>
                {newmedia.agenda.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleAgendaChange(index, "title", e.target.value)
                      }
                      placeholder="Agenda item"
                      className="w-1/2 p-2 border rounded"
                    />
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) =>
                        handleAgendaChange(index, "time", e.target.value)
                      }
                      className="w-1/2 p-2 border rounded"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addAgendaItem}
                  className="mt-2 bg-blue-500 text-white"
                >
                  Add Agenda Item
                </Button>
              </div>
              <div className="mb-4 flex gap-2 items-center">
                <Switch
                  checked={newmedia.isPaidEvent}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "isPaidEvent")
                  }
                />
                <label className="text-sm">Paid Event</label>
              </div>
              <div className="mb-4 flex gap-2 items-center">
                <Switch
                  checked={newmedia.repeat}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "repeat")
                  }
                />
                <label className="text-sm">Repeating Event</label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 border rounded"
                />
                {newmedia.banner && (
                  <Image
                    src={newmedia.banner}
                    alt="Banner Preview"
                    className="w-full mt-2"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-500 text-white">
                  {editingmedia ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
