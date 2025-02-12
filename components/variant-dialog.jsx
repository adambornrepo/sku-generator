import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"

export function VariantDialog({ open, onOpenChange, onSubmit, availablePieces, editingVariant }) {
  const [name, setName] = useState("")
  const [selectedPieceIds, setSelectedPieceIds] = useState([])
  const [selectedPiece, setSelectedPiece] = useState("")

  useEffect(() => {
    if (editingVariant) {
      setName(editingVariant.name)
      setSelectedPieceIds(editingVariant.pieceIds)
    } else {
      setName("")
      setSelectedPieceIds([])
    }
  }, [editingVariant])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && selectedPieceIds.length > 0) {
      onSubmit(name.trim(), selectedPieceIds)
      setName("")
      setSelectedPieceIds([])
      onOpenChange(false)
    }
  }

  const handleAddPiece = () => {
    if (selectedPiece && !selectedPieceIds.includes(selectedPiece)) {
      setSelectedPieceIds([...selectedPieceIds, selectedPiece])
      setSelectedPiece("")
    }
  }

  const handleRemovePiece = (pieceId) => {
    setSelectedPieceIds(selectedPieceIds.filter(id => id !== pieceId))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingVariant ? "Variant Düzenle" : "Yeni Variant Ekle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Variant Adı
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedPieceIds.map(pieceId => {
                  const piece = availablePieces.find(p => p.id === pieceId)
                  return piece ? (
                    <Badge key={piece.id} variant="secondary">
                      {piece.name}
                      <button
                        type="button"
                        onClick={() => handleRemovePiece(piece.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null
                })}
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={selectedPiece}
                  onValueChange={setSelectedPiece}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Parça seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePieces
                      .filter(piece => !selectedPieceIds.includes(piece.id))
                      .map(piece => (
                        <SelectItem key={piece.id} value={piece.id}>
                          {piece.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddPiece}
                  disabled={!selectedPiece}
                >
                  Ekle
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {editingVariant ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 