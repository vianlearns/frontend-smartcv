"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeaderNav() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <nav className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">Dashboard</Button>
        </Link>
        <UserButton />
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">Get Started</Button>
      </SignUpButton>
    </nav>
  );
}

export function HeroCTA() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal">
      <Button size="lg">Create Your Resume</Button>
    </SignUpButton>
  );
}

export function CtaButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button size="lg" variant="secondary">Create Your First Resume</Button>
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal">
      <Button size="lg" variant="secondary">Start Free - 3 Credits</Button>
    </SignUpButton>
  );
}
