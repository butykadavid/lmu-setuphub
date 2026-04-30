import { PillBadge } from "@/components/ui/own/PillBadge";
import { Button } from "../ui/button";

const tutorials = [
    {
        title: "How to enable LMU telemetry recording",
        tag: "Beginner",
        time: "3 min",
    },
    {
        title: "Where to find your .duckdb telemetry files",
        tag: "Upload",
        time: "2 min",
    },
    {
        title: "How verified setup pages are generated",
        tag: "Telemetry",
        time: "5 min",
    },
    {
        title: "What setup values matter most for GT3 cars",
        tag: "Setup",
        time: "8 min",
    },
];

export default function TutorialsSection() {
    return (
        <section className="bg-background px-8 pb-28 md:px-16">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[2rem] border border-border bg-card p-8 text-card-foreground">
                    <PillBadge text="Tutorials" color="primary" mode="default" />

                    <h2 className="mt-6 text-4xl font-black tracking-tight">
                        Learn the workflow in minutes.
                    </h2>

                    <p className="mt-5 leading-8 text-muted-foreground">
                        Simple guides for recording telemetry, finding your files, uploading
                        setups, and understanding verified setup data.
                    </p>

                    <Button className="mt-8 rounded-xl bg-primary px-7 py-6 font-semibold text-primary-foreground hover:bg-primary/90">
                        Browse tutorials
                    </Button>
                </div>

                <div className="grid gap-4">
                    {tutorials.map((tutorial) => (
                        <article
                            key={tutorial.title}
                            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-card-foreground transition hover:bg-muted"
                        >
                            <div>
                                <div className="mb-3 flex gap-2">
                                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                                        {tutorial.tag}
                                    </span>

                                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                                        {tutorial.time}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold group-hover:text-primary">
                                    {tutorial.title}
                                </h3>
                            </div>

                            <div className="text-2xl text-muted-foreground group-hover:text-foreground">
                                →
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}