"use client"
import { useUser } from '@/context/UserContext';
import DoctorDashboard from '@/features/patients-list/components/DoctorDashboard'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useUser();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (user === null) return;

    if (!user?.id) {
      router.replace("/auth/sign-in");
      return;
    }

    switch (user.role) {
      case "admin":
        router.replace("/dashboard/users");
        break;
      case "patient":
        router.replace("/dashboard/overview");
        break;
      case "doctor":
        router.replace("/dashboard/patients");
        break;
      case "caregiver":
        router.replace("/dashboard/my-patients");
        break;
      default:
        router.replace("/dashboard/overview");
        break;
    }
  }, [user, router]);
  
  return (
    <DoctorDashboard />
  )
}

export default page