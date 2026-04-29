import { AuthProvider } from "@/context/AuthContext";
import { NavBar } from "@/components/layout/NavBar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        <AuthProvider>
            <NavBar />
            <main className="flex-1">{children}</main>
        </AuthProvider>
    </>;
}