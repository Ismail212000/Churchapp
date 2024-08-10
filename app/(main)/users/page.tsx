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
//import { UserData } from '../../../types'; // Import renamed type

interface UserData {
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
export default function Events() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<UserData>({
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
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        // Do not close if the click is inside the Select component
        const selectElement = document.querySelector('.select-trigger') as HTMLElement;
        if (selectElement && selectElement.contains(event.target as Node)) {
          return;
        }
        setShowForm(false);
      }
    };
    
    
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { familyHeadName, contact, email, address, memberName, relationship, gender, age } = formData;
    if (familyHeadName && contact && email && address && relationship && gender && age) {
      try {
        await saveUser(formData);
        console.log("Form data submitted:", formData);
        setShowForm(false);
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
  <Select
    name="relationship"
    value={formData.relationship}
    onValueChange={(value: string) => handleSelectChange("relationship", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Relationship" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="spouse">Spouse</SelectItem>
        <SelectItem value="child">Child</SelectItem>
        <SelectItem value="parent">Parent</SelectItem>
        <SelectItem value="sibling">Sibling</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>


              <div>
                <Label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</Label>
                <RadioGroup
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value: string) => handleSelectChange("gender", value)}
                  className="space-y-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="ml-2">Male</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="ml-2">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="age" className="block text-sm font-medium mb-1">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit" className="bg-[#280559] text-white px-4 py-2 rounded">
                  <FiUpload className="inline mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="px-4 py-2 rounded">
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
