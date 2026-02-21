export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    // <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="mt-6">{children}</div>
      </div>
    // </PageContainer>
  );
}
