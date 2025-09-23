"use client";

import { useUser } from '@/context/UserContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Circle, Edit } from 'lucide-react';
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

  const statusColor =
    user.status === 'active' ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 transition-colors duration-300">
      {/* اطلاعات اصلی کاربر */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-between">
        {/* تصویر و اطلاعات متنی */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left w-full">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-user.png" alt={user.first_name} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 w-full">
            <CardTitle className="text-2xl font-bold">
              {user.first_name} {user.last_name}
            </CardTitle>

            {/* username, phone, status */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start items-center text-sm text-muted-foreground">
              <span>@{user.username}</span>
              <span>+989131046553</span>
              <div className="flex items-center gap-1">
                <Circle className={`h-3 w-3 ${statusColor}`} />
                <span className="capitalize">{user.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* دکمه ویرایش */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <Link href="/dashboard/profile" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto flex justify-center items-center gap-1">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* اطلاعات فیزیکی کاربر */}
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-0 text-center">
        {[
          { label: 'Weight', value: '68 kg' },
          { label: 'Height', value: '167 cm' },
          { label: 'Age', value: '48' },
        ].map((item) => (
          <Card key={item.label} className="bg-muted p-4 rounded-xl shadow-sm">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </Card>
        ))}
      </CardContent>
    </div>
  );
};
