"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function DateSwitcher({ initialDate }: { initialDate: Date }) {
  const router = useRouter();
  return (
    <input 
      type="date" 
      defaultValue={format(initialDate, 'yyyy-MM-dd')}
      className="p-2 border rounded-xl"
      onChange={(e) => router.push(`/dashboard/teacher/attendance?date=${e.target.value}`)}
    />
  );
}