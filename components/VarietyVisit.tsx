"use client";

import { useEffect } from "react";
import { rememberVarietyVisit } from "@/lib/variety-analytics";

export default function VarietyVisit({ crop }: { crop: string }) {
  useEffect(() => { rememberVarietyVisit(crop); }, [crop]);
  return null;
}
