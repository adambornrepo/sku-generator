"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ProductTab } from "@/components/product-tab"
import { NewProductDialog } from "@/components/new-product-dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast"
import { nanoid } from "nanoid"

export default function Home() {
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState("")
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedData = localStorage.getItem("skuGenerator")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setProducts(parsedData.products)
      if (parsedData.products.length > 0) {
        setActiveTab(parsedData.products[0].id)
      }
    }
  }, [])

  const saveToLocalStorage = (newProducts) => {
    localStorage.setItem("skuGenerator", JSON.stringify({ products: newProducts }))
  }

  const handleCreateProduct = (name) => {
    const newProduct = {
      id: nanoid(),
      name,
      baseSku: "",
      delimiter: " | ",
      setPrefix: "SET",
      pieces: [],
      variants: []
    }

    const newProducts = [...products, newProduct]
    setProducts(newProducts)
    setActiveTab(newProduct.id)
    saveToLocalStorage(newProducts)
    
    toast({
      title: "The product was added",
      description: `${name} has been successfully added.`
    })
  }

  return (
    <ScrollArea className="h-full flex flex-col">
      <main className="min-h-[cal(100vh_-_56px)]  flex-1 container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex items-center">
            {products.map((product) => (
              <TabsTrigger key={product.id} value={product.id}>
                {product.name}
              </TabsTrigger>
            ))}
            <Button 
              variant="ghost" 
              onClick={() => setIsNewProductOpen(true)}
              className="ml-2 border text-black dark:text-white hover:text-white hover:bg-green-700 h-7"
            >
              New Product
            </Button>
          </TabsList>

          {products.map((product) => (
            <TabsContent key={product.id} value={product.id}>
              <ProductTab 
                product={product}
                onUpdate={(updatedProduct) => {
                  const newProducts = products.map(p => 
                    p.id === updatedProduct.id ? updatedProduct : p
                  )
                  setProducts(newProducts)
                  saveToLocalStorage(newProducts)
                }}
                onDelete={(productId) => {
                  const newProducts = products.filter(p => p.id !== productId)
                  setProducts(newProducts)
                  saveToLocalStorage(newProducts)
                  if (newProducts.length > 0) {
                    setActiveTab(newProducts[0].id)
                  }
                }}
              />
            </TabsContent>
          ))}
        </Tabs>

        <NewProductDialog 
          open={isNewProductOpen}
          onOpenChange={setIsNewProductOpen}
          onSubmit={handleCreateProduct}
        />
      </main>
    </ScrollArea>
  )
} 