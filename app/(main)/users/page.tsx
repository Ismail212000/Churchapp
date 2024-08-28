
"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FiPlusCircle, FiX } from "react-icons/fi";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { fetchUsers, deleteUser } from '../../../components/actions/users';
import DataTable from "@/components/datatable/table";
import { IoMdSearch } from "react-icons/io";
import { IoFilterSharp, IoPrintSharp } from "react-icons/io5";
import { MdOutlineArrowCircleDown } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { createUserWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import emailjs from 'emailjs-com';
import CustomButton from "@/components/customebutton";


interface FamilyMember {
  name: string;
  relationship: string;
  gender: string;
  age: string;
}

interface UserData {
  id: string;
  profilePhoto: string | null;
  familyHeadName: string;
  contact: string;
  email: string;
  password: string;
  address: string;
  members: FamilyMember[];
  churchId?: string;
}


const OptionsDropdown: React.FC<{ userId: string; onEdit: () => void; onDelete: () => void }> = ({ userId, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };
  return (
    <div className="flex gap-2 relative">
      <Button variant="outline" className="p-2" onClick={toggleDropdown}>
        <BsThreeDotsVertical />
      </Button>
      {isOpen && (
        <>
          <div className="absolute right-0 bottom-0 mt-2 bg-white border rounded shadow-lg z-10">
            <button
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => {
                onEdit();
                closeDropdown();
              }}
            >
              Edit
            </button>
            <button
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => {
                onDelete();
                closeDropdown();
              }}
            >
              Delete
            </button>
          </div>
          <div
            className="fixed inset-0 bg-transparent"
            onClick={(e) => {
              // Check if click is outside of dropdown and button
              if (isOpen) {
                closeDropdown();
              }
            }}
          />
        </>
      )}
    </div>
  );
};
export default function Users() {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  // const [formVisible, setFormVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  const UserDetailModal: React.FC<{ user: UserData; onClose: () => void }> = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">User Details</h2>
          <Image src={user.profilePhoto || ""} alt="Profile" width={1200} height={1200} className="w-32 h-32 object-cover mb-4 mx-auto" />
          <p><strong>Family Head Name:</strong> {user.familyHeadName}</p>
          <p><strong>Contact:</strong> {user.contact}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>password:</strong> {user.password}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Members:</strong></p>
          <ul>
            {user.members && user.members.length > 0 ? (
              user.members.map((member, index) => (
                <li key={index}>
                  <strong>Name:</strong> {member.name}, <strong>Relationship:</strong> {member.relationship}, <strong>Gender:</strong> {member.gender}, <strong>Age:</strong> {member.age}
                </li>
              ))
            ) : (
              <li>No members</li>
            )}
          </ul>
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Close</button>
        </div>
      </div>
    );
  };

  console.log("process.env.REACT_APP_EMAILJS_SERVICE_ID", process.env.NEXT_APP_EMAILJS_SERVICE_ID)

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [edit, setEdit] = useState<boolean>(false)
  const [formData, setFormData] = useState<UserData>({
    id: "",
    profilePhoto: null,
    familyHeadName: "",
    contact: "",
    email: "",
    password: "",
    address: "",
    members: [], // Ensure this is an empty array
    churchId: "",
  });

  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [filterApplied, setFilterApplied] = useState(false); // New state for filter

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedChurchId = localStorage.getItem('storedChurchId');
    if (storedChurchId) {
      setFormData({ ...formData, churchId: storedChurchId })
    }
  }, [])

  useEffect(() => {
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
    const { familyHeadName, contact, email, password, address, members, churchId } = formData;

    if (!familyHeadName || !contact || !email || !password || !address || !churchId || members.some(member => !member.name || !member.relationship || !member.gender || !member.age)) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      if (!formData.id) {
        formData.id = uuidv4();
      }

      if (!edit) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created:', userCredential);

        try {
          await sendEmailVerification(user);
          console.log('Verification email sent successfully');
          alert('Verification email sent successfully. Please check your inbox.');
        } catch (verificationError: unknown) {
          console.error('Failed to send verification email:', verificationError);
          alert(`Failed to send verification email. Error: ${verificationError}`);
        }
      }
      if (edit) {
        await updateDoc(doc(db, "users", formData.id), {
          familyHeadName,
          contact,
          email,
          password,
          address,
          members,
          churchId,
        });
        setEdit(false)
        setShowForm(false);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      }
      const userData: UserData = {
        ...formData,
        id: formData.familyHeadName,
      };
      console.log("UserData:", userData)
      await setDoc(doc(db, "users", formData.familyHeadName), userData);
      setShowForm(false);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);

      try {
        const emailParams = {
          to_name: familyHeadName,
          to_email: email,
          from_name: "Your Service Name",
          message: `Welcome to our Church! Your email is ${email} and your password is ${password}. Your church ID is ${churchId}.`,
        };

        await emailjs.send(
          "service_f75rhao",
          "template_85uargp",
          emailParams,
          "GKPu2gKNs7pCFFcPJ"

        );

        console.log('Welcome email sent successfully', process.env.NEXT_APP_EMAILJS_SERVICE_ID);
        alert('Welcome email sent successfully.');
      } catch (emailError: unknown) {
        if (emailError instanceof Error) {
          console.error('Failed to send welcome email:', emailError.message);
          alert(`Failed to send welcome email. Error: ${emailError.message}`);
        } else {
          console.error('Failed to send welcome email:', emailError);
          alert('Failed to send welcome email. Please try again later.');
        }
      }

    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      alert(`An error occurred while saving the user. Error: ${error}`);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Get a reference to the storage service and a reference to the file path
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${file.name}`);

      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optionally, you can handle the upload progress here
          console.log(`Upload is ${Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Update form data with the download URL of the profile photo
            setFormData((prev) => ({
              ...prev,
              profilePhoto: downloadURL,
            }));
          });
        }
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Allow only numeric input for contact
    if (name === "contact") {
      if (/^[0-9]*$/.test(value)) {
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setError(null);
      } else {
        setError("Please enter a valid contact number.");
      }
    } else {
      // Handle other inputs
      setFormData(prevData => ({ ...prevData, [name]: value }));
      setError(null);
    }
  };

  // const handleSelectChange = (index: number, field: string, value: string) => {
  //   setFormData(prev => {
  //     const updatedMembers = [...prev.members];
  //     updatedMembers[index] = { ...updatedMembers[index], [field]: value };
  //     return { ...prev, members: updatedMembers };
  //   });
  // };

  // Update handleFamilyMemberChange function
  const handleFamilyMemberChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedMembers = [...prev.members];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      return { ...prev, members: updatedMembers };
    });
  };


  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setEdit(true)
    setFormData(user);
    setShowForm(true);
  };
  const handleDeleteClick = async (userId: string) => {
    try {
      await deleteUser(userId);
      // Refresh user list after deletion
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  const handleViewClick = (user: UserData) => {
    setUserDetails(user);
    setShowModal(true);
  };
  const handleAddFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [
        ...(prev.members || []), // Ensure members is treated as an array
        { name: "", relationship: "", gender: "", age: "" },
      ],
    }));
  };



  const handleRemoveFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const columns = useMemo(() => [
    { accessorKey: "familyHeadName", header: "Family Head Name" },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "members", header: "Members", cell: ({ row }: { row: any }) => (row.original.members || []).length },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Button onClick={() => handleViewClick(row.original)}>View</Button>
        </div>
      ),
    },
    {
      id: "options",
      header: "Options",
      cell: ({ row }: { row: any }) => (
        <OptionsDropdown
          userId={row.original.id}
          onEdit={() => handleEditClick(row.original)}
          onDelete={() => row.original.id && handleDeleteClick(row.original.id)}
        />
      ),
    },
  ], [handleEditClick, handleDeleteClick, handleViewClick]);
  // Filter users based on search value
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchValue.toLowerCase();
      return (
        (user.familyHeadName && user.familyHeadName.toLowerCase().includes(searchLower)) ||
        (user.contact && user.contact.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.password && user.password.toLowerCase().includes(searchLower))
      );

    });
  }, [searchValue, users]);

  // Filtered data based on applied filter state
  const displayedUsers = filterApplied ? filteredUsers : users;

  const Tableaction: React.FC = () => {
    return (
      <div className="w-full flex items-center gap-2">
        <div className="bg-[#fff] rounded-[13px] pl-1 pr-1 border border-[#CBD2DC80] w-[65%] h-[40px] flex items-center gap-2">
          <IoMdSearch className="text-[25px]" />
          <input
            type="search"
            placeholder="Search for user"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="bg-transparent w-full outline-none h-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]"
            onClick={() => setFilterApplied(!filterApplied)} // Toggle filter application
          >
            <IoFilterSharp className="text-[#280559]" /> <span>Filters</span>
          </button>
          <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
            <MdOutlineArrowCircleDown className="text-[#280559]" /> <span>Export</span>
          </button>
          <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
            <IoPrintSharp className="text-[#280559]" /> <span>Print</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl">Users</h1>
          <p className="text-[#9898A3] text-xs">View all church users here</p>
        </div>

        <CustomButton
          className="bg-[#280559] text-white flex gap-2"
          onClick={() => {
            const storedChurchId = localStorage.getItem('storedChurchId') || "";
            setShowForm(true);
            setFormData({
              id: "",
              profilePhoto: null,
              familyHeadName: "",
              contact: "",
              email: "",
              password: "",
              address: "",
              members: [], // Reset members to an empty array
              churchId: storedChurchId

            });
          }}

        >
          <FiPlusCircle className="mb-[3px]" />
          <p>Create New User</p>
        </CustomButton>
      </div>
      <DataTable
        data={displayedUsers} // Use filtered or unfiltered data based on filter state
        columns={columns}
        tableAction={<Tableaction />}
      />
      {showModal && userDetails && (
        <UserDetailModal user={userDetails} onClose={() => setShowModal(false)} />
      )}
      <div className="sm:mt-4 md:mt-0 sm:px-4 md:px-8  bg-white rounded-3xl relative">
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {formData.profilePhoto && (
                  <Image
                    src={formData.profilePhoto}
                    alt="Profile Preview"
                    width={1200}
                    height={1200}
                    className="w-32 h-32 object-cover mb-2"
                  />
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="familyHeadName">Family Head Name</Label>
                <Input
                  id="familyHeadName"
                  name="familyHeadName"
                  value={formData.familyHeadName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label>Family Members</Label>
                {(formData.members || []).map((member, index) => (
                  <div key={index} className="mb-2 border p-2 rounded">
                    <div className=" gap-2 mb-2">
                      <div className="flex-1">
                        <Label htmlFor={`memberName${index}`}>Name</Label>
                        <Input
                          type="text"
                          id={`memberName${index}`}
                          value={member.name}
                          onChange={(e) => handleFamilyMemberChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`memberRelationship${index}`}>Relationship</Label>
                        <select
                          id={`memberRelationship${index}`}
                          value={member.relationship}
                          onChange={(event) => handleFamilyMemberChange(index, "relationship", event.target.value)}
                          className="border rounded p-2 w-full"
                        >
                          <option value="" disabled>Select relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Sibling">Sibling</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label>Gender</Label>
                      <RadioGroup
                        value={member.gender}
                        onValueChange={(value) => handleFamilyMemberChange(index, "gender", value)}
                      >
                        <div className="flex gap-4">
                          <RadioGroupItem value="Male" id={`male${index}`} />
                          <Label htmlFor={`male${index}`}>Male</Label>
                          <RadioGroupItem value="Female" id={`female${index}`} />
                          <Label htmlFor={`female${index}`}>Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`memberAge${index}`}>Age</Label>
                      <Input
                        type="text"
                        id={`memberAge${index}`}
                        value={member.age}
                        onChange={(e) => handleFamilyMemberChange(index, "age", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      className="ml-2 mt-2"
                      onClick={() => handleRemoveFamilyMember(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="mt-2"
                >
                  Add Family Member
                </Button>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="mr-2">Save</Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline">Cancel</Button>
              </div>
            </form>
          </div>

        )}
      </div>
    </>
  );

}
function getVerificationLink(user: User, arg1: string) {
  throw new Error("Function not implemented.");
}
