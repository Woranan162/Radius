import { PrismaClient } from "@prisma/client";
import { sampleGraph } from "../src/lib/simulation/sample-graph";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Radius demo graph…");

  await prisma.dependency.deleteMany();
  await prisma.service.deleteMany();

  for (const service of sampleGraph.services) {
    await prisma.service.create({
      data: {
        id: service.id,
        name: service.name,
        tier: service.tier,
        weight: service.weight,
        restoreTimeMin: service.restoreTimeMin,
        restoreCost: service.restoreCost,
      },
    });
  }

  for (const dep of sampleGraph.dependencies) {
    await prisma.dependency.create({
      data: {
        dependentId: dep.from,
        dependencyId: dep.to,
      },
    });
  }

  console.log(
    `Done — ${sampleGraph.services.length} services, ${sampleGraph.dependencies.length} dependencies.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
