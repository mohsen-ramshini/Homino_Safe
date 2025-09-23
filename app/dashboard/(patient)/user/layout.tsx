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
    // <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {`Hi, Welcome back`}
          </h2>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    // </PageContainer>
  );
}
