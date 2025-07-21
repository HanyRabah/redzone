import ClientsManager from "@/components/Dashboard/Clients"
import { prisma } from "@/lib/prisma"
import { Client } from "@prisma/client"

async function getClients() {
  const [
    clients,
  ] = await Promise.all([
    prisma.client.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.sections.findMany({ where: { page: 'clients' } }),
  ])

  return {
    clients,
  }
}

export default async function Page() {
  const { clients } = await getClients()
  return <ClientsManager clients={clients as Client[]}  />
}