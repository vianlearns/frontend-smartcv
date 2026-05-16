import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
