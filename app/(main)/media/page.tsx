"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import AddMedia from "@/components/actions/media";
import { db } from "../../../firebase"; // Adjust import based on your Firebase setup
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";

interface Media {
  uid: string; // Changed to uid
  id: string;
  title: string;
  description: string;
  banner: string | null;
  type: string; // e.g., "Video", "Audio", "Image", "Blog"
}

export default function Media() {
  const [showForm, setShowForm] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [currentTab, setCurrentTab] = useState("Video"); // Default to Video
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [newMedia, setNewMedia] = useState<Media>({
    uid:"",
    id: "",
    title: "",
    description: "",
    banner: null,
    type: currentTab,
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
         const storedChurchId = localStorage.getItem('storedChurchId');
        if (!storedChurchId) {
          throw new Error("No stored churchId found in local storage.");
        }
      
        const mediaCollection = collection(db, "media");
        const mediaQuery = query(
          mediaCollection, 
          where("type", "==", currentTab),
          where("churchId", "==", storedChurchId)
        );        
        const mediaSnapshot = await getDocs(mediaQuery);
        const mediaList = mediaSnapshot.docs.map(doc => ({
          uid: doc.id, // Changed from id to uid
          ...doc.data() as Omit<Media, 'uid'> // Cast remaining data
        }));
        setMedia(mediaList);
        // console.log("Media Data:", mediaList);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [currentTab]); // Refetch media whenever currentTab changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
        setEditingMedia(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const mediaToSave = { ...newMedia };
  
    try {
      if (editingMedia) {
        // Update existing media
        if (!editingMedia.uid) {
          throw new Error("Editing media ID is missing.");
        }
        const mediaDocRef = doc(db, 'media', editingMedia.uid); // Valid path with three segments
        await updateDoc(mediaDocRef, mediaToSave);
      } else {
        // Create new media
        const storedChurchId = localStorage.getItem('storedChurchId');
        if (!storedChurchId) {
          throw new Error("No stored churchId found in local storage.");
        }
        const docRef = await addDoc(collection(db, 'media'), {
          ...mediaToSave,
          churchId: storedChurchId,
        });
        // Optionally assign the newly generated ID to the media object if needed
        setNewMedia(prev => ({ ...prev, id: docRef.id }));
      }
  
      // Clear form and close the form after successful operation
      setNewMedia({
        uid:'',
        id: "",
        title: "",
        description: "",
        banner: null,
        type: currentTab,
      });
  
      setShowForm(false);
      setEditingMedia(null);
    } catch (error) {
      console.error("Error saving media:", error);
    }
  };
  
  
  const handleDelete = async (id: string) => {
    try {
      if (!id) {
        throw new Error("Document ID is missing.");
      }
      const mediaDocRef = doc(db, 'media', id); // Valid path with three segments
      await deleteDoc(mediaDocRef);
      setMedia(prev => prev.filter(item => item.id !== id));
      setMediaToDelete(null); // Close the dialog after deletion
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };
  
  
  

  const handleEdit = (item: Media) => {
    setEditingMedia(item);
    setNewMedia(item);
    setShowForm(true);
  };



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMedia((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMedia((prev) => ({ ...prev, banner: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (type: string) => {
    setCurrentTab(type);
    setNewMedia(prev => ({ ...prev, type }));
  };

  return (
    <>
      {/* media header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl sm:text-lg">Media</h1>
          <p className="text-[#9898A3] text-xs">View all media here</p>
        </div>
      </div>

      {/* main screen */}
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-full bg-white rounded-3xl">

        {/* Add Media Button */}
        <AddMedia 
          className="text-white flex gap-2"
          onClick={() => {
            setShowForm(true);
            setEditingMedia(null);
            setNewMedia({
              uid:"",
              id: "",
              title: "",
              description: "",
              banner: null,
              type: currentTab,
            });
          }}
          onSetHandleTab={handleTabChange}
        />
        
        {/* Media cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
          {media.map(item => (
            <Card key={item.id} className="flex flex-col items-center">
              <div className="relative w-full h-48">
                {item.banner && (
                  <Image
                    src={item.banner}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                )}
              </div>
              <CardHeader className="w-full text-left">
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="text-center">{item.description}</p>
              </CardContent>
              <CardContent className="flex flex-col items-center">
                <p className="text-center">{item.id}</p>
              </CardContent>
              
              <CardFooter className="flex justify-center gap-2">
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

        {/* Add/Edit Media Form */}
        {showForm && (
          <div
            ref={formRef}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white p-4 md:p-6 shadow-lg overflow-y-auto z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">{editingMedia ? "Edit Media" : "Create Media"}</h2>
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
                  value={newMedia.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={newMedia.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-[#047857] text-white">
                  {editingMedia ? "Update" : "Add"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
