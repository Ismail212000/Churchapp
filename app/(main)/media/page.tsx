"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import AddMedia from "@/components/actions/media";
import { db, storage } from "../../../firebase"; // Adjust import based on your Firebase setup
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Media {
  id: string;
  title: string;
  description: string;
  banner: string | null;
  audio: string | null;
  video: string | null;
  blog: string | null;
  type: string; // e.g., "Video", "Audio", "Image", "Blog"
}

export default function Media() {
  const [showForm, setShowForm] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [currentTab, setCurrentTab] = useState("Video"); // Default to Video
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [newMedia, setNewMedia] = useState<Media>({
    id: "",
    title: "",
    description: "",
    banner: null,
    audio: null,
    video: null,
    blog: null,
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
          id: doc.id,
          ...doc.data() as Omit<Media, 'id'>
        }));
        setMedia(mediaList);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [currentTab]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaType: "banner" | "audio" | "video" | "blog") => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        const storageRef = ref(storage, `media/${mediaType}/${fileName}`);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Update the media state with the new URL
        setNewMedia((prev) => ({ ...prev, [mediaType]: downloadURL }));
      } catch (error) {
        console.error("Error uploading file:", error);
        // Display a user-friendly message or notification
      }
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mediaToSave = { ...newMedia };

    try {
      if (editingMedia) {
        if (!editingMedia.id) {
          throw new Error("Editing media ID is missing.");
        }
        const mediaDocRef = doc(db, 'media', editingMedia.id);
        await updateDoc(mediaDocRef, mediaToSave);
      } else {
        const storedChurchId = localStorage.getItem('storedChurchId');
        if (!storedChurchId) {
          throw new Error("No stored churchId found in local storage.");
        }
        const docRef = await addDoc(collection(db, 'media'), {
          ...mediaToSave,
          churchId: storedChurchId,
        });
        setMedia((prev) => [
          ...prev,
          {
            ...mediaToSave,
            id: docRef.id,
          },
        ]);
      }

      setNewMedia({
        id: "",
        title: "",
        description: "",
        banner: null,
        audio: null,
        video: null,
        blog: null,
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
      const mediaDocRef = doc(db, 'media', id);
      await deleteDoc(mediaDocRef);
      setMedia(prev => prev.filter(item => item.id !== id));
      setMediaToDelete(null);
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

  const handleTabChange = (type: string) => {
    setCurrentTab(type);
    setNewMedia(prev => ({ ...prev, type }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl sm:text-lg">Media</h1>
          <p className="text-[#9898A3] text-xs">View all media here</p>
        </div>
      </div>

      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-full bg-white rounded-3xl">

        <AddMedia 
          className="text-white flex gap-2"
          onClick={() => {
            setShowForm(true);
            setEditingMedia(null);
            setNewMedia({
              id: "",
              title: "",
              description: "",
              banner: null,
              audio: null,
              video: null,
              blog: null,
              type: currentTab,
            });
          }}
          onSetHandleTab={handleTabChange}
        />

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
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
              <CardHeader className="w-full text-left">
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="text-center">{item.description}</p>
                {item.audio && <audio controls src={item.audio} />}
                {item.video && <video controls src={item.video} />}
                {item.blog && <p>{item.blog}</p>}
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <FiTrash2 className="text-[#047857]" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete this item?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setMediaToDelete(null)}
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => mediaToDelete && handleDelete(mediaToDelete.id)}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {showForm && (
        <div ref={formRef} className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingMedia ? "Edit Media" : "Add Media"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={newMedia.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              <textarea
                name="description"
                value={newMedia.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              {newMedia.type === "Image" && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "banner")}
                    className="mb-4"
                  />
                  {newMedia.banner && (
                    <Image src={newMedia.banner} alt="Banner" width={300} height={200} />
                  )}
                </>
              )}
              {newMedia.type === "Audio" && (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, "audio")}
                    className="mb-4"
                  />
                  {newMedia.audio && <audio controls src={newMedia.audio} />}
                </>
              )}
              {newMedia.type === "Video" && (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "video")}
                    className="mb-4"
                  />
                  {newMedia.video && <video controls src={newMedia.video} />}
                </>
              )}
              {newMedia.type === "Blog" && (
                <>
                 <textarea
                    name="blog"
                    value={newMedia.blog || ''}
                    onChange={handleInputChange}
                    placeholder="Blog content"
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                  />
                </>
              )}
              <div className="flex gap-2">
                <Button type="submit" variant="outline" className="bg-[#047857] text-white">
                  {editingMedia ? "Update" : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMedia(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
