import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link"; // 1. Import Link

export default async function NoteList() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return null;

  const notes = await prisma.note.findMany({
    where: { staffId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Your Recent Notes</h3>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes generated yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            // 2. Wrap the li in the Link component
            <li key={note.id}>
              <Link 
                href={`/dashboard/teacher/notes/${note.id}`} 
                className="block p-3 border rounded hover:bg-gray-50 transition"
              >
                <p className="font-medium text-blue-700">{note.topic}</p>
                <p className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}