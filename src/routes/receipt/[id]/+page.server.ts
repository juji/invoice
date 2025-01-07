
import type { JReceipt } from '$lib/data/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {

  const { id } = params
  const receipt = await import(`$lib/data/receipt/${id}.json`).then(v => v.default)
  const invoice = await import(`$lib/data/invoice/${receipt.invoiceId}.json`).then(v => v.default)
  const client = await import(`$lib/data/client/${invoice.client}.json`).then(v => v.default)

	return {
		id,
    data: {
      ...receipt,
      invoiceRef: {
        ...invoice,
        client
      }, 
    } as JReceipt
	};
};