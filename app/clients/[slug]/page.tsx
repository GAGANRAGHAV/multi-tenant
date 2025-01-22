import { notFound } from "next/navigation";
import type { Client } from "../../type";
import { readData } from "../../../lib/dataStore";

export default async function ClientPage({ params }: { params: { slug: string } }) {
  const clients = await readData();
  const client = clients.find((c: Client) => c.slug === params.slug);

  if (!client) {
    return notFound();
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">{client.name}</h1>
      <p className="text-gray-700 mb-2">Email: {client.email}</p>
      <p className="text-gray-700 mb-2">Company: {client.company}</p>
      <p className="text-gray-700">Notes: {client.notes}</p>
    </div>
  );
}
