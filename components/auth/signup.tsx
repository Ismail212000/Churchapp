"use client";
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, where, getDocs, collection, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface SignUpFormData {
  churchId: string;
  churchName: string;
  email: string;
  password: string;
  name: string;
  // role: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    churchId: '',
    churchName: '',
    email: '',
    password: '',
    name: '',
    // role: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // Check if the church with the provided name already exists
      const churchQuery = query(
        collection(db, 'churches'),
        where('churchName', '==', formData.churchName)
      );
      const churchSnapshot = await getDocs(churchQuery);

      let churchId = formData.churchId;

      if (!churchSnapshot.empty) {
        // If the church exists, use its ID
        const existingChurchDoc = churchSnapshot.docs[0];
        churchId = existingChurchDoc.data().churchId;
      } else {
        // If the church doesn't exist, generate a new ID and create a new church document
        churchId = churchId || Math.floor(100000 + Math.random() * 900000).toString();
        await setDoc(doc(db, 'churches', churchId), {
          churchId: churchId,
          churchName: formData.churchName,

        });
      }

      // Create a new user with Firebase Authentication
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Store the user under the church's subcollection
      const userRef = collection(db,'admin');
      await setDoc(doc(userRef, user.uid), {
        churchId: churchId,
        churchName: formData.churchName,
        email: formData.email,
        name: formData.name,
        // role: formData.role,
      });
      // Generate a token (you can use the user's UID as a simple token)
    const token = user.uid;
    if(token){
      await updateDoc(doc(db, 'churches', churchId), {
        UserId:token
  
      });
    }

    // // Set the token in localStorage
    // localStorage.setItem("token", token);
    // / Store user details in localStorage
    const userDetails = {
      churchId,
      churchName: formData.churchName,
      email: formData.email,
      name: formData.name,
      token:token
      // Add other relevant details if needed
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
      // Redirect to the sign-in page after successful sign-up
      router.push('/auth/signin');
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        {/* <CardDescription>Create a new account for your church.</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-1">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {/* <div className="space-y-0">
          <Label htmlFor="church-id">Church ID (optional)</Label>
          <Input
            id="church-id"
            name="churchId"
            value={formData.churchId}
            onChange={handleChange}
            placeholder="Enter church ID or leave blank for auto-generation"
          />
        </div> */}
        <div className="space-y-0">
          <Label htmlFor="church-name">Church Name</Label>
          <Input
            id="church-name"
            name="churchName"
            value={formData.churchName}
            onChange={handleChange}
            placeholder="Enter your church name"
          />
        </div>
        <div className="space-y-0">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>
        {/* <div className="space-y-0">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter your role (e.g.,Admin ,Pastor)"
          />
        </div> */}
        <div className="space-y-0">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-0 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center text-lg leading-5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-0">
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)}
        >
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
