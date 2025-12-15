"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/features/medical-profile/api/useGetMedicalProfile";
import MedicationsCards from "./MedicationsCards";
import { AlertTriangle, Pill } from "lucide-react";
import { LoaderIcon } from "@/components/chat/icons";

const Medicine = () => {
  const { data, isLoading, error } = useProfile();

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex items-center space-x-2 pb-2">
        <Pill className="h-5 w-5 text-blue-600" />
        <CardTitle className="text-md font-semibold text-blue-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-gray-700 space-y-2">{children}</CardContent>
    </Card>
  );

  // ============================
  // Loading
  // ============================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LoaderIcon />
        <p className="text-blue-700 font-medium text-lg">Loading medicine data...</p>
      </div>
    );
  }

  // ============================
  // Error
  // ============================
  if (error || !data) {
    return (
      <div className="flex justify-center mt-12">
        <Alert variant="destructive" className="max-w-xl">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load medical record. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ============================
  // Main Layout
  // ============================
  return (
    <div className="mx-auto px-4 py-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-blue-800">Medicine Management</h1>
      <p className="text-gray-600 mb-6">
        Manage your medications and prescriptions here.
      </p>

      <SectionCard title="Medications">
        {data.medications.length === 0 ? (
          <p className="text-gray-700">No medications recorded.</p>
        ) : (
          <MedicationsCards medications={data.medications} />
        )}
      </SectionCard>
    </div>
  );
};

export default Medicine;
