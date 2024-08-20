"use client";
import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

interface SignInFormData {
  email: string;
  password: string;
}

const SignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
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
      // Sign in the user with email and password
    const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push('/');
      // Generate a token (using the user's UID as a simple token)
    const token = user.uid;

    // Set the token in localStorage
    localStorage.setItem("token", token);
    if (token) {
      // Reference the user's document in the 'users' collection using the token (user's UID)
      const userRef = doc(db, 'admin', token);
      
      // Get the user's document
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Extract the churchId from the user document
        const storedChurchId = userDoc.data().churchId;
    
        // Store the churchId in local storage as 'storedChurchId'
        localStorage.setItem('storedChurchId', storedChurchId);
      } else {
        console.error('No such document!');
      }
    }
    
    window.location.reload(); // Reload the page after deleting the token
    } catch (err) {
      setError('Failed to sign in. Please check your credentials and try again.');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your church account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="space-y-2">
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
        <div className="space-y-2 relative">
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
      <CardFooter className="flex flex-col space-y-2">
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)}
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;