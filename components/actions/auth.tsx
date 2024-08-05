import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
  } from "firebase/auth";
  import { auth } from "../../firebase";
 // import { getDocs, collection } from "firebase/firestore";
  export const RegisterUser = async (email: string, password: string) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const data = await sendEmailVerification(user.user);
      console.log(data, "data");
      return user;
    } catch (error) {
      return error;
    }
  };
  
  export const LoginUser = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      
      return user;
    } catch (error) {
      return error;
    }
  };