# Making better how to's and buying guides

### Migrating production database

- Add production database connection string to .env.production.local
- run `NODE_ENV=production blitz prisma migrate deploy`
- Disable DATABASE_URL in .env.production.local to ensure no accidental modification of production DB happens!

### finding bad links

export URLS as array and then run

```ts
let c = _.uniq(r).filter(
  (u) =>
    !u.includes("www.do-it-yourself-invitations") &&
    !u.includes("wp-content") &&
    !u.includes("wp-admin") &&
    !u.includes("wp-includes") &&
    !u.includes(".php"),
)
```

## Moving towards vanilla forms

Here's rough code on how to grab the updates

```ts
<form
  onChange={(e) => {
    const r = new FormData(e.currentTarget)

    const en = [...r.entries()].flatMap(([key, value]) =>
      value instanceof File ? [] : [[key, value]],
    )

    const l = new window.URLSearchParams(en).toString()

    const f = parse(l)

    console.log({ f })
  }}
></form>
```
