import React, { useState } from "react";
import { Button } from "../../common/Button/Button";
import { DropdownSelector } from "../../common/DropdownSelector/DropdownSelector";
import { Textbox } from "../../common/Textbox/Textbox";

interface StudentProps {
  studentId: string;
  name: string;
  course: string;
  year: string;
  section: string;
  rfid?: string;
}

interface EditStudentFormProps {
  onSubmit: (data: StudentProps) => void;
  onCancel: () => void;
  initialData: StudentProps;
}

export const EditStudentForm = ({
  onSubmit,
  onCancel,
  initialData,
}: EditStudentFormProps) => {
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

  const [formData, setFormData] = useState({
    studentId: initialData.studentId,
    name: initialData.name,
    course: initialData.course,
    year: initialData.year,
    section: initialData.section,
    rfid: initialData.rfid || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentId: formData.studentId,
      name: formData.name,
      course: formData.course,
      year: formData.year,
      section: formData.section,
      rfid: formData.rfid,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-base font-semibold mb-6">Edit Student</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <Textbox
            name="studentId"
            placeholder="Enter student ID"
            className="w-full py-2"
            value={formData.studentId}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Textbox
            name="name"
            placeholder="Enter full name"
            className="w-full py-2"
            value={formData.name}
            onChange={handleChange}
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
            value={formData.course.toLowerCase()}
            onChange={handleDropdownChange("course")}
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
            value={formData.year}
            onChange={handleDropdownChange("year")}
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
            value={formData.section.toLowerCase()}
            onChange={handleDropdownChange("section")}
          />
        </div>

        <div>
          <label
            htmlFor="rfid"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            RFID Tag
          </label>
          <Textbox
            name="rfid"
            placeholder="Enter RFID tag"
            className="w-full py-2"
            value={formData.rfid}
            onChange={handleChange}
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
          label="Save Changes"
          variant="primary"
          className="flex-1 py-2 bg-zinc-700 text-white hover:bg-zinc-600"
        />
      </div>
    </form>
  );
};
