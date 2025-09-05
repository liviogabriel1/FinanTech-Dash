-- CreateEnum
CREATE TYPE "public"."Recurrence" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "public"."ScheduledTransaction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "frequency" "public"."Recurrence" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dayOfMonth" INTEGER,
    "dayOfWeek" INTEGER,
    "nextRunDate" TIMESTAMP(3) NOT NULL,
    "walletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ScheduledTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ScheduledTransaction" ADD CONSTRAINT "ScheduledTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduledTransaction" ADD CONSTRAINT "ScheduledTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
