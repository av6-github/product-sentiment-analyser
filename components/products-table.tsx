"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

interface Product {
  id: string
  name: string
  brand: string
  launchDate: string
}

interface ProductsTableProps {
  products: Product[]
  onDeleteProduct: (id: string) => void
}

export default function ProductsTable({ products, onDeleteProduct }: ProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Brand</th>
                <th className="text-left py-3 px-4 font-semibold">Launch Date</th>
                <th className="text-right py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.brand}</td>
                  <td className="py-3 px-4">{new Date(product.launchDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteProduct(product.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
