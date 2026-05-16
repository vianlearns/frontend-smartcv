"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { creditsApi } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";

const packages = [
  { credits: 5, price: 4.99, popular: false },
  { credits: 15, price: 9.99, popular: true },
  { credits: 50, price: 24.99, popular: false },
  { credits: 100, price: 39.99, popular: false },
];

export default function CreditsPage() {
  const { getToken } = useAuth();
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);

  async function purchaseCredits(packageIndex: number) {
    const pkg = packages[packageIndex];
    setProcessing(packageIndex);

    try {
      const token = await getToken();
      if (!token) return;

      // Create Midtrans transaction
      const res = await creditsApi.purchase(token, {
        credits: pkg.credits,
        amount: pkg.price,
      });

      // Open Midtrans payment page
      if (res.data.redirect_url) {
        window.open(res.data.redirect_url, "_blank");
      }

      toast.success("Payment window opened. Complete payment to receive credits.");
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Buy Credits</h1>
        <p className="text-zinc-500 mt-1">Each CV generation or download uses 1 credit</p>
      </div>

      {/* Current Balance */}
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-sm text-zinc-500 mb-2">Your Balance</div>
          <div className="text-5xl font-bold">{user?.credits || 0}</div>
          <div className="text-zinc-500 mt-1">credits</div>
        </CardContent>
      </Card>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg, index) => (
          <Card
            key={index}
            className={`relative hover:border-zinc-700 transition-all ${
              pkg.popular ? "border-blue-500" : ""
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-xs font-medium rounded-full">
                Best Value
              </div>
            )}
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{pkg.credits}</div>
              <div className="text-zinc-500 text-sm">credits</div>
              <div className="text-2xl font-semibold mt-4">${pkg.price}</div>
              <div className="text-zinc-600 text-sm mb-4">
                ${(pkg.price / pkg.credits).toFixed(2)}/credit
              </div>
              <Button
                className="w-full"
                variant={pkg.popular ? "primary" : "secondary"}
                onClick={() => purchaseCredits(index)}
                disabled={processing !== null}
              >
                {processing === index ? "Processing..." : "Buy Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-medium mb-4">How Credits Work</h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              New users get 3 free credits on signup
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Each CV generation costs 1 credit
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Each PDF download costs 1 credit
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Revisions within 48 hours are free
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Credits never expire
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
