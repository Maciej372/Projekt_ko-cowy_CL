import React from "react";
import { FcCheckmark, FcCancel } from "react-icons/fc";

const TableRow = ({ date, index, onStatusChange, onNoteClick, note }) => {
  const handleStatusChange = (status) => {
    onStatusChange(index, status);
  };

  const handleNoteClick = () => {
    onNoteClick(index);
  };

  return (
    <tr className="border-b border-gray-300">
      <td
        className="py-2 px-4"
        style={{
          backgroundColor:
            note.status === "present"
              ? "#99ff9e"
              : note.status === "absent"
              ? "#ffd6cc"
              : "#f0f0f0",

          color: "black",
        }}
      >
        <p className="font-semibold text-center">
          {new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate()
          ).toLocaleDateString()}
        </p>
      </td>
      <td className="py-2 px-4">
        <button
          onClick={() => handleStatusChange("present")}
          className="icon-button"
        >
          <div>
            <FcCheckmark className="text-green-600 w-[45px]" />
          </div>
        </button>
        <button
          onClick={() => handleStatusChange("absent")}
          className="icon-button"
        >
          <div>
            <FcCancel className="text-red-600" />
          </div>
        </button>
      </td>
      <td className="py-2 px-4 cursor-pointer" onClick={handleNoteClick}>
        {note.text || (
          <button className=" text-black bg-transaprent py-2 px-4 rounded-md transition duration-300">
            Dodaj uwagę
          </button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
