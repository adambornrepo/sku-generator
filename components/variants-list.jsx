"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Clipboard } from "lucide-react"
import { VariantDialog } from "./variant-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { nanoid } from "nanoid"

export function VariantsList({ variants, pieces, onUpdate, generateSku }) {
  const [dialogState, setDialogState] = useState({ isOpen: false, editingVariant: null })
  const { toast } = useToast()

  const handleAddVariant = (name, selectedPieceIds) => {
    const newVariant = {
      id: nanoid(),
      name,
      pieceIds: selectedPieceIds
    }
    onUpdate([...variants, newVariant])
    toast({
      title: "Variant eklendi",
      description: `${name} başarıyla eklendi.`
    })
  }

  const handleEditVariant = (id, name, selectedPieceIds) => {
    onUpdate(
      variants.map(variant =>
        variant.id === id
          ? { ...variant, name, pieceIds: selectedPieceIds }
          : variant
      )
    )
    toast({
      title: "Variant güncellendi",
      description: `${name} başarıyla güncellendi.`
    })
  }

  const handleDeleteVariant = (variantId) => {
    onUpdate(variants.filter(v => v.id !== variantId))
    toast({
      title: "Variant silindi",
      description: "Variant başarıyla silindi."
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopyalandı",
      description: "SKU panoya kopyalandı."
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variantlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.map((variant) => {
          const sku = generateSku(variant)
          return (
            <div key={variant.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{variant.name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {variant.pieceIds.map(pieceId => {
                    const piece = pieces.find(p => p.id === pieceId)
                    return piece ? (
                      <Badge key={piece.id} variant="secondary">
                        {piece.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-muted rounded text-sm font-mono">
                  {sku}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(sku)}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDialogState({
                    isOpen: true,
                    editingVariant: variant
                  })}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteVariant(variant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
        
        <Button
          variant="outline"
          onClick={() => setDialogState({ isOpen: true, editingVariant: null })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Variant Ekle
        </Button>
      </CardContent>

      <VariantDialog
        open={dialogState.isOpen}
        onOpenChange={(isOpen) => setDialogState({ isOpen, editingVariant: null })}
        onSubmit={dialogState.editingVariant 
          ? (name, pieceIds) => handleEditVariant(dialogState.editingVariant.id, name, pieceIds)
          : handleAddVariant
        }
        availablePieces={pieces.filter(p => p.isActive)}
        editingVariant={dialogState.editingVariant}
      />
    </Card>
  )
} 