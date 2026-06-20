import { prisma } from "@/lib/prisma";
import ClientHome from "./home-client";

export default async function Home() {
  const companies = await prisma.company.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return <ClientHome companies={companies} />;
}

