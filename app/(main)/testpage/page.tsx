"use client";
import React from 'react';
import emailjs from 'emailjs-com';

interface EmailParams {
  to_name: string;
  to_email: string;
  from_name: string;
  message: string;
}

const sendWelcomeEmail = async (emailParams: EmailParams) => {
  try {
    console.log('Sending email with params:', emailParams);
    await emailjs.send(
      'service_f75rhao',      
      'template_85uargp',    
      emailParams as unknown as Record<string, unknown>, 
      'GKPu2gKNs7pCFFcPJ'    
    );
    console.log('Welcome email sent successfully');
    return 'Welcome email sent successfully.';
  } catch (emailError) {
    if (emailError instanceof Error) {
      console.error('Failed to send welcome email:', emailError.message);
      throw new Error(`Failed to send welcome email. Error: ${emailError.message}`);
    } else {
      console.error('Failed to send welcome email:', emailError);
      throw new Error('Failed to send welcome email. Please try again later.');
    }
  }
};

const YourComponent: React.FC = () => {
  const handleClick = async () => {
    const emailParams: EmailParams = {
      to_name: 'John Doe',
      to_email: 'manoj@digisailor.com',
      from_name: ' Name',
      message: 'Welcome to our service! Your account has been created.',
    };

    try {
      const response = await sendWelcomeEmail(emailParams);
      alert(response);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Send Welcome Email</button>
    </div>
  );
};

export default YourComponent;

// import React, { useState, FormEvent } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
// import { useRouter } from 'next/navigation';

// interface SignUpFormData {
//   churchId: string;
//   churchName: string;
//   email: string;
//   password: string;
// }

// const SignUpComponent = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState<SignUpFormData>({
//     churchId: '',
//     churchName: '',
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState<string>('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');

//     try {
//       // Generate a random ID if not provided
//       const generatedId = formData.churchId || Math.floor(100000 + Math.random() * 900000).toString();
      
//       // Simulating an API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // If successful, store the user data in localStorage
//       localStorage.setItem('churchId', generatedId);
//       localStorage.setItem('churchName', formData.churchName);
//       localStorage.setItem('email', formData.email);

//       // Redirect to dashboard or signin page
//       router.push('/signin');
//     } catch (err) {
//       setError('Failed to register. Please try again.');
//     }
//   };

//   return (
//     <div className="flex h-screen bg-zinc-800">
//       <div className="w-1/2 p-24 text-white">
//         <div className="grid">
//           <h1 className="text-2xl font-bold">Welcome to</h1>
//           <h2 className="text-4xl font-bold">Church App</h2>
//         </div>
//       </div>
//       <div className="flex flex-1 justify-center items-center bg-slate-50">
//         <div className="w-1/2 space-y-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Create Church Account
//             </h1>
//           </div>
//           <Card>
//             <CardHeader className="text-center">
//               <CardTitle>Sign Up</CardTitle>
//               <CardDescription>Create a new account for your church.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {error && <p className="text-red-500 text-center">{error}</p>}
//               <div className="space-y-2">
//                 <Label htmlFor="church-id">Church ID (optional)</Label>
//                 <Input
//                   id="church-id"
//                   name="churchId"
//                   value={formData.churchId}
//                   onChange={handleChange}
//                   placeholder="Enter church ID or leave blank for auto-generation"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="church-name">Church Name</Label>
//                 <Input
//                   id="church-name"
//                   name="churchName"
//                   value={formData.churchName}
//                   onChange={handleChange}
//                   placeholder="Enter your church name"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               <div className="space-y-2 relative">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                 />
//                 <div
//                   className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center text-lg leading-5 cursor-pointer"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-2">
//               <Button
//                 type="submit"
//                 className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                 onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)}
//               >
//                 Sign Up
//               </Button>
//             </CardFooter>
//           </Card>
//           <LoginLink />
//         </div>
//       </div>
//     </div>
//   );
// };

// const LoginLink = () => {
//   const router = useRouter();
  
//   return (
//     <div className="text-center">
//       <p className="text-sm text-muted">
//         Already have an account?{' '}
//         <span
//           onClick={() => router.push('/signin')}
//           className="text-primary cursor-pointer hover:underline"
//         >
//           Login
//         </span>
//       </p>
//     </div>
//   );
// };

// export default SignUpComponent;