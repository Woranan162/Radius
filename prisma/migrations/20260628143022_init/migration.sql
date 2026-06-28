-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "restore_time_min" INTEGER NOT NULL,
    "restore_cost" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependencies" (
    "id" TEXT NOT NULL,
    "dependent_id" TEXT NOT NULL,
    "dependency_id" TEXT NOT NULL,

    CONSTRAINT "dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_runs" (
    "id" TEXT NOT NULL,
    "failed_ids" TEXT[],
    "result_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dependencies_dependent_id_dependency_id_key" ON "dependencies"("dependent_id", "dependency_id");

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_dependent_id_fkey" FOREIGN KEY ("dependent_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_dependency_id_fkey" FOREIGN KEY ("dependency_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
