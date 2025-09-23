"use client";

import { FC, useEffect, useState } from "react";
import { useUserProfiles } from "@/features/patients-list/api/useUserProfiles";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { EditThresholdsModal } from "./EditThresholdsModal";
import { Thresholds } from "../../types/thresholdsSchema ";
import { useUpdateProfileSettings } from "@/features/dashboard/api/caregiver/useUpdateProfileSettings ";
import { LoaderIcon } from "@/components/chat/icons";
import { useGetPatientProfile } from "../../api/use-get-patient-profile";
import { useUser } from "@/context/UserContext";

interface UserProfileListProps {
  userId: number;
}

const UserProfileList: FC<UserProfileListProps> = ({ userId }) => {
  const { data, isLoading, error } = useUserProfiles(userId);
  const currentUser = useUser()

  useEffect(()=>{
    console.log(currentUser.user?.role);
  },[])


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <span className="animate-spin w-10 h-10 text-blue-500 mb-4 flex items-center justify-center">
            <LoaderIcon size={40} />
          </span>
          <span className="text-lg text-muted-foreground">Loading profiles...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center mt-10">
        <Alert variant="destructive" className="max-w-xl">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load medical profiles. Please try again later.
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
    <Card className="border-muted-foreground/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="pt-2 text-sm leading-relaxed space-y-2">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-2xl font-bold text-center">Medical Profiles</h2>

        {currentUser.user?.role === "doctor" && (
            <EditThresholdsModal
            userId={userId}
            defaultValues={{
              diagnosis: "",
              notes: "",
              timestamp: new Date().toISOString().slice(0, 16),
              medications: [],
              symptoms: [],
            }}
            trigger={
              <button className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Thresholds
              </button>
            }                    
          />
        )}

        {data.map((profile) => (
          <div key={profile.ehr_id} className="space-y-6">
            <SectionCard title="Diagnosis">
              <p>{profile.diagnosis || "No diagnosis provided."}</p>
            </SectionCard>

            <SectionCard title="Physician Notes">
              <p>{profile.physician_notes || "No notes available."}</p>
            </SectionCard>

            <SectionCard title="Medications">
              {profile.medications?.length ? (
                <ul className="list-disc list-inside">
                  {profile.medications.map((med) => (
                    <li key={med.id}>
                      <strong>{med.name}</strong> — {med.dosage}, {med.frequency}
                      {med.notes && <em> ({med.notes})</em>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No medications recorded.</p>
              )}
            </SectionCard>

            <SectionCard title="Symptoms">
              {profile.symptoms?.length ? (
                <ul className="list-disc list-inside">
                  {profile.symptoms.map((symptom) => (
                    <li key={symptom.id}>
                      <strong>{symptom.name}</strong> — Severity: {symptom.severity}
                      {symptom.notes && <em> ({symptom.notes})</em>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No symptoms reported.</p>
              )}
            </SectionCard>

            <p className="text-xs text-muted-foreground text-right">
              Recorded on: {new Date(profile.timestamp).toLocaleString()}
            </p>

            <Separator className="my-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileList;
