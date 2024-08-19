"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

interface Announcement {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedAnnouncement = {
      ...newAnnouncement,
      date: new Date(
        `${newAnnouncement.date}T${newAnnouncement.time || "00:00"}`
      ).toISOString(),
    };

    if (editingIndex !== null) {
      const updatedAnnouncements = [...announcements];
      updatedAnnouncements[editingIndex] = submittedAnnouncement;
      setAnnouncements(updatedAnnouncements);
      setEditingIndex(null);
    } else {
      setAnnouncements([...announcements, submittedAnnouncement]);
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

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setAnnouncements((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setIsDeleteModalOpen(false);
    }
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
        {/* card content */}

        <div className="mt-6">
          {Object.entries(categorizeAnnouncements()).map(
            ([tabName, tabAnnouncements]) => (
              <div
                key={tabName}
                className={currentTab === tabName ? "block" : "hidden"}
              >
                {tabAnnouncements.map((announcement, index) => (
                  <div
                    key={index}
                    className="flex items-stretch mb-6 border rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={announcement.image || ""}
                      alt={announcement.title}
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
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Announcement form */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
            ref={formRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#280559]">
                {editingIndex !== null ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FiX size={24} className="text-[#280559]" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Title</label>
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
                  <img
                    src={newAnnouncement.image}
                    alt="Preview"
                    className="mt-2 w-full h-auto object-cover"
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
                  {editingIndex !== null ? "Save Changes" : "Create Announcement"}
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
            <Button onClick={confirmDelete} className="bg-red-600 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
