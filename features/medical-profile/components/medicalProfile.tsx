"use client";

import { FC, JSX } from "react";
import { useProfile } from "@/features/medical-profile/api/useGetMedicalProfile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  User,
  HeartPulse,
  Stethoscope,
  FileText,
  Pill,
  ActivitySquare,
} from "lucide-react";
import { MedicationsList } from "./MedicationsList";
import { LoaderIcon } from "@/components/chat/icons";

const iconMap: Record<string, JSX.Element> = {
  Demographics: <User className="h-5 w-5 text-muted-foreground mr-2" />,
  Comorbidities: <HeartPulse className="h-5 w-5 text-muted-foreground mr-2" />,
  Diagnosis: <Stethoscope className="h-5 w-5 text-muted-foreground mr-2" />,
  "Physician Notes": <FileText className="h-5 w-5 text-muted-foreground mr-2" />,
  Medications: <Pill className="h-5 w-5 text-muted-foreground mr-2" />,
  Symptoms: <ActivitySquare className="h-5 w-5 text-muted-foreground mr-2" />,
};

const ProfileSection: FC = () => {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="animate-spin w-10 h-10 text-blue-500 mb-4 flex items-center justify-center">
          <LoaderIcon size={40} />
        </div>
        <span className="text-lg text-muted-foreground">Loading medical profile...</span>
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

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="border-muted-foreground/20 shadow-sm hover:shadow-md transition duration-300">
      <CardHeader className="flex items-center space-x-2 pb-2">
        {iconMap[title]}
        <CardTitle className="text-md font-semibold">{title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 text-sm leading-relaxed space-y-2">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-6xl space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Medical Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectionCard title="Demographics">
            <p>{data.demographics || "No demographics data available."}</p>
          </SectionCard>

          <SectionCard title="Comorbidities">
            {Object.entries(data.comorbidities).length === 0 ? (
              <p>No comorbidities reported.</p>
            ) : (
              <ul className="list-disc list-inside">
                {Object.entries(data.comorbidities).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong> {value}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Diagnosis">
            <p>{data.diagnosis}</p>
          </SectionCard>

          <SectionCard title="Physician Notes">
            <p>{data.physician_notes}</p>
          </SectionCard>

          <SectionCard title="Medications">
            {data.medications.length === 0 ? (
              <p>No medications recorded.</p>
            ) : (
              <MedicationsList medications={data.medications} />
            )}
          </SectionCard>


          <SectionCard title="Symptoms">
            {data.symptoms.length === 0 ? (
              <p>No symptoms reported.</p>
            ) : (
              <ul className="list-disc list-inside">
                {data.symptoms.map((symptom) => (
                  <li key={symptom.id}>
                    <strong>{symptom.name}</strong> — Severity:{" "}
                    {symptom.severity}
                    {symptom.notes && <em> ({symptom.notes})</em>}
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
