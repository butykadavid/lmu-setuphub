import { AuthGateProvider } from "@/context/landing/AuthGateProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGateProvider>
      {children}
    </AuthGateProvider>
  );
}