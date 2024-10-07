"use client";
import React, { useState, useEffect, useMemo } from "react";
import DataTable from "@/components/datatable/table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc, addDoc, Firestore, getDoc, limit, startAfter, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";
import Tableaction from "@/components/Tableaction/tableaction";
import { ColumnDef } from "@tanstack/react-table";
 
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  tableAction?: React.ReactNode;
}
 
type PrayerRequestType = {
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
  const [searchValue, setSearchValue] = useState<string>("");const [prayerRequests, setPrayerReuests] = useState<PrayerRequestType[]>([]);
 
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
 
  function setSearchTerm(value: string): void {
    throw new Error("Function not implemented.");
  }
 
  function onGetSearchVal(value: string): void {
    throw new Error("Function not implemented.");
  }
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "Request ID" },
      { accessorKey: "prayerRequestDate", header: "Request Date" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "category", header: "Category of Prayer" },
      { accessorKey: "contactNumber", header: "Contact" },
      { accessorKey: "privacy", header: "Privacy Level" },
      { accessorKey: "status", header: "Status", cell: ({ row }: { row: any }) => ( 
        <div>
          <span
            className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg ${getStatusStyles(
              row.getValue("status")
            )}`} 
          >
            {row.getValue("status")}
          </span>
        </div>
      )},      
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2">
            
            <Popover>
                  <PopoverTrigger>
                    <Button variant="ghost" size="icon">
                      <BsThreeDotsVertical />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-30">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleStatusChange(row, "Pending", row.userId)}
                       className="text-yellow-500 hover:bg-yellow-100 px-2 py-1 text-sm w-full text-center rounded mb-1"
                      >
                        Pending
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleStatusChange(row, "Completed", row.userId)}
                         className="text-green-500 hover:bg-green-100 px-2 py-1 text-sm w-full text-center rounded mb-1"
                      >
                        Completed
                      </Button>
                      </div>
                      </PopoverContent>
                      </Popover>
                      
          </div>
        ),
      },
    ],
    [handleViewClick, handleDelete, handleViewClick]
  );
  const filteredPrayerRequests: PrayerRequestType[] = prayerRequests.filter(
    (prayerRequest: PrayerRequestType) => {
      const searchLower = searchValue.toLowerCase();
      return (
        (prayerRequest.name && prayerRequest.name.toLowerCase().includes(searchLower)) ||
        (prayerRequest.contactNumber && prayerRequest.contactNumber.toLowerCase().includes(searchLower)) ||
        (prayerRequest.category && prayerRequest.category.toLowerCase().includes(searchLower)) ||
        (prayerRequest.status && prayerRequest.status.toLowerCase().includes(searchLower))
      );
    }
  );
  
  const displayedprayerrequest = filteredPrayerRequests? currentRequestsPage : currentRequestsPage;
  console.log(displayedprayerrequest)
 
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="justify-between items-center mb-5 px-4 sm:px-6 md:px-8">

    
    <div>
          <h1 className="text-[#280559] font-bold text-lg sm:text-xl">Prayer Requests</h1>
          <p className="text-[#9898A3] text-xs sm:text-sm">Organize and Manage Prayer Requests here</p>
        </div>
        </div>
      {/* <Table> */}
        {/* <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category of Prayer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Privacy Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader> */}
        {/* <TableBody> */}
          
        <DataTable
            data={displayedprayerrequest} // Use filtered or unfiltered data based on filter state
            tableAction={<Tableaction onGetSearchVal={onGetSearchVal} print={false} />} 
            columns={columns}     />
        {/* {currentRequestsPage.map((request) => (
         
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
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
                </TableCell>              <TableCell>
                <span
                  className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg ${getStatusStyles(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => handleViewClick(request)}>View</Button>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="ghost" size="icon">
                      <BsThreeDotsVertical />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleStatusChange(request, "Pending", request.userId)}
                        className="justify-start"
                      >
                        Pending
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleStatusChange(request, "Completed", request.userId)}
                        className="justify-start"
                      >
                        Completed
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(request)}
                        className="justify-start text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))} */}
        {/* </TableBody>
      </Table> */}
   
      {/* <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button variant="outline" disabled>
          {currentPage}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            fetchRequests();
          }}
        >
          Next
        </Button>
      </div> */}
 
      {/* Keep the existing Dialog component for viewing request details */}
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
    </div>
  );
}
 
const getStatusStyles = (status: string) => {
  console.log(status)
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-red-100 text-gray-800";
  }
};
 
const updateStatusAndStoreNotification = async (status: string, requestId: string, userId: string) => {
  const notificationData = {
    status,
    requestId,
    userId,
    createdAt: new Date(),
  };
 
  await addDoc(collection(db, "notifications"), notificationData);
};