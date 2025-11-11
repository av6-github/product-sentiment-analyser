"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elements = [titleRef.current, descRef.current, buttonRef.current]

    elements.forEach((element, index) => {
      if (element) {
        element.style.opacity = "0"
        element.style.transform = "translateY(20px)"
        element.style.transition = `all 0.6s ease-out ${index * 0.15}s`

        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }, 50)
      }
    })
  }, [])

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-primary/10 rounded-full">
            <Zap className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div ref={titleRef}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Understand Sentiment <span className="text-primary">Instantly</span>
          </h1>
        </div>

        <div ref={descRef} className="mb-8">
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Track social media sentiment in real-time. Get AI-powered alerts and actionable insights to protect your
            brand.
          </p>
        </div>

        <div ref={buttonRef} className="flex gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
