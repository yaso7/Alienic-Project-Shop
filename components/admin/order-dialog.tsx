"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useOrderDialog } from "@/hooks/use-order-dialog"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Minus, Search } from "lucide-react"

interface OrderProduct {
  productId: string
  quantity: number
  product?: {
    id: string
    name: string
    price: string
    priceNumeric: number
  }
}

interface Order {
  id?: string
  customerName: string
  customerPhone?: string
  customerUsername?: string
  source: "Telegram" | "Instagram" | "Site"
  totalAmount: number
  status: "Pending" | "Confirmed" | "Ready" | "Shipped" | "Delivered" | "Cancelled"
  notes?: string
  estimatedDelivery?: string
  actualDelivery?: string
  products?: OrderProduct[]
}

interface Product {
  id: string
  name: string
  price: string
  priceNumeric: number
  isAvailable: boolean
}

export function OrderDialog() {
  const { isOpen, editingOrder, closeDialog } = useOrderDialog()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [formData, setFormData] = useState<Order>({
    customerName: "",
    customerPhone: "",
    customerUsername: "",
    source: "Telegram",
    totalAmount: 0,
    status: "Pending",
    notes: "",
    estimatedDelivery: "",
    actualDelivery: "",
    products: [],
  })

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return []
    return products.filter(product => 
      product.isAvailable && 
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
    )
  }, [products, productSearchQuery])

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
      if (editingOrder) {
        setFormData(editingOrder)
      } else {
        setFormData({
          customerName: "",
          customerPhone: "",
          customerUsername: "",
          source: "Telegram",
          totalAmount: 0,
          status: "Pending",
          notes: "",
          estimatedDelivery: "",
          actualDelivery: "",
          products: [],
        })
      }
    }
  }, [editingOrder, isOpen])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products?status=available&pageSize=100")
      if (response.ok) {
        const data = await response.json()
        // API returns { products, total, page, pageSize }
        setProducts(Array.isArray(data.products) ? data.products : [])
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  const addProductToOrder = (product: Product) => {
    const existingProduct = formData.products?.find(p => p.productId === product.id)
    if (existingProduct) {
      updateProductQuantity(product.id, existingProduct.quantity + 1)
    } else {
      const newProduct: OrderProduct = {
        productId: product.id,
        quantity: 1,
        product
      }
      setFormData(prev => ({
        ...prev,
        products: [...(prev.products || []), newProduct],
        totalAmount: prev.totalAmount + product.priceNumeric
      }))
    }
  }

  const removeProductFromOrder = (productId: string) => {
    const product = formData.products?.find(p => p.productId === productId)
    if (product) {
      setFormData(prev => ({
        ...prev,
        products: prev.products?.filter(p => p.productId !== productId) || [],
        totalAmount: prev.totalAmount - (product.product?.priceNumeric || 0) * product.quantity
      }))
    }
  }

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromOrder(productId)
      return
    }
    
    const product = formData.products?.find(p => p.productId === productId)
    if (product) {
      const oldTotal = (product.product?.priceNumeric || 0) * product.quantity
      const newTotal = (product.product?.priceNumeric || 0) * quantity
      const difference = newTotal - oldTotal
      
      setFormData(prev => ({
        ...prev,
        products: prev.products?.map(p => 
          p.productId === productId ? { ...p, quantity } : p
        ) || [],
        totalAmount: prev.totalAmount + difference
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingOrder?.id 
        ? `/api/admin/orders/${editingOrder.id}`
        : "/api/admin/orders"
      
      const response = await fetch(url, {
        method: editingOrder?.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Order ${editingOrder?.id ? "updated" : "created"} successfully`,
        })
        closeDialog()
        window.location.reload()
      } else {
        throw new Error("Failed to save order")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingOrder?.id ? "update" : "create"} order`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return formData.products?.reduce((sum, product) => {
      const productPrice = product.product?.priceNumeric || 0
      return sum + (productPrice * product.quantity)
    }, 0) || 0
  }

  const handleInputChange = (field: keyof Order, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingOrder?.id ? "Edit Order" : "Add New Order"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">Source *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value: "Telegram" | "Instagram" | "Site") => 
                      handleInputChange("source", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Telegram">Telegram</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone || ""}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerUsername">Username (Instagram/Telegram)</Label>
                  <Input
                    id="customerUsername"
                    value={formData.customerUsername || ""}
                    onChange={(e) => handleInputChange("customerUsername", e.target.value)}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount ($) *</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={(e) => handleInputChange("totalAmount", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Order["status"]) => 
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                  <Input
                    id="estimatedDelivery"
                    type="date"
                    value={formData.estimatedDelivery && !isNaN(new Date(formData.estimatedDelivery).getTime()) 
                      ? new Date(formData.estimatedDelivery).toISOString().slice(0, 10) 
                      : ""}
                    onChange={(e) => handleInputChange("estimatedDelivery", e.target.value)}
                  />
                </div>
                
                {formData.status === "Delivered" && (
                  <div className="space-y-2">
                    <Label htmlFor="actualDelivery">Actual Delivery</Label>
                    <Input
                      id="actualDelivery"
                      type="date"
                      value={formData.actualDelivery && !isNaN(new Date(formData.actualDelivery).getTime()) 
                        ? new Date(formData.actualDelivery).toISOString().slice(0, 10) 
                        : ""}
                      onChange={(e) => handleInputChange("actualDelivery", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about the order"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Products</h3>
                  
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {loadingProducts ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading products...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-lg font-semibold text-primary">{product.price}</p>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addProductToOrder(product)}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Order
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {filteredProducts.length === 0 && !loadingProducts && (
                    <div className="text-center py-8 text-muted-foreground">
                      {productSearchQuery ? "No products found matching your search." : "No available products found."}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Products</h3>
                  {formData.products && formData.products.length > 0 ? (
                    <div className="space-y-2">
                      {formData.products.map((orderProduct) => (
                        <div key={orderProduct.productId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{orderProduct.product?.name}</span>
                            <Badge variant="secondary">x{orderProduct.quantity}</Badge>
                            <span className="text-sm text-muted-foreground">
                              ${((orderProduct.product?.priceNumeric || 0) * orderProduct.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateProductQuantity(orderProduct.productId, orderProduct.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateProductQuantity(orderProduct.productId, orderProduct.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeProductFromOrder(orderProduct.productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      No products added to order
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Order Total */}
          {formData.products && formData.products.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Order Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingOrder?.id ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
