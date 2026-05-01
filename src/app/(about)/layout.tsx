import { NavBar } from "@/components/layout/NavBar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        <NavBar />
        <main className="flex-1">{children}</main>
    </>;
}