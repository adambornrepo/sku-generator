"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { FileText, ClipboardList, ClipboardCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SkuTable({ variants, generateSku }) {
  const { toast } = useToast()

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Kopyalandı",
      description: "Veriler panoya kopyalandı."
    })
  }

  const handleCopyTable = () => {
    const headers = "Variant Names\tSKUs"
    const rows = variants.map(v => `${v.name}\t${generateSku(v)}`).join("\n")
    copyToClipboard(`${headers}\n${rows}`)
  }

  const handleCopyNames = () => {
    copyToClipboard(variants.map(v => v.name).join("\n"))
  }

  const handleCopySkus = () => {
    copyToClipboard(variants.map(v => generateSku(v)).join("\n"))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light">SKU Tablosu</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyTable}
              title="Copy Table"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline-block">
              Tabloyu Kopyala
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyNames}
              title="Copy Names"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline-block">
              İsimleri Kopyala
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySkus}
              title="Copy SKUs"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline-block">
              SKU'ları Kopyala
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant Names</TableHead>
              <TableHead>SKUs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.name}</TableCell>
                <TableCell className="font-mono">{generateSku(variant)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 