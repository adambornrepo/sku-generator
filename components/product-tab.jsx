"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Clipboard, FileText } from "lucide-react"
import { PiecesList } from "./pieces-list"
import { VariantsList } from "./variants-list"
import { SkuTable } from "./sku-table"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function ProductTab({ product, onUpdate, onDelete }) {
  const { toast } = useToast()
  const [localProduct, setLocalProduct] = useState(product)

  const handleInputChange = (field, value) => {
    const updatedProduct = { ...localProduct, [field]: value }
    setLocalProduct(updatedProduct)
    onUpdate(updatedProduct)
  }

  const handleDeleteProduct = () => {
    if (localProduct.variants.length > 0) {
      if (!confirm("Bu ürünü silmek istediğinizden emin misiniz? Tüm variantlar silinecektir.")) {
        return
      }
    }
    onDelete(localProduct.id)
    toast({
      title: "Ürün silindi",
      description: `${localProduct.name} başarıyla silindi.`
    })
  }

  const generateSkuForVariant = (variant) => {
    const pieces = variant.pieceIds
      .map(pieceId => {
        const piece = localProduct.pieces.find(p => p.id === pieceId)
        return piece ? `${localProduct.baseSku}${piece.value}` : ""
      })
      .filter(Boolean)

    if (pieces.length === 0) return ""
    
    return `${localProduct.setPrefix}${localProduct.delimiter}${pieces.join(localProduct.delimiter)}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tanımlamalar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>İsim</label>
              <Input
                value={localProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label>Base SKU</label>
              <Input
                value={localProduct.baseSku}
                onChange={(e) => handleInputChange("baseSku", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label>Ayraç</label>
              <Input
                value={localProduct.delimiter}
                onChange={(e) => handleInputChange("delimiter", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label>Set Öneki</label>
              <Input
                value={localProduct.setPrefix}
                onChange={(e) => handleInputChange("setPrefix", e.target.value)}
              />
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDeleteProduct}
            className="w-full mt-4"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Ürünü Sil
          </Button>
        </CardContent>
      </Card>

      <PiecesList
        pieces={localProduct.pieces}
        variants={localProduct.variants}
        onUpdate={(newPieces) => handleInputChange("pieces", newPieces)}
      />

      <VariantsList
        variants={localProduct.variants}
        pieces={localProduct.pieces}
        onUpdate={(newVariants) => handleInputChange("variants", newVariants)}
        generateSku={generateSkuForVariant}
      />

      <SkuTable
        variants={localProduct.variants}
        generateSku={generateSkuForVariant}
      />
    </div>
  )
} 