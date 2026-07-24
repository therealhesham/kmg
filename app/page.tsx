import { prisma } from "@/lib/prisma";
import ClientHome from "./home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  let companies: any[] = [];
  let settings: any = null;

  try {
    companies = await prisma.company.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      });
    }
  } catch (error) {
    console.error("Prisma query error on home page:", error);
  }

  return <ClientHome companies={companies} settings={settings} />;
}



