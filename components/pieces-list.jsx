"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus } from "lucide-react"
import { NewPieceDialog } from "./new-piece-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { nanoid } from "nanoid"

export function PiecesList({ pieces, variants, onUpdate }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddPiece = (name, value) => {
    const newPiece = {
      id: nanoid(),
      name,
      value,
      isActive: true
    }
    onUpdate([...pieces, newPiece])
    toast({
      title: "Parça eklendi",
      description: `${name} başarıyla eklendi.`
    })
  }

  const handleDeletePiece = (pieceId) => {
    const isUsedInVariant = variants.some(v => v.pieceIds.includes(pieceId))
    
    if (isUsedInVariant) {
      if (!confirm("Bu parça bir veya daha fazla variantta kullanılıyor. Silmek istediğinizden emin misiniz?")) {
        return
      }
      // Variantlardan da kaldırılmalı
      const updatedVariants = variants.map(variant => ({
        ...variant,
        pieceIds: variant.pieceIds.filter(id => id !== pieceId)
      }))
      onUpdate(pieces.filter(p => p.id !== pieceId))
    } else {
      onUpdate(pieces.filter(p => p.id !== pieceId))
    }
  }

  const handleToggleActive = (pieceId) => {
    onUpdate(
      pieces.map(piece =>
        piece.id === pieceId
          ? { ...piece, isActive: !piece.isActive }
          : piece
      )
    )
  }

  const handleValueChange = (pieceId, value) => {
    onUpdate(
      pieces.map(piece =>
        piece.id === pieceId
          ? { ...piece, value }
          : piece
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parçalar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pieces.map((piece) => (
          <div key={piece.id} className="flex items-center gap-4">
            <Switch
              checked={piece.isActive}
              onCheckedChange={() => handleToggleActive(piece.id)}
            />
            <Input
              value={piece.name}
              readOnly
              className="flex-1"
            />
            <Input
              value={piece.value}
              onChange={(e) => handleValueChange(piece.id, e.target.value)}
              placeholder="SKU değeri"
              className="w-32"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeletePiece(piece.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Parça Ekle
        </Button>
      </CardContent>

      <NewPieceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddPiece}
      />
    </Card>
  )
} 