-- CreateIndex
CREATE INDEX "items_name" ON items USING gin (name gin_trgm_ops);
