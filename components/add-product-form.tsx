"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddProductFormProps {
  onAddProduct: (product: {
    name: string
    brand: string
    launchDate: string
    description: string
    category: string
  }) => void
}

export default function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    launchDate: "",
    description: "",
    category: "",
  })
  const [brand, setBrand] = useState("")

  useEffect(() => {
    const brandInfo = localStorage.getItem("brandInfo")
    if (brandInfo) {
      const { brandName } = JSON.parse(brandInfo)
      setBrand(brandName)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && brand && formData.launchDate && formData.description && formData.category) {
      onAddProduct({
        ...formData,
        brand,
      })
      setFormData({ name: "", launchDate: "", description: "", category: "" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Add a product to track its sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" placeholder="Brand" value={brand} disabled className="bg-muted" />
          </div>

          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., EcoPhone X"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category/Type</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Software">Software</option>
              <option value="Service">Service</option>
              <option value="SaaS">SaaS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="date">Launch Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.launchDate}
              onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
