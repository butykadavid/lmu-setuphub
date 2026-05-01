import Image from "next/image";

export default function Logo({ src, name, className }: { src?: string; name?: string; className?: string }) {
    return <Image src={src || "/logo.png"} alt={name || "LMU SetupHub Logo"} width={32} height={32} className={className} />
}