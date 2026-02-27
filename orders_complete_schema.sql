-- Complete SQL for Orders Module (from scratch)

-- CreateEnum for OrderSource
CREATE TYPE "OrderSource" AS ENUM ('Telegram', 'Instagram', 'Site');

-- CreateEnum for OrderStatus (includes 'Ready' as requested)
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Confirmed', 'Ready', 'Shipped', 'Delivered', 'Cancelled');

-- CreateTable for orders
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerUsername" TEXT,
    "source" "OrderSource" NOT NULL DEFAULT 'Telegram',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable for order_products (many-to-many relationship with products)
CREATE TABLE "order_products" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for unique order-product combination
CREATE UNIQUE INDEX "order_products_orderId_productId_key" ON "order_products"("orderId", "productId");

-- AddForeignKey constraints
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_fkey" 
FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productId_fkey" 
FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
