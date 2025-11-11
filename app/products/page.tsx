"use client"

import { useState } from "react"
import AddProductForm from "@/components/add-product-form"
import ProductsTable from "@/components/products-table"
import Sidebar from "@/components/sidebar"
import { useDarkMode } from "@/app/client-layout"
import { Package } from "lucide-react"

interface Product {
  id: string
  name: string
  brand: string
  launchDate: string
}

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isDarkMode, setIsDarkMode } = useDarkMode()
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "EcoPhone X", brand: "TechCorp", launchDate: "2024-01-15" },
    { id: "2", name: "SmartWatch Pro", brand: "TechCorp", launchDate: "2024-02-20" },
    { id: "3", name: "CloudSync", brand: "DataFlow", launchDate: "2024-03-10" },
  ])

  const handleAddProduct = (product: Omit<Product, "id">) => {
    setProducts([...products, { ...product, id: Date.now().toString() }])
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
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
            <ProductsTable products={products} onDeleteProduct={handleDeleteProduct} />
          </div>
        </div>
      </div>
    </div>
  )
}
