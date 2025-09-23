import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="flex flex-1 flex-col space-y-2">
        <div className="mt-6 ">{children}</div>
      </div>
  );
}
