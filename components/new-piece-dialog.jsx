import { Dialog, DialogContent, DialogHeader, DialogDescription,  DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function NewPieceDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("")
  const [value, setValue] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), value.trim())
      setName("")
      setValue("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-wide">Add New Piece</DialogTitle>
          <DialogDescription className="text-xs">
            Bu kısımda oluşturacağınız SKU'da kullanılacak parçaları tanımlayabilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-xs">
                Parça Adı:
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="value" className="text-right text-xs">
                SKU Değeri:
              </label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="col-span-3"
                placeholder="-BD"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Ekle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 