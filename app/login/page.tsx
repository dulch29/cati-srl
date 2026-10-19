"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CatiLogo } from "@/components/layout/cati-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        router.push(redirectedFrom || "/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split("@")[0],
            },
          },
        });

        if (error) {
          throw error;
        }

        setSuccessMsg(
          "Account created successfully! Check your email for confirmation, or sign in if confirmation is disabled."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your credentials.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Set 7-day demo cookie
    document.cookie =
      "cati_demo_session=true; path=/; max-age=604800; SameSite=Lax";
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
      <CardHeader>
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-2">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signin"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>
        <CardTitle>
          {mode === "signin" ? "Welcome Back" : "Start Your SRL Journey"}
        </CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Enter your email and password to access your knowledge graph."
            : "Create an account to begin tracking mastery and metacognition."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <Input
              label="Display Name"
              type="text"
              placeholder="e.g. Alex Chen"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="student@example.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            {mode === "signin" ? "Sign In to Cati" : "Create Account"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {/* Quick Demo Access Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Hackathon Quick Preview
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDemoLogin}
          className="w-full border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/10 text-indigo-300"
        >
          <ShieldCheck className="mr-2 h-4 w-4 text-indigo-400" />
          Continue in Demo Mode (1-Click)
        </Button>
      </CardContent>
    </Card>
  );
}

import { InteractiveAmbientBackground } from "@/components/ui/interactive-ambient-background";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-[#060913] overflow-hidden">
      {/* Interactive Ambient Background with flashlight matrix and shockwave ripples */}
      <InteractiveAmbientBackground />

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[700px] rounded-full bg-gradient-to-tr from-blue-600/15 via-blue-400/10 to-transparent blur-3xl" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/">
            <CatiLogo size="lg" />
          </Link>
          <p className="text-xs text-slate-400">
            Sign in to your learning dashboard and adaptive knowledge companion
          </p>
        </div>

        <Suspense fallback={<LoadingState title="Loading Sign In..." />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-slate-500">
          Powered by Supabase Auth with Row Level Security.
        </p>
      </div>
    </div>
  );
}
