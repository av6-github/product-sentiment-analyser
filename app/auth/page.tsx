"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (isSignUp) {
        // 1️⃣ Create Supabase Auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (authError) throw new Error("Signup failed: " + authError.message)

        const user = authData?.user
        if (!user) throw new Error("No user returned from signup")

        // 2️⃣ Insert into brand table with user_id link
        const { data: brandData, error: brandError } = await supabase
          .from("brand")
          .insert([
            {
              brand_name: brandName,
              industry: industry,
              website: websiteUrl,
              user_id: user.id, // link to auth.users
            },
          ])
          .select()

        if (brandError) throw new Error("Failed to create brand: " + brandError.message)

        // 3️⃣ Store brand info locally for dashboard use
        localStorage.setItem(
          "brandInfo",
          JSON.stringify({
            brandName,
            industry,
            websiteUrl,
            brandId: brandData?.[0]?.brand_id,
            userId: user.id,
          })
        )

        router.push("/dashboard")
      } else {
        // 4️⃣ Login user via Supabase Auth
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) throw new Error("Login failed: " + loginError.message)

        const user = authData?.user
        if (!user) throw new Error("No user returned from login")

        // 5️⃣ Fetch brand linked to this user
        const { data: brand, error: brandFetchError } = await supabase
          .from("brand")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (brandFetchError || !brand) throw new Error("No brand linked to this account")

        localStorage.setItem(
          "brandInfo",
          JSON.stringify({
            brandName: brand.brand_name,
            industry: brand.industry,
            websiteUrl: brand.website,
            brandId: brand.brand_id,
            userId: user.id,
          })
        )

        router.push("/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
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

              {error && <p className="text-sm text-red-500">{error}</p>}

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
                  setError(null)
                }}
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
