-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD');

-- CreateTable
CREATE TABLE "apis" (
    "id" SERIAL NOT NULL,
    "product_id_regex" VARCHAR,
    "url" VARCHAR,
    "parameters" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_columns" (
    "id" BIGSERIAL NOT NULL,
    "item_id" INTEGER,
    "name" VARCHAR,
    "position" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "subject" BOOLEAN,
    "align" INTEGER DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data" (
    "id" SERIAL NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR,
    "url" VARCHAR,
    "text" TEXT,
    "updated_at" TIMESTAMP(6),
    "group" VARCHAR,
    "dynamic" BOOLEAN NOT NULL DEFAULT false,
    "digits_after_decimal" INTEGER,
    "prefix" VARCHAR,
    "postfix" VARCHAR,
    "global" BOOLEAN,
    "index_error" TEXT,
    "indexer_id" INTEGER,
    "affiliate_link" VARCHAR,
    "last_attempted_update" TIMESTAMP(6) DEFAULT '2015-08-28 16:48:03'::timestamp without time zone,
    "force_digits_after_decimal" BOOLEAN,
    "last_index_response" TEXT,
    "fileId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "hash" TEXT,
    "name" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT E'{}',
    "byteSize" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embeds" (
    "id" BIGSERIAL NOT NULL,
    "url" TEXT,
    "item_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "query_params" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR DEFAULT E'',
    "hostname" VARCHAR,
    "path_extension" TEXT,
    "decimal_places" INTEGER,
    "selector" TEXT,
    "cookie" TEXT,
    "index_type" INTEGER NOT NULL DEFAULT 0,
    "api_id" INTEGER,
    "post_processor" TEXT,
    "browser" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "second_selector" TEXT,
    "second_indexer_id" INTEGER,
    "click" TEXT,
    "query_params" JSONB DEFAULT E'{}',
    "decode_url" BOOLEAN,
    "keep_old_value" BOOLEAN NOT NULL DEFAULT true,
    "seconds_between_updates" INTEGER NOT NULL DEFAULT 39600,
    "request_headers" JSONB NOT NULL DEFAULT E'{}',
    "selectors" JSONB NOT NULL DEFAULT E'[]',
    "divide_by" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "url" VARCHAR NOT NULL DEFAULT E'',
    "content" TEXT NOT NULL,
    "contentState" JSONB,
    "generic_name" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "type" INTEGER NOT NULL DEFAULT 1,
    "standalone" BOOLEAN DEFAULT false,
    "domain_id" INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "title_type" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "preview" BOOLEAN DEFAULT false,
    "copy_item" BOOLEAN DEFAULT false,
    "copy_sort_by" VARCHAR,
    "copy_position" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" BIGSERIAL NOT NULL,
    "datum_id" INTEGER NOT NULL,
    "item_id" INTEGER,
    "featured" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "position" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties_property_templates" (
    "id" BIGSERIAL NOT NULL,
    "property_id" BIGINT NOT NULL,
    "property_template_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_templates" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "hostname" VARCHAR,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT E'USER',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_comparison_columns_on_item_id" ON "comparison_columns"("item_id");

-- CreateIndex
CREATE INDEX "index_data_on_indexer_id" ON "data"("indexer_id");

-- CreateIndex
CREATE UNIQUE INDEX "File.key_unique" ON "File"("key");

-- CreateIndex
CREATE UNIQUE INDEX "File.hash_unique" ON "File"("hash");

-- CreateIndex
CREATE INDEX "index_embeds_on_item_id" ON "embeds"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_embeds_on_url_and_query_params" ON "embeds"("url", "query_params");

-- CreateIndex
CREATE INDEX "index_indexers_on_api_id" ON "indexers"("api_id");

-- CreateIndex
CREATE INDEX "items_item_kind_id_fk" ON "items"("type");

-- CreateIndex
CREATE UNIQUE INDEX "index_items_on_url_and_domain_id" ON "items"("url", "domain_id");

-- CreateIndex
CREATE INDEX "index_children_child" ON "children"("item_id");

-- CreateIndex
CREATE INDEX "index_children_parent" ON "children"("parent_id");

-- CreateIndex
CREATE INDEX "index_properties_on_datum_id" ON "properties"("datum_id");

-- CreateIndex
CREATE INDEX "index_properties_on_item_id" ON "properties"("item_id");

-- CreateIndex
CREATE INDEX "index_data_property_templates_on_property_id" ON "properties_property_templates"("property_id");

-- CreateIndex
CREATE INDEX "index_data_property_templates_on_property_template_id" ON "properties_property_templates"("property_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token.hashedToken_type_unique" ON "Token"("hashedToken", "type");

-- AddForeignKey
ALTER TABLE "comparison_columns" ADD FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data" ADD FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeds" ADD FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexers" ADD FOREIGN KEY ("api_id") REFERENCES "apis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD FOREIGN KEY ("parent_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD FOREIGN KEY ("datum_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
