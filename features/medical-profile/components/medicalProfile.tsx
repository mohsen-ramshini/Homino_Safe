"use client";

import { FC, JSX } from "react";
import { useProfile } from "@/features/medical-profile/api/useGetMedicalProfile";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  User,
  HeartPulse,
  Stethoscope,
  FileText,
  Pill,
  ActivitySquare,
} from "lucide-react";
import { LoaderIcon } from "@/components/chat/icons";
import { MedicationsList } from "./MedicationsList";

// Blue UI Icon Map
const iconMap: Record<string, JSX.Element> = {
  Demographics: <User className="h-5 w-5 text-blue-600 mr-2" />,
  Comorbidities: <HeartPulse className="h-5 w-5 text-blue-600 mr-2" />,
  Diagnosis: <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />,
  "Physician Notes": <FileText className="h-5 w-5 text-blue-600 mr-2" />,
  Medications: <Pill className="h-5 w-5 text-blue-600 mr-2" />,
  Symptoms: <ActivitySquare className="h-5 w-5 text-blue-600 mr-2" />,
};

const ProfileSection: FC = () => {
  const { data, isLoading, error } = useProfile();

  // ============================
  // Loading
  // ============================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoaderIcon />
        <p className="text-blue-700 font-medium text-lg">
          Loading medical profile...
        </p>
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
  // Section Card Styling
  // ============================
  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          {iconMap[title]}
          <CardTitle className="text-lg font-semibold text-blue-800">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <Separator className="bg-blue-100" />
      <CardContent className="pt-4 text-gray-700 leading-relaxed space-y-2">
        {children}
      </CardContent>
    </Card>
  );

  // ============================
  // Main Layout
  // ============================
  return (
    <div className="flex justify-center py-12 px-4 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="w-full max-w-6xl space-y-10">

        {/* Page Title */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-blue-800 tracking-tight">
            Medical Profile
          </h2>
          <p className="text-gray-500">
            Electronic Health Record Overview
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* DEMOGRAPHICS */}
          <SectionCard title="Demographics">
            <p>{data.demographics || "No demographics available."}</p>
          </SectionCard>

          {/* COMORBIDITIES */}
          <SectionCard title="Comorbidities">
            {Object.entries(data.comorbidities).length === 0 ? (
              <p>No comorbidities reported.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(data.comorbidities).map(([key, value]) => {
                  const isEmpty =
                    typeof value === "object" && Object.keys(value).length === 0;

                  return (
                    <li key={key}>
                      <strong className="text-blue-700">
                        {key.replace(/_/g, " ")}:
                      </strong>{" "}
                      {isEmpty ? "No data" : JSON.stringify(value)}
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          {/* DIAGNOSIS */}
          <SectionCard title="Diagnosis">
            <p>{data.diagnosis}</p>
          </SectionCard>

          {/* PHYSICIAN NOTES */}
          <SectionCard title="Physician Notes">
            <p>{data.physician_notes}</p>
          </SectionCard>

          {/* MEDICATIONS */}
          <SectionCard title="Medications">
            {data.medications.length === 0 ? (
              <p>No medications recorded.</p>
            ) : (
              <MedicationsList medications={data.medications} />
            )}
          </SectionCard>

          {/* SYMPTOMS */}
          <SectionCard title="Symptoms">
            {data.symptoms.length === 0 ? (
              <p>No symptoms reported.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {data.symptoms.map((symptom) => (
                  <li key={symptom.id}>
                    <strong className="text-blue-700">{symptom.name}</strong>{" "}
                    — Severity: {symptom.severity}
                    {symptom.notes && (
                      <span className="italic text-gray-600">
                        {" "}
                        ({symptom.notes})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
