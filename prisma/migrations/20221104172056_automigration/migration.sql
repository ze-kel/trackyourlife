-- CreateEnum
CREATE TYPE "TrackableType" AS ENUM ('boolean', 'number', 'range');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trackable" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TrackableType" NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "Trackable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackableRecord" (
    "id" TEXT NOT NULL,
    "trackableId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TrackableRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackableRecord_trackableId_date_unique_constraint" ON "TrackableRecord"("trackableId", "date");

-- AddForeignKey
ALTER TABLE "Trackable" ADD CONSTRAINT "Trackable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackableRecord" ADD CONSTRAINT "TrackableRecord_trackableId_fkey" FOREIGN KEY ("trackableId") REFERENCES "Trackable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
