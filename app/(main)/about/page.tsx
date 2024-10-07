"use client";
import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../../firebase"; // Ensure you have Firebase storage imported
import { collection, doc, getDoc, getDocs, query, setDoc, deleteDoc, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase storage functions
import { Button } from "@/components/ui/button";
import { FiPlusCircle, FiEdit2, FiX, FiUpload } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";

interface AboutUsData {
  id?: string;
  imageUrl: string;
  aboutChurch:string;
  visionMission: string;
  contactNumber: string;
  emailId: string;
  description: string;
  churchId: string;
}

const AboutUs: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [aboutUsData, setAboutUsData] = useState<AboutUsData>({
    imageUrl: "",
    aboutChurch:"",
    visionMission: "",
    contactNumber: "",
    emailId: "",
    description: "",
    churchId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // To hold the selected image file
  const [uploadProgress, setUploadProgress] = useState(0); // To track upload progress
  const storedChurchId = localStorage.getItem("storedChurchId") || "";
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const fetchAboutUsData = async () => {
    if (!storedChurchId) {
      console.error("No stored churchId found in local storage.");
      return;
    }

    try {
      const querySnapshot = await getDocs(
        query(collection(db, "aboutUs"), where("churchId", "==", storedChurchId))
      );

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setAboutUsData({ ...doc.data() as AboutUsData, id: doc.id });
      }
    } catch (error) {
      console.error("Error fetching About Us data: ", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAboutUsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFile) {
      const storageRef = ref(storage, `aboutUs/${storedChurchId}/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          saveAboutUsData(downloadURL);
        }
      );
    } else {
      saveAboutUsData(aboutUsData.imageUrl);
    }
  };

  const saveAboutUsData = async (imageUrl: string) => {
    try {
        const aboutUsDocRef = aboutUsData.id
            ? doc(db, "aboutUs", aboutUsData.id) // Update existing document
            : doc(collection(db, "aboutUs")); // Create a new document
        
        await setDoc(aboutUsDocRef, { ...aboutUsData, imageUrl, churchId: storedChurchId });

        alert("Data saved successfully!");
        setIsModalOpen(false);
        fetchAboutUsData();
    } catch (error) {
        console.error("Error saving data: ", error);
    }
};


  const handleDelete = async () => {
    if (aboutUsData.id) {
      try {
        await deleteDoc(doc(db, "aboutUs", aboutUsData.id));
        alert("About Us data deleted successfully!");
        setIsDeleteModalOpen(false);
        setAboutUsData({
          imageUrl: "",
          aboutChurch:"",
          visionMission: "",
          contactNumber: "",
          emailId: "",
          description: "",
          churchId: storedChurchId,
        });
      } catch (error) {
        console.error("Error deleting About Us data: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl">About Us</h1>
          <p className="text-[#9898A3] text-xs">View and manage church information</p>
        </div>
        <Button
          className="bg-[#280559] text-white flex gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          {aboutUsData.id ? <FiEdit2 /> : <FiPlusCircle />}
          <p>{aboutUsData.id ? "Edit About Us" : "Create About Us"}</p>
        </Button>
      </div>

      {aboutUsData.id ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Image
            src={aboutUsData.imageUrl }
            alt="Church"
            width={500}
            height={600}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold text-[#280559] mb-4">About Our Church</h2>
          <p className="text-gray-700 mb-4">{aboutUsData.description}</p>
          
          <h3 className="text-xl font-semibold text-[#280559] mb-2">About</h3>
          <p className="text-gray-700 mb-4">{aboutUsData.aboutChurch}</p>
          
          <h3 className="text-xl font-semibold text-[#280559] mb-2">Vision and Mission</h3>
          <p className="text-gray-700 mb-4">{aboutUsData.visionMission}</p>
          
          <h3 className="text-xl font-semibold text-[#280559] mb-2">Contact Information</h3>
          <p className="text-gray-700">Phone: {aboutUsData.contactNumber}</p>
          <p className="text-gray-700">Email: {aboutUsData.emailId}</p>
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2"
            >
              <MdOutlineDelete />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No About Us information available. Click &aposCreate About Us&apos to add information.</p>
      )}

<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="md:w-1/2 w-full right-0 h-full overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{aboutUsData.id ? "Edit About Us" : "Create About Us"}</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">About</label>
          <textarea
            name="aboutChurch"
            value={aboutUsData.aboutChurch}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Vision and Mission</label>
          <textarea
            name="visionMission"
            value={aboutUsData.visionMission}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={aboutUsData.contactNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email ID</label>
          <input
            type="email"
            name="emailId"
            value={aboutUsData.emailId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={aboutUsData.description}
            onChange={handleInputChange}
            rows={5}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full bg-[#280559] text-white mt-4">
          {aboutUsData.id ? "Save Changes" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>



      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this information?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutUs;
