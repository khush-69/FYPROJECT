-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "addressLine1" VARCHAR NOT NULL,
    "addressLine2" VARCHAR,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "country" VARCHAR NOT NULL,
    "zipCode" VARCHAR,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR,
    "customerId" UUID,

    CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR,
    "email" VARCHAR,
    "password" VARCHAR,
    "phone" VARCHAR,

    CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "price" INTEGER NOT NULL,
    "image" VARCHAR NOT NULL,
    "category" VARCHAR NOT NULL,
    "stock" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "numReviews" INTEGER NOT NULL,
    "timeToCook" TEXT NOT NULL,

    CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fdb2f3ad8115da4c7718109a6eb" ON "customer"("email");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "FK_b5976584943ec93aa5394a55320" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
