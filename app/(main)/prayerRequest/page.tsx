"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { GoDotFill, GoDot } from "react-icons/go";
import SearchActionBar from "@/components/SearchActionBar/SearchActionBar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// Define a type for the prayer requests
type PrayerRequestType = {
  id: string;
  date: string;
  name: string;
  category: string;
  contact: string;
  privacy: string;
  status: string;
};

// Sample data array
const prayerRequests: PrayerRequestType[] = [
  {
    id: "#12345128",
    date: "2 Jan 2023",
    name: "Esther Eden",
    category: "Health",
    contact: "9876543210",
    privacy: "Public",
    status: "New",
  },
  {
    id: "#12345118",
    date: "2 Jan 2023",
    name: "Esther Eden",
    category: "Health",
    contact: "9876543210",
    privacy: "Public",
    status: "New",
  },
  {
    id: "#12345129",
    date: "3 Jan 2023",
    name: "John Doe",
    category: "Family",
    contact: "9876543211",
    privacy: "Private",
    status: "Pending",
  },
  {
    id: "#12345130",
    date: "4 Jan 2023",
    name: "Jane Smith",
    category: "Work",
    contact: "9876543212",
    privacy: "Public",
    status: "Completed",
  },
  {
    id: "#12345131",
    date: "5 Jan 2023",
    name: "Michael Johnson",
    category: "Guidance",
    contact: "9876543213",
    privacy: "Public",
    status: "New",
  },
  {
    id: "#12345132",
    date: "6 Jan 2023",
    name: "Emily Davis",
    category: "Health",
    contact: "9876543214",
    privacy: "Private",
    status: "Pending",
  },
  {
    id: "#12345133",
    date: "7 Jan 2023",
    name: "James Wilson",
    category: "Family",
    contact: "9876543215",
    privacy: "Public",
    status: "Completed",
  },
  {
    id: "#12345134",
    date: "8 Jan 2023",
    name: "Sarah Brown",
    category: "Work",
    contact: "9876543216",
    privacy: "Private",
    status: "New",
  },
  {
    id: "#12345135",
    date: "9 Jan 2023",
    name: "David Taylor",
    category: "Guidance",
    contact: "9876543217",
    privacy: "Public",
    status: "Pending",
  },
  {
    id: "#12345136",
    date: "10 Jan 2023",
    name: "Laura Miller",
    category: "Health",
    contact: "9876543218",
    privacy: "Private",
    status: "Completed",
  },
  {
    id: "#12345137",
    date: "11 Jan 2023",
    name: "Robert Anderson",
    category: "Family",
    contact: "9876543219",
    privacy: "Public",
    status: "New",
  },
  {
    id: "#12345114",
    date: "7 Jan 2023",
    name: "James Wilson",
    category: "Family",
    contact: "9876543215",
    privacy: "Public",
    status: "Completed",
  },
  {
    id: "#12345143",
    date: "8 Jan 2023",
    name: "Sarah Brown",
    category: "Work",
    contact: "9876543216",
    privacy: "Private",
    status: "New",
  },
  {
    id: "#12345144",
    date: "9 Jan 2023",
    name: "David Taylor",
    category: "Guidance",
    contact: "9876543217",
    privacy: "Public",
    status: "Pending",
  },
  {
    id: "#12345145",
    date: "10 Jan 2023",
    name: "Laura Miller",
    category: "Health",
    contact: "9876543218",
    privacy: "Private",
    status: "Completed",
  },
  {
    id: "#12345146",
    date: "11 Jan 2023",
    name: "Robert Anderson",
    category: "Family",
    contact: "9876543219",
    privacy: "Public",
    status: "New",
  },
  // ... (other requests)
];

