import React from "react";
import { Button } from "../../common/Button/Button";
import { DropdownSelector } from "../../common/DropdownSelector/DropdownSelector";
import { Textbox } from "../../common/Textbox/Textbox";

interface AddStudentFormProps {
  onSubmit: (data: {
    studentId: string;
    name: string;
    course: string;
    year: string;
    section: string;
    rfid: string;
  }) => void;
  onCancel: () => void;
}

export const AddStudentForm = ({ onSubmit, onCancel }: AddStudentFormProps) => {
  const courseOptions = [
    { value: "bsit", label: "BSIT" },
    { value: "bshm", label: "BSHM" },
    { value: "bscrim", label: "BSCrim" },
  ];

  const yearOptions = [
    { value: "1", label: "Year 1" },
    { value: "2", label: "Year 2" },
    { value: "3", label: "Year 3" },
    { value: "4", label: "Year 4" },
  ];

  const sectionOptions = [
    { value: "a", label: "Section A" },
    { value: "b", label: "Section B" },
    { value: "c", label: "Section C" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      studentId: formData.get("studentId") as string,
      name: formData.get("name") as string,
      course: formData.get("course") as string,
      year: formData.get("year") as string,
      section: formData.get("section") as string,
      rfid: formData.get("rfid") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-base font-semibold mb-6">Add New Student</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <Textbox
            name="studentId"
            placeholder="Enter student ID (e.g. 23-0001)"
            className="w-full py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Textbox
            name="name"
            placeholder="Enter full name (e.g. John Doe)"
            className="w-full py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Course
          </label>
          <DropdownSelector
            name="course"
            options={courseOptions}
            placeholder="Select course"
            className="!w-full py-1.5"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Year Level
          </label>
          <DropdownSelector
            name="year"
            options={yearOptions}
            placeholder="Select year"
            className="!w-full py-1.5"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Section
          </label>
          <DropdownSelector
            name="section"
            options={sectionOptions}
            placeholder="Select section"
            className="!w-full py-1.5"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            RFID
          </label>
          <Textbox
            name="rfid"
            placeholder="Enter RFID (optional)"
            className="w-full py-2"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          label="Cancel"
          variant="secondary"
          className="flex-1 py-2"
          onClick={onCancel}
        />
        <Button
          type="submit"
          label="Add Student"
          variant="primary"
          className="flex-1 py-2 bg-zinc-700 text-white hover:bg-zinc-600"
        />
      </div>
    </form>
  );
};
