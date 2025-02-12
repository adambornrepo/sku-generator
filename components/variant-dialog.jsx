import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"

export function VariantDialog({ open, onOpenChange, onSubmit, availablePieces, editingVariant }) {
  const { toast } = useToast()
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
      toast({
        title: editingVariant ? "Variant güncellendi" : "Variant eklendi",
        description: `${name} başarıyla ${editingVariant ? 'güncellendi' : 'eklendi'}.`
      })
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
          <DialogTitle className="text-sm uppercase tracking-wide">
            {editingVariant ? "Variant Düzenle" : "Yeni Variant Ekle"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {editingVariant 
              ? "Variant bilgilerini güncelleyebilirsiniz."
              : "Aktif parçaları kullanarak yeni bir variant oluşturabilirsiniz."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name" >
                Variant Adı:
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Bed & Nightstand"
              />
            </div>
            
            <div className="grid gap-1.5">
              <Label >
                Seçili Parçalar:
              </Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {selectedPieceIds.map(pieceId => {
                  const piece = availablePieces.find(p => p.id === pieceId)
                  return piece ? (
                    <Badge 
                      key={piece.id} 
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0 p-0 overflow-hidden rounded-lg"
                    >
                      <div className="pl-2">
                      {piece.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePiece(piece.id)}
                        className="ml-1 h-full px-1 hover:text-destructive/90 transition-colors hover:bg-primary/30"
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
                    <SelectValue placeholder="Parça eklemek için seçin" />
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
                  className={!selectedPiece 
                    ? "opacity-50" 
                    : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"}
                >
                  Ekle
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              {editingVariant ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 