import React from "react";
import { FcCheckmark, FcCancel } from "react-icons/fc";

const TableRow = ({ date, index, onStatusChange, onDateClick, note }) => {
  const handleStatusChange = (status) => {
    onStatusChange(index, status);
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
        onClick={() => onDateClick(index)}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          style={{
            color: "black",
            textDecoration: "none",
          }}
        >
          {new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate()
          ).toLocaleDateString()}
        </a>
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
      <td className="py-2 px-4">{note?.text}</td>
    </tr>
  );
};

export default TableRow;
