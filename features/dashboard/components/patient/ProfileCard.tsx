"use client";

import { useUser } from '@/context/UserContext';
import {
  Card,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfileCard() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No user data available.
      </div>
    );
  }

  const physicalInfo = [
    { label: 'Weight', value: '68 kg' },
    { label: 'Height', value: '167 cm' },
    { label: 'Age', value: '48' },
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 transition-colors duration-300">
      {/* بخش بالا: آواتار + نام */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* آواتار و دکمه ویرایش */}
        <div className="relative flex flex-col items-center">
          <Avatar className="h-24 w-24 shrink-0 border-2 border-gray-200 dark:border-zinc-600 shadow-lg">
            <AvatarImage src="/placeholder-user.png" alt={user.first_name} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
            <Link href="/dashboard/profile">
              <Button
                variant="outline"
                size="icon"
                className="p-1 w-8 h-8 flex justify-center items-center"
                aria-label="Edit profile"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* نام کاربر */}
        <div className="flex-1 flex flex-col gap-2 w-full text-center sm:text-left">
          <CardTitle className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </CardTitle>
        </div>
      </div>

      {/* اطلاعات فیزیکی کاربر */}
      <CardContent className="mt-6 px-0">
        {/* حالت دسکتاپ: سه کارت جدا */}
        <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
          {physicalInfo.map((item) => (
            <Card
              key={item.label}
              className="bg-muted dark:bg-zinc-700 p-4 rounded-xl shadow-sm"
            >
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </Card>
          ))}
        </div>

        {/* حالت موبایل: یک کارت با اطلاعات در یک خط */}
        <div className="grid sm:hidden bg-muted dark:bg-zinc-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between text-center">
            {physicalInfo.map((item) => (
              <div key={item.label} className="flex flex-col flex-1">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
