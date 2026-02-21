"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ContactMethod } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  methods: readonly ContactMethod[];
  onSelect: (method: ContactMethod) => void;
};

export const ContactMethodDialog = ({
  open,
  onOpenChange,
  methods,
  onSelect,
}: Props) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredMethods = useMemo(() => {
    return methods.filter((m) =>
      m.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [methods, search]);

  const selectedMethod = useMemo(
    () => methods.find((m) => m.id === selectedId) ?? null,
    [methods, selectedId]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-137 h-140.75 max-w-none p-0">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-4 h-22 shrink-0">
          <DialogTitle className="text-base font-semibold">
            Preferred Contact Method
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Select your preferred way for the agent to get in touch.
          </p>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 pt-4 h-22 shrink-0">
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
        <div className="h-79.75 overflow-y-auto px-6 py-4 space-y-2">
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
                {/* Left */}
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

                {/* Radio */}
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border
                    ${checked ? "border-[#7F56D9]" : "border-gray-300"}`}
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
        <div className="flex items-center justify-center h-20 shrink-0 border-t px-6">
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
            className="w-60 h-11 rounded-md bg-[#7F56D9] text-sm font-medium text-white
      transition hover:bg-[#6d48c7]
      disabled:cursor-not-allowed disabled:opacity-50 mb-3.5"
          >
            Choose
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
