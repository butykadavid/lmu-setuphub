import { PillBadge } from "@/components/ui/own/PillBadge";

const steps = [
  {
    step: "01",
    title: "Record in LMU",
    text: "Enable native telemetry recording and complete your session.",
  },
  {
    step: "02",
    title: "Upload .duckdb",
    text: "Drop the generated telemetry file into SetupHub.",
  },
  {
    step: "03",
    title: "Publish setup",
    text: "Review extracted data, add notes, and share the verified page.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-background px-8 py-28 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <PillBadge text="How it works" color="primary" mode="default" />

          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-foreground">
            From telemetry file to verified setup page.
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Upload your native LMU telemetry file and SetupHub extracts the
            useful data automatically: car, track, weather, lap time, and setup
            values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-border bg-card p-7 text-card-foreground"
            >
              <div className="text-sm font-bold text-primary">{item.step}</div>

              <h3 className="mt-8 text-2xl font-bold">{item.title}</h3>

              <p className="mt-4 leading-7 text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}