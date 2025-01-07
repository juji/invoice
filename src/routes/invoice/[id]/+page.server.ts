
import type { JInvoice } from '$lib/data/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {

  const { id } = params
  const data = await import(`$lib/data/invoice/${id}.json`).then(v => v.default)
  const client = await import(`$lib/data/client/${data.client}.json`).then(v => v.default)

	return {
		id,
    data: {
      ...data,
      client
    } as JInvoice
	};
};