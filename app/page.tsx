import Link from "next/link";
import { addClient, readData} from "../lib/dataStore";
import AddClientForm from "./components/AddClientForm";
import { Client } from "./type";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN;


export default async function Home() {
  const clients = await readData();
  console.log('Fetched clients:', clients);

  async function handleAddClient(newClient: Client) {
    "use server";
    await addClient(newClient);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to My Client List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Clients</h2>
          {Array.isArray(clients) && clients.length > 0 ? (
            <ul className="space-y-2">
              {clients.map((client: Client) => (
                <li key={client.id} className="bg-white shadow rounded-lg p-4">
                  <Link
                    href={`http://${client.slug}.${BASE_DOMAIN}`}
                    className="text-blue-600 hover:underline"
                  >
                    {client.name}
                  </Link>
                  <p className="text-sm text-gray-600">{client.company}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No clients yet. Add one to get started!</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
          <AddClientForm onAddClient={handleAddClient} />
        </div>
      </div>
    </div>
  );
}
