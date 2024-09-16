"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QueryConstraint } from 'firebase/firestore';
import { FiPlusCircle, FiX, FiUpload, FiEdit2 } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
// Import db from firebase configuration

interface Announcement {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  isPinned: boolean;
  image: string | null;
}

export default function Announcement() {
  const [currentTab, setCurrentTab] = useState("current");
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    title: "",
    description: "",
    date: "",
    time: "",
    isPinned: false,
    image: null,
  });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const storedChurchId = localStorage.getItem('storedChurchId');
        if (!storedChurchId) {
          throw new Error("No stored churchId found in local storage.");
        }
        const querySnapshot = await getDocs(
          query(
            collection(db, 'announcement'),
            where('churchId', '==', storedChurchId)
          )
        );
        const fetchedAnnouncements: Announcement[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Announcement));
        setAnnouncements(fetchedAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    }
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewAnnouncement((prev) => ({ ...prev, isPinned: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAnnouncement((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submittedAnnouncement = {
      ...newAnnouncement,
      date: new Date(
        `${newAnnouncement.date}T${newAnnouncement.time || "00:00"}`
      ).toISOString(),
    };
    
     
    try {
      if (editingIndex !== null && announcements[editingIndex]?.id) {
        // Update existing announcement
        const announcementRef = doc(
          db,
          "announcement",
          announcements[editingIndex].id
        );
        console.log("announcement up");
        await updateDoc(announcementRef, submittedAnnouncement);
      } else {
        // Create new announcement
        const storedChurchId = localStorage.getItem("storedChurchId");
        if (!storedChurchId) {
          throw new Error("No stored churchId found in local storage.");
        }
        console.log("ins");

        let res = await addDoc(collection(db, "announcement"), {
          ...submittedAnnouncement,
          churchId: storedChurchId,
        });
        console.log(res);
        
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
    setShowForm(false);
    setNewAnnouncement({
      title: "",
      description: "",
      date: "",
      time: "",
      isPinned: false,
      image: null,
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewAnnouncement(announcements[index]);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (pageType: string) => {
    if (deleteIndex !== null && announcements[deleteIndex]?.id) {
      try {
        const announcementId = announcements[deleteIndex].id;
        await deleteDoc(doc(db, "announcement", announcementId));
  
        // Refresh announcements based on the page type
        const storedChurchId = localStorage.getItem("storedChurchId");
        if (!storedChurchId) {
          throw new Error("No stored churchId found in local storage.");
        }
  
        // Set up filters based on page type
        let queryConstraint;
        if (pageType === "current") {
          // Query for current announcements
          queryConstraint = where("churchId", "==", storedChurchId); // add any filters for current announcements
        } else if (pageType === "upcoming") {
          // Query for upcoming announcements
          queryConstraint = where("churchId", "==", storedChurchId); // add any filters for upcoming announcements
        } else if (pageType === "previous") {
          // Query for previous announcements
          queryConstraint = where("churchId", "==", storedChurchId); // add any filters for previous announcements
        }
  
        const queryConstraints: QueryConstraint[] = [];
if (queryConstraint) {
  queryConstraints.push(queryConstraint);
}
        const querySnapshot = await getDocs(
          query(collection(db, "announcement"), ...queryConstraints)
        );
  
        const fetchedAnnouncements: Announcement[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Announcement)
        );
  
        // Update the state with the relevant announcements based on pageType
        setAnnouncements(fetchedAnnouncements);
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
      setDeleteIndex(null);
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleDeleteClick = (pageType: string) => async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    await confirmDelete(pageType); // Call confirmDelete with the correct pageType
  };

  const categorizeAnnouncements = (): Record<string, Announcement[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return announcements.reduce(
      (acc: Record<string, Announcement[]>, announcement) => {
        const announcementDate = new Date(announcement.date);
        announcementDate.setHours(0, 0, 0, 0);

        if (announcementDate.getTime() === today.getTime()) {
          acc.current.push(announcement);
        } else if (announcementDate < today) {
          acc.previous.push(announcement);
        } else {
          acc.upcoming.push(announcement);
        }
        return acc;
      },
      { current: [], upcoming: [], previous: [] }
    );
  };
  return (
    <>
      {/* announcement header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl">Announcement</h1>
          <p className="text-[#9898A3] text-xs">
            View all church announcements here
          </p>
        </div>
        {/* create new announcement */}
        <div>
          <Button
            className="bg-[#280559] text-white flex gap-2"
            onClick={() => setShowForm(true)}
          >
            <FiPlusCircle />
            <p>Create New Announcement</p>
          </Button>
        </div>
      </div>
      {/* main screen */}
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-[90%] bg-white rounded-3xl">
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
        {/* card content */}

        <div className="mt-6">
          {Object.entries(categorizeAnnouncements()).map(
            ([tabName, tabAnnouncements]) => (
              <div
                key={tabName}
                className={currentTab === tabName ? "block" : "hidden"}
              >
                {tabAnnouncements.length === 0 ? (
                  <p className="text-center text-gray-500 pt-52">
                    There is no announcement here.
                  </p>
                ) : (
                  tabAnnouncements.map(
                    (announcement: Announcement, index: number) => (
                      <div
                        key={index}
                        className="flex items-stretch mb-6 border rounded-lg overflow-hidden shadow-sm"
                      >
                        <Image
                          src={announcement.image || ""}
                          alt={announcement.title}
                          width={50}
                          height={40}
                          className="w-40 h-40 object-cover"
                        />
                        <div className="flex-grow flex items-center px-4 border-l border-r">
                          <div>
                            <h3 className="text-xl font-semibold text-[#280559] mb-2">
                              {announcement.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {announcement.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end p-4 min-w-[120px]">
                          <div>
                            <span className="text-sm text-gray-500 block">
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500 block">
                              {announcement.time}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(index)}
                              className="text-sm bg-transparent hover:bg-gray-100 text-[#280559] p-2 rounded-full"
                            >
                              <FiEdit2 size={18} />
                            </Button>
                            <Button
                              onClick={() => handleDelete(index)}
                              className="text-sm bg-transparent hover:bg-gray-100 text-[#280559] p-2 rounded-full"
                            >
                              <MdOutlineDelete size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Announcement form */}
      {showForm && (
        <div
          className="fixed top-0 right-0 h-full w-full md:w-96 bg-white p-4  overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
            ref={formRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#280559]">
                {editingIndex !== null
                  ? "Edit Announcement"
                  : "New Announcement"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FiX size={24} className="text-[#280559]" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newAnnouncement.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newAnnouncement.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={newAnnouncement.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
                {newAnnouncement.image && (
                  <Image
                    src={newAnnouncement.image}
                    alt="Preview"
                    width={50}
                    height={40}
                    className="mt-2 w-20 h-20 object-cover"
                  />
                )}
              </div>
              <div className="flex items-center mb-4">
                <Switch
                  checked={newAnnouncement.isPinned}
                  onCheckedChange={handleSwitchChange}
                />
                <label className="ml-2">Pin Announcement</label>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  className="bg-gray-300 text-gray-700"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#280559] text-white">
                  {editingIndex !== null
                    ? "Save Changes"
                     : "Create Announcement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteClick('current')} className="bg-red-600 text-white">
  Delete
</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
