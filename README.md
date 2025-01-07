# Invoice & Receipt

create data in `lib/data/`

and print as pdf

## example

```
`lib/data/invoice/myinvoice.json`
```

Will be availabe at:

```
/invoice/myinvoice
```

and

```
`lib/data/receipt/myreceipt.json`
```

Will be availabe at:

```
/receipt/myreceipt
```

## Filenames

Filenames is being used as id. It should reflect: 

1. Client
2. type
3. date
4. revisions

Example:

```
Client: BIGFOOT
type: invoice
date: 2004-12-12
revision num: 9

Name: BIGFOOT-i-2004-12-12-9
```

```
Client: BIGFOOT
type: receipt
date: 2004-10-12
revision num: 0

Name: BIGFOOT-r-2004-10-12-0
```
