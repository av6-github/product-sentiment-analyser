"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddProductFormProps {
  onAddProduct: (product: {
    product_name: string
    launch_date: string
    description: string
    category: string
  }) => void
}

export default function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    product_name: "",
    launch_date: "",
    description: "",
    category: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.product_name && formData.launch_date && formData.description && formData.category) {
      try {
        await onAddProduct(formData)
        setFormData({ product_name: "", launch_date: "", description: "", category: "" })
      } finally {
        setLoading(false)
      }
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
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., EcoPhone X"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              required
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
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category/Type</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Software">Software</option>
              <option value="Service">Service</option>
              <option value="SaaS">SaaS</option>
              <option value="Health">Health</option>
              <option value="Automotive">Automotive</option>
              <option value="SmartHome">SmartHome</option>
              <option value="Wearable">Wearable</option>
              <option value="Audio">Audio</option>
              <option value="Outdoor">Outdoor</option>
              <option value="FinTech">FinTech</option>
              <option value="EdTech">EdTech</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="date">Launch Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.launch_date}
              onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
