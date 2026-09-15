import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Instant updates when products are added or deleted in CRM
})

const originalFetch = client.fetch.bind(client);
client.fetch = async (...args: any[]) => {
  try {
    return await originalFetch(...args as [any]);
  } catch (err) {
    console.warn("Sanity fetch suppressed locally:", err);
    return null;
  }
}
