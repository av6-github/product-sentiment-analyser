"use client"

import { useState, useEffect } from "react"
import AddProductForm from "@/components/add-product-form"
import ProductsTable from "@/components/products-table"
import Sidebar from "@/components/sidebar"
import { useDarkMode } from "@/app/client-layout"
import { Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Product {
  product_id: string
  product_name: string
  brand_id: string
  launch_date: string
  description: string
  category: string
}

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isDarkMode, setIsDarkMode } = useDarkMode()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [brandId, setBrandId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const brandInfo = localStorage.getItem("brandInfo")
        if (brandInfo) {
          const { brandId: bid } = JSON.parse(brandInfo)
          setBrandId(bid)

          const supabase = createClient()
          const { data, error } = await supabase.from("product").select("*").eq("brand_id", bid)

          if (error) throw error
          setProducts(data || [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddProduct = async (product: Omit<Product, "product_id" | "brand_id">) => {
    try {
      if (!brandId) return

      const supabase = createClient()
      const { data, error } = await supabase
        .from("product")
        .insert([
          {
            product_name: product.product_name,
            brand_id: brandId,
            launch_date: product.launch_date,
            description: product.description,
            category: product.category,
          },
        ])
        .select()

      if (error) throw error
      setProducts([...products, ...(data || [])])
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("product").delete().eq("product_id", id)

      if (error) throw error
      setProducts(products.filter((p) => p.product_id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <div className="flex-1 p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Product Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddProductForm onAddProduct={handleAddProduct} />
          </div>
          <div className="lg:col-span-2">
            <ProductsTable
              products={products.map((p) => ({
                id: p.product_id.toString(),
                name: p.product_name,
                brand: "",
                launchDate: p.launch_date,
                description: p.description,
                category: p.category,
              }))}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
