"use client";

import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email: identifier,
        password: password,
        redirect: false, // Important: prevents automatic redirect
      });

      if (result?.error) {
        setError("Invalid login credentials. Please check your email or registration number.");
        setIsPending(false);
      } else {
        // Successful login: Redirect to dashboard and refresh to load the session
        router.push("/dashboard?school=school-01");
        router.refresh(); 
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Login</h1>
        
        <input 
          name="identifier" 
          placeholder="Email or Reg No" 
          className="w-full border p-3 mb-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          required 
        />
        
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          className="w-full border p-3 mb-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
          required 
        />
        
        {error && (
          <p className="text-red-500 text-sm mb-4 font-medium bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}
        
        <button 
          type="submit"
          disabled={isPending} 
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isPending ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}