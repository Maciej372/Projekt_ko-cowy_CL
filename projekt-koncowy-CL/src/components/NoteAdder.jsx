import React, { useState } from "react";

const NoteAdder = ({ onSaveNote, onCancel }) => {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (note.length <= 200) {
      onSaveNote(note);
      setNote("");
    } else {
      alert("Notatka nie może przekraczać 200 znaków.");
    }
  };

  return (
    <div className="mt-4">
      <textarea
        maxLength="200"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Dodaj uwagi"
        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <div className="mt-2 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mr-2"
        >
          Dodaj
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default NoteAdder;
