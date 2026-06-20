import NoteGenerator from "@/components/features/notes/NoteGenerator";
import NoteList from "@/components/features/notes/NoteList";

export default function TeacherNotesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Lesson Note Center</h1>
        <p className="text-gray-600">Generate notes using AI or view your history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <NoteGenerator />
        </div>

        {/* History Section */}
        <div className="lg:col-span-2">
          <NoteList />
        </div>
      </div>
    </div>
  );
}