"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthenticatedFetch } from "@/lib/firebase/use-authenticated-fetch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/own/PillBadge";
import { LoaderOverlay } from "@/components/ui/own/LoaderOverlay";
import { TelemetryCard } from "@/components/browse/TelemetryCard";
import type {
  TelemetrySummary,
  BrowseTelemetriesResponse,
} from "@/app/api/browse/telemetries/route";
import { Search, X } from "lucide-react";

export default function Browse() {
  const { user } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const [telemetries, setTelemetries] = useState<TelemetrySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [carFilter, setCarFilter] = useState("");
  const [trackFilter, setTrackFilter] = useState("");

  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const fetchTelemetries = useCallback(
    async (resetPagination = false, cursorValue?: string) => {
      if (isLoadingRef.current) return;

      try {
        isLoadingRef.current = true;
        setError(null);

        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (carFilter) params.append("car", carFilter);
        if (trackFilter) params.append("track", trackFilter);
        params.append("limit", "12");

        if (cursorValue && !resetPagination) {
          params.append("cursor", cursorValue);
        }

        const response = await authenticatedFetch(
          `/api/browse/telemetries?${params.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP ${response.status}: Failed to fetch telemetries`
          );
        }

        const data: BrowseTelemetriesResponse = await response.json();

        setTelemetries((prev) =>
          resetPagination ? data.telemetries : [...prev, ...data.telemetries]
        );
        setHasMore(data.hasMore);
        setCursor(data.cursor);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error fetching telemetries:", error);
        setError(errorMessage);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    },
    [searchQuery, carFilter, trackFilter, authenticatedFetch]
  );

  useEffect(() => {
    setIsInitialLoading(true);
    setTelemetries([]);
    setCursor(undefined);
    fetchTelemetries(true);
  }, [searchQuery, carFilter, trackFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !isInitialLoading &&
          telemetries.length > 0
        ) {
          setIsLoading(true);
          fetchTelemetries(false, cursor);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isInitialLoading, cursor, fetchTelemetries, telemetries.length]);

  // Handle search/filter changes
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setTelemetries([]);
      setCursor(undefined);
      setIsLoading(true);
      setIsInitialLoading(true);
    },
    []
  );

  const handleFilterChange = useCallback(
    (filterName: string, value: string) => {
      if (filterName === "car") setCarFilter(value);
      if (filterName === "track") setTrackFilter(value);

      setTelemetries([]);
      setCursor(undefined);
      setIsLoading(true);
      setIsInitialLoading(true);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setCarFilter("");
    setTrackFilter("");
    setTelemetries([]);
    setCursor(undefined);
    setError(null);
    setIsLoading(true);
    setIsInitialLoading(true);
  }, []);

  if (!user) return null;

  const hasActiveFilters = searchQuery || carFilter || trackFilter;
  const isEmptyState = !isInitialLoading && telemetries.length === 0;

  return (
    <>
      {/* Header */}
      <section className="flex flex-col gap-2">
        <PillBadge text="Browse Telemetries" color="primary" mode="default" />

        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Discover community setups
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse verified telemetry from sim racers around the world. Find the
            perfect setup for your next session.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search car, track, driver..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <input
          type="text"
          placeholder="Car..."
          value={carFilter}
          onChange={(e) => handleFilterChange("car", e.target.value)}
          className="h-9 px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-primary w-full md:w-32"
        />

        <input
          type="text"
          placeholder="Track..."
          value={trackFilter}
          onChange={(e) => handleFilterChange("track", e.target.value)}
          className="h-9 px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-primary w-full md:w-32"
        />

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2 w-full md:w-auto"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </section>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <PillBadge
              text={`Search: "${searchQuery}"`}
              color="primary"
              mode="default"
            />
          )}
          {carFilter && (
            <PillBadge
              text={`Car: ${carFilter}`}
              color="primary"
              mode="default"
            />
          )}
          {trackFilter && (
            <PillBadge
              text={`Track: ${trackFilter}`}
              color="primary"
              mode="default"
            />
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          <p className="font-medium">Error loading telemetries</p>
          <p className="mt-1 text-xs opacity-90">{error}</p>
        </div>
      )}

      {/* Telemetries Grid */}
      {isInitialLoading ? (
        <LoaderOverlay message="Loading telemetries..." />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="text-muted-foreground space-y-2">
            <p className="text-lg font-medium">Failed to load telemetries</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : isEmptyState ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="text-muted-foreground space-y-2">
            <p className="text-lg font-medium">No telemetries found</p>
            <p className="text-sm">
              {hasActiveFilters
                ? "Try adjusting your filters or search query."
                : "Be the first to upload a verified telemetry!"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {telemetries.map((telemetry) => (
              <TelemetryCard
                key={telemetry.id}
                telemetry={telemetry}
                onClick={() => {
                  // TODO: Navigate to telemetry detail page
                  // router.push(`/browse/${telemetry.id}`);
                }}
              />
            ))}
          </div>

          {/* Intersection observer target for infinite scroll */}
          {hasMore && (
            <div
              ref={observerTarget}
              className="flex justify-center py-8 col-span-full"
            >
              {isLoading && <div className="text-muted-foreground text-sm">Loading more...</div>}
            </div>
          )}

          {/* End of results */}
          {!hasMore && telemetries.length > 0 && (
            <div className="flex justify-center py-8 col-span-full">
              <p className="text-muted-foreground text-sm">
                No more telemetries to load
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}