import { supabase } from './supabase';
import type { Client } from '../app/type';

export async function readData(): Promise<Client[]> {
  try {
    const { data, error, count } = await supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error.message);
      throw new Error('Failed to fetch clients');
    }

    console.log('Total rows (count):', count);
    console.log('Fetched clients:', data);

    if (!data || data.length === 0) {
      console.warn('No clients found in the database');
      return [];
    }

    return data;
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return [];
  }
}

export async function writeData(clients: Client[]): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .insert(clients)

  if (error) {
    console.error('Error writing clients:', error)
    throw error
  }
}

export async function addClient(client: Client): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .insert([client])

  if (error) {
    console.error('Error adding client:', error)
    throw error
  }
}

// Add this debug function
export async function debugDatabase() {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
  console.log('Debug Database Results:', {
    data,
    error,
    count: data?.length,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
