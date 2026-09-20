"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function TrackView({ event, params }: { event: string; params: Record<string, string | number | undefined> }) {
  useEffect(() => { track(event, params); }, [event, params]);
  return null;
}
