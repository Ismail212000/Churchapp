"use client";
import DataTable from "@/components/datatable/table";
import { IoMdSearch } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineArrowCircleDown } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { IoPrintSharp } from "react-icons/io5";
// import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
interface DonationData {
  DonationId: string;
  DonorName: string;
  DonorType: string;
  Address: string;
  Contact: string;
  amount: number;
}
const Donation: React.FC = () => {
  const [selectedDonation, setSelectedDonation] = useState<DonationData | null>(
    null
  );
  console.log("ss:", selectedDonation);
  const [searchValue, setSearchValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const donationData = [
    {
      DonationId: "#12345128",
      DonorName: "Esther Eden",
      DonorType: "Charity",
      Address: "2972 WestheimerRd. Santa Ana",
      Contact: "9876543210",
      amount: 100.0,
    },
    {
      DonationId: "#12345128",
      DonorName: "Eden",
      DonorType: "Charity",
      Address: "2972 WestheimerRd. Santa Ana",
      Contact: "9876543210",
      amount: 100.0,
    },
    {
      DonationId: "#12345128",
      DonorName: "john",
      DonorType: "Charity",
      Address: "2972 WestheimerRd. Santa Ana",
      Contact: "9876543210",
      amount: 100.0,
    },
  ];
  // const searchInputRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   if (searchInputRef.current) {
  //     searchInputRef.current.focus();
  //   }
  // }, []);

  const [openModal, setOpenModal] = useState(false);
  const filterSearchData = useMemo(() => {
    return donationData.filter((eachDonation) => {
      const searchLower = searchValue.toLowerCase();
      return (
        eachDonation.DonationId.toLowerCase().includes(searchLower) ||
        eachDonation.DonorName.toLowerCase().includes(searchLower) ||
        eachDonation.DonorType.toLowerCase().includes(searchLower) ||
        eachDonation.Address.toLowerCase().includes(searchLower) ||
        eachDonation.Contact.toLowerCase().includes(searchLower)
      );
    });
  }, [searchValue, donationData]);
  const Tableaction: React.FC = () => {
    return (
      <div className="w-full flex items-center gap-2">
        <div className="bg-[#fff] rounded-[13px] pl-1 pr-1 border border-[#CBD2DC80] w-[65%] h-[40px] flex items-center gap-2">
          <IoMdSearch className="text-[25px]" />
          <input
            type="search"
            placeholder="Search for invoice"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="bg-transparent w-full outline-none h-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
            <IoFilterSharp className="text-[#280559]" /> <span>Filters</span>
          </button>
          <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
            <MdOutlineArrowCircleDown className="text-[#280559]" />{" "}
            <span>Export</span>
          </button>
          <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
            <IoPrintSharp className="text-[#280559]" /> <span>Print</span>
          </button>
        </div>
      </div>
    );
  };

  const handleViewClick = (row: any) => {
    setSelectedDonation(row.original);
    setOpenModal(true);
  };

  const columnsWithCheckboxAndAction = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "DonationId",
      header: "Donation id",
      cell: ({ row }: { row: any }) => (
        <div className="capitalize">
          <p style={{ textDecoration: "" }}>{row.getValue("DonationId")}</p>
        </div>
      ),
    },
    {
      accessorKey: "DonorName",
      header: "Donor Name",
      cell: ({ row }: { row: any }) => (
        <div className="capitalize">
          <p style={{ textDecoration: "" }}>{row.getValue("DonorName")}</p>
        </div>
      ),
    },
    {
      accessorKey: "Donation Type",
      header: "Donation Type",
      cell: ({ row }: { row: any }) => (
        <div className="capitalize">
          <p style={{ textDecoration: "" }}>{row.getValue("DonorName")}</p>
        </div>
      ),
    },
    {
      accessorKey: "Address",
      header: "Address",
      cell: ({ row }: { row: any }) => (
        <div className="capitalize">
          <p style={{ textDecoration: "" }}>{row.getValue("Address")}</p>
        </div>
      ),
    },
    {
      accessorKey: "Contact",
      header: "Contact",
      cell: ({ row }: { row: any }) => (
        <div className="capitalize">
          <p style={{ textDecoration: "" }}>{row.getValue("Contact")}</p>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: ({ row }: { row: any }) => {
        const amount = row.getValue("amount");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className=" font-medium text-[#4B5563]">{formatted}</div>;
      },
    },
    {
      header: "ACTIONS",
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: any }) => (
        <Button
          variant="outline"
          className="w-24 text-[12px] rounded-full"
          onClick={() => handleViewClick(row)}
        >
          View
        </Button>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <Dropdown>
          <DropdownTrigger>
            <Button className=" border-none bg-transparent hover:bg-transparent">
              <BsThreeDotsVertical className="text-[#000]" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">Edit</DropdownItem>
            <DropdownItem key="copy">Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];
  return (
    <>
      <div>
        <h1 className="text-[#DE8B02] text-[34px] font-semibold">
          Donation List
        </h1>
        <p className="text-[#9898A3] text-[14px]">
          Organize and Manage Donation List
        </p>
        <DataTable
          data={filterSearchData}
          columns={columnsWithCheckboxAndAction}
          tableAction={<Tableaction />}
        />
      </div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader className="text-[23px] font-sans font-semibold">
            Donation
          </DialogHeader>
          <hr />
          {selectedDonation && (
            <div className="w-full mx-auto p-6 bg-white rounded-lg">
              <div className="flex flex-col justify-start gap-4">
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Donation ID:</p>
                  <p className="text-lg font-medium">
                    {selectedDonation.DonationId}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Full Name:</p>
                  <p className="text-lg font-medium">
                    {selectedDonation.DonorName}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Donation Type:</p>
                  <p className="text-lg font-medium">
                    {selectedDonation.DonorType}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Contact Number:</p>
                  <p className="text-lg font-medium">
                    {selectedDonation.Contact}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Address:</p>
                  <p className="text-lg font-medium">
                    {selectedDonation.Address}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Total Amount:</p>
                  <p className="text-lg font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(selectedDonation.amount)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Payment Date:</p>
                  <p className="text-lg font-medium">9 Aug 2024 14:00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Payment Mode:</p>
                  <p className="text-lg font-medium">Paid Via Gpay</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Location:</p>
                  <p className="text-lg font-medium">Chennai</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500 font-semibold">Email Id:</p>
                  <p className="text-lg font-medium">abc@gmail.com</p>
                </div>
                <div className="flex justify-between mb-3">
                  <p className="text-gray-500 font-semibold">Note:</p>
                  <p className="font-normal">
                    A field for donors to leave a personal message
                  </p>
                </div>
                <hr />
              </div>
            </div>
          )}
          <DialogFooter>
            {/* Additional footer actions can go here */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Donation;
