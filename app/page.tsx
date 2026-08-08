"use client";

import { useEffect, useState } from "react";
import { clearSetupDraft, loadProfile, saveProfile } from "@/lib/storage";
import { UserProfile } from "@/lib/types";
import SetupWizard from "@/components/SetupWizard";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);

  function handleSave(next: UserProfile) {
    saveProfile(next);
    clearSetupDraft();
    setProfile(next);
    setEditing(false);
    window.scrollTo({ top: 0 });
  }

  if (!ready) {
    return (
      <main
        role="status"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center"
      >
        <p className="text-moss animate-pulse">Opening the potting shed…</p>
      </main>
    );
  }

  if (!profile || editing) {
    return (
      <SetupWizard
        initial={profile}
        onSave={handleSave}
        onCancel={profile ? () => setEditing(false) : undefined}
      />
    );
  }

  return <Dashboard profile={profile} onEdit={() => setEditing(true)} />;
}
