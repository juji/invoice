# Invoice

Is an Invoice and Receipt creator for freelancing web developers.

## Example Results

- [invoice](https://github.com/juji/invoice/blob/main/static/asdf-inv-2025.01.06-1.pdf)
- [receipt](https://github.com/juji/invoice/blob/main/static/asdf-receipt-2025.01.07-1.pdf)

## Tech stack

It uses [Svelte](https://svelte.dev/) with [TypeScript](https://www.typescriptlang.org/).
Along with [bun](https://bun.sh/), for that [$](https://bun.sh/guides/runtime/shell) syntax that this software is using.

## Starting: installing dependencies

```zsh
bun i
```

## Creating Clients, Invoice and Receipt

```zsh
bun run create
```

It will ask you what to do.

<p align="center">
  <img width="842" height="630" src="https://raw.githubusercontent.com/juji/invoice/refs/heads/main/static/screenshot.png">
</p>

## Security and Storage

It requires you to have a secure accessible subscription/payment url (https).

A secure url to view the payment receipt is optional, 
since you can just send the original payment receipt with your receipt.

In case you don't set a secure url for payment receipt, it will say:
```
Proof of Payment was sent along with this document.
```

For storage, it is advised to keep this in a private repo. Since your data is written in json format.

## Customization

Checkout `src/lib/components`.

The layout is provided in `main.svelte`. The rest is as the names suggest.

Colors are available in `src/lib/styles/main.css`.

Start you dev server:

```zsh
bun run dev
```
and start doing changes.

Cheers, juji.
