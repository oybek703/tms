import TimeDepoClients from './TimeDepoClients'

async function getTimeDepoClientsTable(date: string) {
  return await (new TimeDepoClients(date).getRows())
}

export default getTimeDepoClientsTable
