"use client"
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/features/medical-profile/api/useGetMedicalProfile";
import MedicationsList from "@/features/medical-profile/components/MedicationsList";
import { AlertTriangle, Pill } from "lucide-react";
import MedicationsCards from "./MedicationsCards";
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
    <Card className="border-muted-foreground/20 shadow-sm hover:shadow-md transition duration-300 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <CardHeader className="flex items-center space-x-2 pb-2">
        <Pill className="h-5 w-5 text-muted-foreground dark:text-blue-400" />
        <CardTitle className="text-md font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-sm leading-relaxed space-y-2">
        {children}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="animate-spin w-10 h-10 text-blue-500 mb-4 flex items-center justify-center">
          <LoaderIcon size={40} />
        </div>
        <span className="text-lg text-muted-foreground">Loading medicine data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center mt-10">
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white dark:bg-zinc-800 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Medicine Management</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Manage your medications and prescriptions here.
      </p>

      <SectionCard title="Medications">
        {data.medications.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No medications recorded.</p>
        ) : (
          <MedicationsCards medications={data.medications} />
        )}
      </SectionCard>
    </div>
  );
};

export default Medicine;
