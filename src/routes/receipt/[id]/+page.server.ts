
import type { JReceipt } from '$lib/data/types';
import type { PageServerLoad, EntryGenerator } from './$types';
import { readdir } from 'fs/promises';

export const load: PageServerLoad = async ({ params }) => {

  const { id } = params
  const receipt = await import(`$lib/data/receipt/${id}.json`).then(v => v.default)
  const invoice = await import(`$lib/data/invoice/${receipt.invoiceId}.json`).then(v => v.default)

	return {
		id,
    data: {
      ...receipt,
      invoiceRef: invoice
    } as JReceipt
	};
};


export const entries: EntryGenerator = async () => {

  const files = await readdir(`./src/lib/data/receipt`)
  
	return files.map(v => ({
    id: v.replace('.json','')
  }));
  
};

