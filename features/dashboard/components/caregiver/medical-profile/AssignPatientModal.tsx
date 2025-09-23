// AssignPatientModal.tsx
"use client";

import { FC, ReactNode, useState } from "react";

interface AssignPatientModalProps {
  trigger: ReactNode;
  onAssign: (patientId: number) => void;
}

export const AssignPatientModal: FC<AssignPatientModalProps> = ({ trigger, onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleAssign = () => {
    if (selectedPatientId !== null) {
      onAssign(selectedPatientId);
      closeModal();
    }
  };

  return (
    <>
      <span onClick={openModal} style={{ cursor: "pointer" }}>
        {trigger}
      </span>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl mb-4">Assign Patient</h3>
            {/* اینجا مثلا یک لیست ساده یا فرم انتخاب بیمار */}
            <select
              className="w-full mb-4 border p-2 rounded"
              onChange={(e) => setSelectedPatientId(Number(e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>
                Select patient
              </option>
              <option value="1">Patient 1</option>
              <option value="2">Patient 2</option>
              <option value="3">Patient 3</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={selectedPatientId === null}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
