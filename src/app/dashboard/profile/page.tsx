"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userApi, Profile } from "@/lib/api";
import { useAppStore } from "@/store";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    summary: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await userApi.get(token);
      setUser(res.data.user);
      if (res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      if (!token) return;

      await userApi.updateProfile(token, profile);
      toast.success("Profile saved");
    } catch (error) {
      toast.error("Failed to save profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-zinc-500 mt-1">Your professional information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-medium border-b border-zinc-800 pb-4">Basic Information</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  id="full_name"
                  label="Full Name"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  id="phone"
                  label="Phone"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
                <Input
                  id="address"
                  label="Address"
                  value={profile.address || ""}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="City, Country"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  id="linkedin"
                  label="LinkedIn"
                  value={profile.linkedin || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                />
                <Input
                  id="website"
                  label="Website"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://johndoe.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-medium border-b border-zinc-800 pb-4">Professional Summary</h2>
              <Textarea
                id="summary"
                value={profile.summary || ""}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                placeholder="Write a brief summary of your professional background and career goals..."
                rows={5}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>

      {/* CV Upload Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium border-b border-zinc-800 pb-4 mb-4">Import from CV</h2>
          <p className="text-zinc-500 text-sm mb-4">
            Upload an existing CV to automatically extract your information.
          </p>
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:border-zinc-600 transition-colors">
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              id="cv-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const token = await getToken();
                  if (!token) return;

                  toast.success("Processing CV...");
                  const res = await userApi.uploadCV(token, formData);
                  if (res.data.profile) {
                    setProfile(res.data.profile);
                    toast.success("CV imported successfully");
                  }
                } catch (error) {
                  toast.error("Failed to process CV");
                  console.error(error);
                }
              }}
            />
            <label htmlFor="cv-upload" className="cursor-pointer">
              <div className="text-zinc-400 mb-2">Click to upload or drag and drop</div>
              <div className="text-sm text-zinc-600">PDF or DOCX (max 5MB)</div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
