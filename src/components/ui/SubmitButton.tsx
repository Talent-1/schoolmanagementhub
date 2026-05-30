"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  loadingText: string;
}

export function SubmitButton({ text, loadingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full p-3 rounded-lg text-white font-bold transition flex items-center justify-center ${
        pending 
          ? "bg-blue-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700 active:scale-95"
      }`}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}