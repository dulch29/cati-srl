import React, { Suspense } from "react";
import { QuestDetailClient } from "./quest-client";

export const instant = false;

interface PageProps {
  params: Promise<{ questId: string }>;
}

export default async function QuestDetailPage({ params }: PageProps) {
  const { questId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <QuestDetailClient questId={questId} />
    </Suspense>
  );
}
