"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc, addDoc, Firestore, getDoc ,limit, startAfter,  orderBy} from "firebase/firestore";
import { db } from "@/firebase";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";

type PrayerRequestType = {
  //userId(db: Firestore, arg1: string, userId: any): unknown;
  id: string;
  prayerRequestDate: string;
  name: string;
  category: string;
  contactNumber: string;
  privacy: string;
  status: string;
  userId: string;
};

export default function PrayerRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRequests, setCurrentRequests] = useState<PrayerRequestType[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequestType | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [requestsPerPage] = useState(12);
  const [lastVisible, setLastVisible] = useState<any>(null); 
  const userId = "userId";
  const [currentStatus, setCurrentStatus] = useState("new")

  const filterCompleteStatus = currentRequests.filter((eachStatus) => eachStatus.status === "Completed")
  console.log("completed", filterCompleteStatus)
  const fetchRequests = async () => {
    // setLoading(true);
    const storedChurchId = localStorage.getItem('storedChurchId');

    if (!storedChurchId) {
      console.error("No stored churchId found in local storage.");
      // setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'prayerRequests'),
        where('churchId', '==', storedChurchId),
        orderBy('prayerRequestDate', 'desc'), // Order by request date
        limit(12), // Fetch only 12 requests at a time
        startAfter(lastVisible)  // Pagination: start after the last document fetched
      );

      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentRequests((prevRequests) => [...prevRequests, ...requestsData as PrayerRequestType[]]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);  // Update lastVisible with the last doc
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const storedChurchId = localStorage.getItem('storedChurchId');

      if (!storedChurchId) {
        throw new Error("No stored churchId found in local storage.");
      }

      const querySnapshot = await getDocs(
        query(
          collection(db, 'prayerRequests'),
          where('churchId', '==', storedChurchId)
        )
      );
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurrentRequests(requestsData as PrayerRequestType[]);
    };

    fetchRequests();
  }, []);

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequestsPage = currentRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(currentRequests.length / requestsPerPage);

  const handleViewClick = (request: PrayerRequestType) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };
  const handleStatusChange = async (request: PrayerRequestType, newStatus: string, userId: string) => {
    if (request) {
      try {
        // Update the status in the prayerRequests collection
        const filterData = currentRequests.filter((eachStatus) => eachStatus.userId === userId)
        console.log("filterdata", filterData)
        if (filterData[0].status !== "Completed") {
          setCurrentStatus(newStatus)
          const requestDoc = doc(db, "prayerRequests", request.id);
          await updateDoc(requestDoc, { status: newStatus });

          // Check if the user document exists before updating
          const userDocRef = doc(db, "users", request.userId);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            await updateDoc(userDocRef, { status: newStatus });
          } else {
            console.error("User document does not exist:", request.userId);
            // Handle the case where the user document does not exist
          }

          // Store the status update in the notifications collection
          await updateStatusAndStoreNotification(newStatus, request.id, request.userId);

          // Update the local state
          setCurrentRequests(prevRequests =>
            prevRequests.map(req =>
              req.id === request.id ? { ...req, status: newStatus } : req
            )
          );
        }
        else {
          alert("Cannot change status to Completed for a prayer request that has already been completed.")
        }

      } catch (error) {
        console.error("Error updating status:", error);
        // Handle the error appropriately
      }
    }
  };


  const handleDelete = async (request: PrayerRequestType) => {
    if (request) {
      const requestDoc = doc(db, "prayerRequests", request.id);
      await deleteDoc(requestDoc);

      // Remove from local state
      setCurrentRequests(prevRequests =>
        prevRequests.filter(req => req.id !== request.id)
      );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5 px-4 sm:px-6 md:px-8">
        <div>
          <h1 className="text-[#280559] font-bold text-lg sm:text-xl">Prayer Requests</h1>
          <p className="text-[#9898A3] text-xs sm:text-sm">Organize and Manage Prayer Requests here</p>
        </div>
      </div>

      <div className="sm:mt-4 md:mt-5 sm:px-4 md:px-8 lg:px-12 h-screen bg-white rounded-3xl">
        <Table className="min-w-full bg-white mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 py-3">
                <input type="checkbox" />
              </TableHead>
              <TableHead className="px-2 py-3">Request ID</TableHead>
              <TableHead className="px-2 py-3">Request Date</TableHead>
              <TableHead className="px-2 py-3">Name</TableHead>
              <TableHead className="px-2 py-3 hidden md:table-cell">Category of Prayer</TableHead>
              <TableHead className="px-2 py-3 hidden md:table-cell">Contact</TableHead>
              <TableHead className="px-2 py-3 hidden md:table-cell">Privacy Level</TableHead>
              <TableHead className="px-2 py-3">Status</TableHead>
              <TableHead className="px-2 py-3">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRequestsPage.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="px-2 py-3">
                  <input type="checkbox" />
                </TableCell>
                <TableCell className="px-2 py-3">{request.id}</TableCell>
                <TableCell className="px-2 py-3">{request.prayerRequestDate}</TableCell>
                <TableCell className="px-2 py-3">{request.name}</TableCell>
                <TableCell className="px-2 py-3 hidden md:table-cell">
                  {request.category}
                </TableCell>
                <TableCell className="px-2 py-3 hidden md:table-cell">
                  {request.contactNumber}
                </TableCell>
                <TableCell className="px-2 py-3 hidden md:table-cell">
                  {request.privacy}
                </TableCell>
                <TableCell className="px-2 py-3">
                  <span
                    className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg ${getStatusStyles(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </TableCell>
                <TableCell className="px-2 py-3">
                  <Popover>
                    <PopoverTrigger>
                      <button className="p-1">
                        <BsThreeDotsVertical />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-24 p-1 shadow-md">
                      <button
                        onClick={() => handleStatusChange(request, "Pending", request.userId)}
                        className="text-yellow-500 hover:bg-yellow-100 px-2 py-1 text-sm w-full text-center rounded mb-1"
                      >
                        {/* {filterCompleteStatus.some((each) => each.userId === request.userId && "Pending...")} */}
                        Pending
                      </button>
                      <button
                        onClick={() => handleStatusChange(request, "Completed", request.userId)}
                        className="text-green-500 hover:bg-green-100 px-2 py-1 text-sm w-full text-center rounded mb-1"
                      >
                        Completed
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* View Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={() => setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <div>
                  <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                  <p><strong>Date:</strong> {selectedRequest.prayerRequestDate}</p>
                  <p><strong>Name:</strong> {selectedRequest.name}</p>
                  <p><strong>Category:</strong> {selectedRequest.category}</p>
                  <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
                  <p><strong>Privacy:</strong> {selectedRequest.privacy}</p>
                  <p><strong>Status:</strong> {selectedRequest.status}</p>
                </div>
              )}
            </DialogDescription>
            <DialogClose>Close</DialogClose>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const updateStatusAndStoreNotification = async (status: string, requestId: string, userId: string) => {
  const notificationData = {
    status,
    requestId,
    userId,  // Include userId in the notification data
    createdAt: new Date(),
  };

  await addDoc(collection(db, "notifications"), notificationData);
};
