import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NoteView from "./NoteView"; 

export default async function NotePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) notFound();

  // Pass the note data to the client component
  return <NoteView note={note} />;
}