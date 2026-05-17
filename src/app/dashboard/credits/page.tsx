'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { CreditCard, Check, Loader2 } from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

export default function CreditsPage() {
  const { getToken } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [currentCredits, setCurrentCredits] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const token = await getToken();
      const userRes = await api.getUser(token!);
      setCurrentCredits(userRes.data?.credits || 0);
      
      // Hardcoded packages for now
      setPackages([
        { id: 'starter', name: 'Starter Pack', credits: 5, price: 4.99, description: 'Perfect for trying out' },
        { id: 'basic', name: 'Basic Pack', credits: 15, price: 12.99, description: 'Best value for regular use' },
        { id: 'pro', name: 'Pro Pack', credits: 50, price: 39.99, description: 'For power users' },
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id);
    try {
      const token = await getToken();
      const response = await api.purchaseCredits(token!, pkg.id);
      
      // Redirect to Midtrans payment page
      if (response.data.redirect_url) {
        window.open(response.data.redirect_url, "_self");
      }
    } catch (error) {
      console.error('Failed to purchase:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Purchase Credits</h1>
          <p className="text-zinc-400">Each credit allows you to generate one AI-tailored CV</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Current balance: <span className="font-bold">{currentCredits} credits</span></span>
          </div>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 relative"
            >
              {pkg.id === 'basic' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-zinc-400 text-sm mb-4">{pkg.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${pkg.price}</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{pkg.credits} CV generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">ATS-optimized output</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">PDF download</span>
                </div>
              </div>
              
              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing === pkg.id}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  pkg.id === 'basic'
                    ? 'bg-white text-black hover:bg-zinc-200'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                } disabled:opacity-50`}
              >
                {purchasing === pkg.id ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  'Purchase'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-12 text-center text-sm text-zinc-400">
          <p>Secure payment powered by Midtrans</p>
          <p className="mt-1">Credits never expire</p>
        </div>
      </div>
    </div>
  );
}
