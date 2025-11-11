"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ArrowRight } from "lucide-react"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (isSignUp && brandName && industry && websiteUrl) {
      localStorage.setItem(
        "brandInfo",
        JSON.stringify({
          brandName,
          industry,
          websiteUrl,
        }),
      )
    }
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold">SentiTrack</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Join SentiTrack to start monitoring sentiment" : "Access your sentiment dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brand Name</label>
                    <Input
                      placeholder="Your Brand"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">Select Industry</option>
                      <option value="Tech">Tech</option>
                      <option value="Finance">Finance</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website URL</label>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setName("")
                  setBrandName("")
                  setIndustry("")
                  setWebsiteUrl("")
                  setEmail("")
                  setPassword("")
                }}
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo: Enter any credentials to access the dashboard
        </p>
      </div>
    </div>
  )
}