export default function PrayerRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] =
    useState<PrayerRequestType | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const requestsPerPage = 12;

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = prayerRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(prayerRequests.length / requestsPerPage);

  const handleViewClick = (request: PrayerRequestType) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleDeleteClick = (request: PrayerRequestType) => {
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // Implement delete logic here
    console.log(`Deleting request: ${selectedRequest?.id}`);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      {/* Prayer header */}
      <div className="flex justify-between items-center mb-5 px-4 sm:px-6 md:px-8">
        <div>
          <h1 className="text-[#280559] font-bold text-lg sm:text-xl">
            Prayer
          </h1>
          <p className="text-[#9898A3] text-xs sm:text-sm">
            Organize and Manage Prayer here
          </p>
        </div>
      </div>

      {/* Main screen with table */}
      <div className="sm:mt-4 md:mt-5 sm:px-4 md:px-8 lg:px-12 h-[90vh] bg-white rounded-3xl">
        {/* Search and Action Bar */}
        <SearchActionBar
          onSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
            console.log("Searching for:", e.target.value)
          }
          onFilter={() => console.log("Filtering...")}
          onExport={() => console.log("Exporting...")}
          onPrint={() => console.log("Printing...")}
        />
        <Table className="min-w-full bg-white mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 py-3">
                <input type="checkbox" />
              </TableHead>
              <TableHead className="px-2 py-3">Request ID</TableHead>
              <TableHead className="px-2 py-3">Request Date</TableHead>
              <TableHead className="px-2 py-3">Name</TableHead>
              <TableHead className="px-2 py-3 hidden md:table-cell">
                Category of Prayer
              </TableHead>
              <TableHead className="px-2 py-3 hidden md:table-cell">
                Contact
              </TableHead>
              <TableHead className="px-2 py-3 hidden md:table-cell">
                Privacy Level
              </TableHead>
              <TableHead className="px-2 py-3">Status</TableHead>
              <TableHead className="px-2 py-3">Action</TableHead>
              <TableHead className="px-2 py-3">
                <BsThreeDotsVertical />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="px-2 py-3">
                  <input type="checkbox" />
                </TableCell>
                <TableCell className="px-2 py-3">{request.id}</TableCell>
                <TableCell className="px-2 py-3">{request.date}</TableCell>
                <TableCell className="px-2 py-3">{request.name}</TableCell>
                <TableCell className="px-2 py-3 hidden md:table-cell">
                  {request.category}
                </TableCell>
                <TableCell className="px-2 py-3 hidden md:table-cell">
                  {request.contact}
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
                  <button
                    className="text-[#280559] font-semibold"
                    onClick={() => handleViewClick(request)}
                  >
                    View
                  </button>
                </TableCell>
                <TableCell className="px-2 py-3 relative">
                  <Popover>
                    <PopoverTrigger>
                      <button className="p-1">
                        <BsThreeDotsVertical />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-24 p-1 shadow-md">
                      <button
                        onClick={() => handleDeleteClick(request)}
                        className="text-red-500 hover:bg-red-100 px-2 py-1 text-sm w-full text-center rounded"
                      >
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-[#d5c3ee] font-bold text-lg"
          >
            <IoMdArrowDropleftCircle />
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className="text-[#280559] text-lg"
              >
                {currentPage === index + 1 ? <GoDotFill /> : <GoDot />}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-[#d5c3ee] font-bold text-lg"
          >
            <IoMdArrowDroprightCircle />
          </button>
        </div>
      </div>

      {/* Dialog to view request details */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prayer Request</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="border border-gray-300"></div>
          <DialogDescription>
            {selectedRequest && (
              <div className="space-y-4 text-black">
                <div className="flex justify-between items-center">
                  <span>Request ID:</span>
                  <span className="font-semibold">{selectedRequest.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Request Date:</span>
                  <span className="font-semibold">{selectedRequest.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Name:</span>
                  <span className="font-semibold">{selectedRequest.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Category of Prayer:</span>
                  <span className="font-semibold">
                    {selectedRequest.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Contact:</span>
                  <span className="font-semibold">
                    {selectedRequest.contact}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Privacy Level:</span>
                  <span className="font-semibold">
                    {selectedRequest.privacy}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className="font-semibold">
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
            )}
          </DialogDescription>
          {/* <DialogFooter>
            <DialogClose className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Close
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prayer Request</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this prayer request?
            <br />
            This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getStatusStyles(status: string) {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
}
