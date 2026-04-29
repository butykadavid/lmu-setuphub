'use client';

import { Button } from "../ui/button";

export default function FinalCtaSection() {
  return (
    <section className="border-t border-border bg-background px-8 py-24 md:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-primary/20 bg-primary/10 p-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Ready to publish your first verified setup?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Upload a native LMU telemetry file and let SetupHub do the
            extraction.
          </p>
        </div>

        <Button className="w-fit rounded-xl bg-primary px-7 py-6 font-bold text-primary-foreground hover:bg-primary/90">
          Upload telemetry
        </Button>
      </div>
    </section>
  );
}