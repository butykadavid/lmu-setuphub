import { NavBar } from "@/components/layout/NavBar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        <NavBar />
        <ProtectedRoute>
            <main className="flex-1 min-h-screen bg-background p-6 md:p-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-8">
                    {children}
                </div>
            </main>
        </ProtectedRoute>
    </>;
}