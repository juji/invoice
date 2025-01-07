
import type { JInvoice } from '$lib/data/types';
import type { PageServerLoad, EntryGenerator } from './$types';
import { readdir } from 'fs/promises';

export const load: PageServerLoad = async ({ params }) => {

  const { id } = params
  const data = await import(`$lib/data/invoice/${id}.json`).then(v => v.default)

	return {
		id,
    data: data  as JInvoice
	};
};

export const entries: EntryGenerator = async () => {

  const files = await readdir(`./src/lib/data/invoice`)
  
  return files.map(v => ({
    id: v.replace('.json','')
  }));
  
};

