import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import SideBar from "@/components/ui/own/SideBar";

export default function LandingSideBar({
    open,
    onClose,
}: {
    open?: boolean;
    onClose?: () => void;
}) {
    return (
        <SideBar open={open} onClose={onClose}>
            <div className="flex h-full w-full items-center justify-center p-8">

                <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-foreground">
                            Access required
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to explore setups, upload telemetry, and unlock the full experience.
                        </p>
                    </div>

                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">Continue with</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <GoogleSignInButton
                        text="Continue with Google"
                        transition={false}
                        className="w-full justify-center py-5 text-base"
                    />

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        Do not worry, it is completely free.
                    </p>
                </div>
            </div>
        </SideBar>
    );
}