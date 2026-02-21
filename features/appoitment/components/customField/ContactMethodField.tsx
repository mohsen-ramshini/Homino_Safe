"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ContactMethod } from "../../types";
import { ContactMethodDialog } from "../dialog/ContactMethodDialog";
import { MobileDialog } from "../dialog/ContactMethodMobileDialog";
import { useMobile } from "@/lib/hooks/useMobile";
import { useContactMethods } from "../../api/use-contact-methods";
import { buildContactMethods } from "@/lib/utils";

type Props = {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: boolean;
  defaultMethod?: ContactMethod | null;
};

export const ContactMethodField = ({ register, setValue, error, defaultMethod  }: Props) => {
  const isMobile = useMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(defaultMethod ?? null);


  const {
    data: contactData,
    isFetching,
    status,
  } = useContactMethods();

  const isLoading = status === "pending" || isFetching;
  const hasError = status === "error";

  const CONTACT_METHODS = useMemo(() => {
    return buildContactMethods(contactData);
  }, [contactData]);

  const handleSelect = (method: ContactMethod) => {
    setSelectedMethod(method);
    setValue("contactMethod", method.id);
    setValue("contactValue", "");
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    if (isLoading || hasError) return;
    setDialogOpen(true);
  };

    useEffect(() => {
    if (defaultMethod) {
      setSelectedMethod(defaultMethod);
      setValue("contactMethod", defaultMethod.id);
    }
  }, [defaultMethod, setValue]);

  return (
    <>
      <div>
        <label
          className={`block text-sm font-medium ${
            error || hasError ? "text-red-500" : "text-gray-700"
          }`}
        >
          Preferred Contact Method <span className="text-[#7F56D9]">*</span>
        </label>

        <div
          className={`mt-1 flex overflow-hidden rounded-md focus-within:ring-1 px-0.5 ${
            error || hasError
              ? "border border-red-500"
              : "border border-gray-300 focus-within:border-[#7F56D9] focus-within:ring-[#7F56D9]"
          }`}
        >
          <input
            type={selectedMethod?.type ?? "text"}
            placeholder={
              isLoading
                ? "Loading contact methods..."
                : hasError
                ? "Failed to load contact methods"
                : selectedMethod?.placeholder ?? "Select a contact method"
            }
            {...register("contactValue")}
            disabled={isLoading || hasError || !selectedMethod}
            className="flex-1 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none disabled:bg-gray-50"
          />

          <button
            type="button"
            onClick={handleOpenDialog}
            disabled={isLoading || hasError}
            className="flex items-center gap-2 bg-gray-50 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Loading..."
              : hasError
              ? "Error"
              : selectedMethod
              ? selectedMethod.label
              : "Method"}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {hasError && (
          <p className="mt-1 text-sm text-red-500">
            Unable to load contact methods. Please try again.
          </p>
        )}
      </div>

      {!isLoading && !hasError && (
        <>
          {isMobile ? (
            <MobileDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              methods={CONTACT_METHODS}
              onSelect={handleSelect}
            />
          ) : (
            <ContactMethodDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              methods={CONTACT_METHODS}
              onSelect={handleSelect}
            />
          )}
        </>
      )}
    </>
  );
};
