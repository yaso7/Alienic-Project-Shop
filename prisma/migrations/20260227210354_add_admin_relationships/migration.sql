-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_madeBy_fkey" FOREIGN KEY ("madeBy") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
