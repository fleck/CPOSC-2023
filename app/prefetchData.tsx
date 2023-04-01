import Router from "next/router"
// @ts-expect-error we're adding this export via the webpack exports-loader
import { fetchNextData } from "next/dist/shared/lib/router/router"

type Params = { [key: string]: string }

export const prefetchFromEventTarget = (params?: Params) => {
  return ({ target }: { target: EventTarget }) => {
    if (!(target instanceof HTMLElement)) return

    const href = target.closest("a")?.href

    if (!href) return

    prefetch({ params, href })
  }
}

export const prefetch = ({
  href,
  params,
}: {
  href: string
  params?: Params
}) => {
  const dataURL = new URL(href)
  params &&
    Object.entries(params).forEach(([key, value]) => {
      dataURL.searchParams.append(key, value)
    })

  const dataHref = Router.router?.pageLoader.getDataHref({
    href: dataURL.toString(),
    asPath: dataURL.toString(),
    locale: Router.locale,
  })

  if (dataHref) {
    fetchNextData({
      dataHref,
      isServerRender: true,
      inflightCache: Router.router!.sdc,
      parseJSON: true,
      persistCache: true,
      isPrefetch: true,
    })
  }
}
