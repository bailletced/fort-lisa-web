-- CreateEnum
CREATE TYPE "EAccountProvider" AS ENUM ('FACEBOOK', 'GOOGLE', 'PASSWORD');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashed_password" TEXT,
    "salt" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "last_connection_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "EAccountProvider" NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "user_session_subscriptions" (
    "user_session_subscription_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sess_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_session_subscriptions_pkey" PRIMARY KEY ("user_session_subscription_id")
);

-- CreateTable
CREATE TABLE "features" (
    "feature_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "features_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "permission_sets" (
    "permission_set_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "permission_sets_pkey" PRIMARY KEY ("permission_set_id")
);

-- CreateTable
CREATE TABLE "permission_set_role_subscriptions" (
    "permission_set_role_subscription_id" TEXT NOT NULL,
    "permission_set_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "permission_set_role_subscriptions_pkey" PRIMARY KEY ("permission_set_role_subscription_id")
);

-- CreateTable
CREATE TABLE "permission_set_user_subscriptions" (
    "permission_set_user_subscription_id" TEXT NOT NULL,
    "permission_set_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "permission_set_user_subscriptions_pkey" PRIMARY KEY ("permission_set_user_subscription_id")
);

-- CreateTable
CREATE TABLE "operation_stores" (
    "operation_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "operation_stores_pkey" PRIMARY KEY ("operation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sess_key" ON "sessions"("sess");

-- CreateIndex
CREATE INDEX "user_session_subscriptions_user_session_subscription_id_idx" ON "user_session_subscriptions"("user_session_subscription_id");

-- CreateIndex
CREATE INDEX "features_feature_id_idx" ON "features"("feature_id");

-- CreateIndex
CREATE INDEX "roles_role_id_idx" ON "roles"("role_id");

-- CreateIndex
CREATE INDEX "permission_sets_permission_set_id_idx" ON "permission_sets"("permission_set_id");

-- CreateIndex
CREATE INDEX "permission_set_role_subscriptions_permission_set_role_subsc_idx" ON "permission_set_role_subscriptions"("permission_set_role_subscription_id");

-- CreateIndex
CREATE INDEX "permission_set_user_subscriptions_permission_set_user_subsc_idx" ON "permission_set_user_subscriptions"("permission_set_user_subscription_id");

-- CreateIndex
CREATE INDEX "operation_stores_operation_id_idx" ON "operation_stores"("operation_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session_subscriptions" ADD CONSTRAINT "user_session_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("feature_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_set_role_subscriptions" ADD CONSTRAINT "permission_set_role_subscriptions_permission_set_id_fkey" FOREIGN KEY ("permission_set_id") REFERENCES "permission_sets"("permission_set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_set_role_subscriptions" ADD CONSTRAINT "permission_set_role_subscriptions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_set_user_subscriptions" ADD CONSTRAINT "permission_set_user_subscriptions_permission_set_id_fkey" FOREIGN KEY ("permission_set_id") REFERENCES "permission_sets"("permission_set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_set_user_subscriptions" ADD CONSTRAINT "permission_set_user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
