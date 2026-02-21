"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ContactMethod } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  methods: readonly ContactMethod[];
  onSelect: (method: ContactMethod) => void;
};

export const MobileDialog = ({
  open,
  onOpenChange,
  methods,
  onSelect,
}: Props) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredMethods = useMemo(
    () =>
      methods.filter((m) =>
        m.label.toLowerCase().includes(search.toLowerCase())
      ),
    [methods, search]
  );

  const selectedMethod = methods.find((m) => m.id === selectedId);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Dialog */}
          <motion.div
            className="fixed bottom-0 left-0 w-full z-50 flex justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="w-full h-3/4 bg-white rounded-t-lg shadow-xl flex flex-col relative">
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenChange(false);
                }}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 z-50"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              {/* Header */}
              <div className="border-b px-6 py-4 text-center">
                <h2 className="text-base font-semibold">
                  Preferred Contact Method
                </h2>
                <p className="text-sm text-gray-500">
                  Select your preferred way for the agent to get in touch.
                </p>
              </div>

              {/* Search */}
              <div className="px-6 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search contact method"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                  focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9]"
                />
              </div>

              {/* Methods */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {filteredMethods.length === 0 && (
                  <p className="text-center text-sm text-gray-400">
                    No results found
                  </p>
                )}
                {filteredMethods.map((method) => {
                  const checked = method.id === selectedId;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedId(method.id)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-sm transition
                      ${
                        checked
                          ? "border-[#7F56D9] bg-[#7F56D9]/5"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={method.icon}
                          alt={method.label}
                          className="h-5 w-5"
                        />
                        <span className="font-medium text-gray-800">
                          {method.label}
                        </span>
                      </div>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          checked ? "border-[#7F56D9]" : "border-gray-300"
                        }`}
                      >
                        {checked && (
                          <span className="h-2 w-2 rounded-full bg-[#7F56D9]" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex justify-center px-6 py-4">
                <button
                  type="button"
                  disabled={!selectedMethod}
                  onClick={() => {
                    if (!selectedMethod) return;
                    onSelect(selectedMethod);
                    onOpenChange(false);
                    setSearch("");
                    setSelectedId(null);
                  }}
                  className="w-full rounded-md bg-[#7F56D9] py-2 text-sm font-medium text-white
                  transition hover:bg-[#6d48c7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Choose
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
