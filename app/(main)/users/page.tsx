// page.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiPlusCircle, FiX, FiUpload } from "react-icons/fi";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { saveUser, fetchUsers } from '../../../components/actions/users';
import DataTable from "@/components/datatable/table";

interface UserData {
  id: string;
  profilePhoto: string | null;
  familyHeadName: string;
  contact: string;
  email: string;
  address: string;
  memberName: string;
  relationship: string;
  gender: string;
  age: string;
}

export default function Users() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [formVisible, setFormVisible] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    id: "",
    profilePhoto: null,
    familyHeadName: "",
    contact: "",
    email: "",
    address: "",
    memberName: "",
    relationship: "",
    gender: "",
    age: "",
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch users from Firestore when component mounts
    const loadUsers = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadUsers();

    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const selectElement = document.querySelector('.select-trigger') as HTMLElement;
        if (selectElement && selectElement.contains(event.target as Node)) {
          return;
        }
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, familyHeadName, contact, email, address, memberName, relationship, gender, age } = formData;
    if (id && familyHeadName && contact && email && address && relationship && gender && age) {
      try {
        await saveUser(formData);
        setShowForm(false);
        // Refresh user list after saving
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setFormData(user);
    setShowForm(true);
  };

  const columns = [
    // {
    //   accessorKey: "profilePhoto",
    //   header: "Profile Photo",
    //   cell: ({ value }: { value: string }) => (
    //     <img src={value || "/default-avatar.png"} alt="Profile" width={50} />
    //   ),
    // },
    { accessorKey: "familyHeadName", header: "Family Head Name" },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Address" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <Button onClick={() => handleEditClick(row.original)}>Edit</Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl">Users</h1>
          <p className="text-[#9898A3] text-xs">View all church users here</p>
        </div>

        <Button
          className="bg-[#280559] text-white flex gap-2"
          onClick={() => {
            setShowForm(true);
            setFormData({
              id: "",
              profilePhoto: null,
              familyHeadName: "",
              contact: "",
              email: "",
              address: "",
              memberName: "",
              relationship: "",
              gender: "",
              age: "",
            });
          }}
        >
          <FiPlusCircle />
          <p>Create New User</p>
        </Button>
      </div>
      <DataTable columns={columns} data={users} />
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8 h-screen bg-white rounded-3xl relative">
        {showForm && (
          <div
            ref={formRef}
            className="fixed inset-y-0 right-0 bg-white shadow-lg p-6 w-80 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New User</h2>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                <FiX />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="profilePhoto" className="block text-sm font-medium mb-1">Profile Photo</Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {formData.profilePhoto && (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile Photo Preview"
                    className="mt-2 w-24 h-24 object-cover border border-gray-300 rounded-md"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="familyHeadName" className="block text-sm font-medium mb-1">Family Head Name</Label>
                <Input
                  id="familyHeadName"
                  name="familyHeadName"
                  type="text"
                  value={formData.familyHeadName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <Label htmlFor="contact" className="block text-sm font-medium mb-1">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-1">Email ID</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <Label htmlFor="address" className="block text-sm font-medium mb-1">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <Label htmlFor="memberName" className="block text-sm font-medium mb-1">Family Member Name</Label>
                <Input
                  id="memberName"
                  name="memberName"
                  type="text"
                  value={formData.memberName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <Label htmlFor="relationship" className="block text-sm font-medium mb-1">Relationship</Label>
                <Select onValueChange={(value) => handleSelectChange("relationship", value)}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-md p-2">
                    <SelectValue placeholder="Select Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">Gender</Label>
                <RadioGroup
                  className="flex gap-4"
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  value={formData.gender}
                >
                  <Label className="flex items-center">
                    <RadioGroupItem value="Male" />
                    <span className="ml-2">Male</span>
                  </Label>
                  <Label className="flex items-center">
                    <RadioGroupItem value="Female" />
                    <span className="ml-2">Female</span>
                  </Label>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="age" className="block text-sm font-medium mb-1">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="text"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
