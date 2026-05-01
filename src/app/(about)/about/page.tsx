import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About LMU SetupHub</h1>

      <div className="space-y-6">
        <section className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            LMU SetupHub is a modern web application built with Next.js, React,
            and Firebase. It demonstrates a complete setup for managing
            authentication, data storage, and user interfaces with the latest
            web technologies.
          </p>
        </section>

        <section className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 16</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Backend & Services</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Firebase Authentication</li>
                <li>• Cloud Firestore</li>
                <li>• Firebase Admin SDK</li>
                <li>• Next.js API Routes</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-semibold mb-4">Architecture</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The application demonstrates both client-side and server-side
            authentication patterns:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Client-side:</strong> React
              components with Firebase SDK for user interface
            </li>
            <li>
              <strong className="text-foreground">Server-side:</strong> Next.js
              API routes with Firebase Admin SDK for protected operations
            </li>
            <li>
              <strong className="text-foreground">State Management:</strong>{" "}
              React Context for auth state across components
            </li>
          </ul>
        </section>

        <section className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-semibold mb-4">Navigation Example</h2>
          <p className="text-muted-foreground mb-6">
            This app demonstrates routing with Next.js App Router. Notice the
            navigation bar at the top which updates based on the current route.
            The navbar is a shared layout component that appears on all pages.
          </p>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard →</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}