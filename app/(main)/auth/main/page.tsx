"use client";
import React, { useState } from 'react';
import SignUpForm from '../../../../components/auth/signup';
import SignInForm from '../../../../components/auth/signin';

const MainComponent = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex h-screen bg-zinc-800">
      <div className="w-1/2 p-24 text-white">
        <div className="grid">
          <h1 className="text-2xl font-bold">Welcome to</h1>
          <h2 className="text-4xl font-bold">Church App</h2>
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center bg-slate-50">
        <div className="w-1/2 space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? 'Login Account' : 'Create Account'}
            </h1>
          </div>
          {isLogin ? <SignInForm /> : <SignUpForm />}
          <div className="text-center">
            <p className="text-sm text-muted">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
