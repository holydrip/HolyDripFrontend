import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
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
