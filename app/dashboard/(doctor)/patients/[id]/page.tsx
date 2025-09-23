// app/chat/[id]/page.tsx
'use client';

import { LoaderIcon } from '@/components/chat/icons';
import PatientProfile from '@/features/patients-list/components/user/PatientProfile';
import { useParams } from 'next/navigation';



export default function ChatPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';


  return (
    <PatientProfile userId={Number(id)}/>
  );
}
