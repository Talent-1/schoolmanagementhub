'use client';

export default function ResetPasswordButton({ studentId }: { studentId: string }) {
  const handleReset = async () => {
    // You can replace this with a Server Action call
    if (confirm("Are you sure you want to reset this student's password?")) {
      console.log(`Resetting for: ${studentId}`);
    }
  };

  return (
    <button 
      onClick={handleReset}
      className="bg-red-100 text-red-700 px-4 py-2 rounded font-bold hover:bg-red-200 transition"
    >
      Reset Student Password
    </button>
  );
}