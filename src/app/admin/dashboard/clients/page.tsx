import ClientsManager from "@/components/admin/managers/ClientsManager"
import { prisma } from "@/lib/prisma"
import { Client } from "@prisma/client"

async function getClients() {
  const [
    clients,
  ] = await Promise.all([
    prisma.client.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return {
    clients,
  }
}
 

const ClientsPage = async () => {
  const { clients } = await getClients()
  return <ClientsManager clients={clients as Client[]} />
}

export default ClientsPage