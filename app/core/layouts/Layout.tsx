/* eslint-disable @next/next/no-img-element */
import { MouseEventHandler, ReactNode, useState } from "react"

import Link from "next/link"
import { Routes } from "@blitzjs/next"

import Head from "next/head"
import { Disclosure } from "@headlessui/react"
import { SearchIcon } from "@heroicons/react/solid"
import { MenuIcon, XIcon } from "@heroicons/react/outline"
import debounce from "lodash/debounce"

import ct from "class-types.macro"
import { prefetch, prefetchFromEventTarget } from "app/prefetchData"
import { useRouter } from "next/router"

type NavItem = {
  text: string
  active?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

type LayoutProps = {
  title?: string
  children: ReactNode
  navItems?: NavItem[]
}

export default function Layout({
  title,
  children,
  navItems = [],
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title || "idealguides"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        {/* https://tailwindui.com/components/application-ui/navigation/navbars */}
        <Disclosure as="nav" className="bg-lime-600">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                  <div className="flex items-center pl-0 px-2 lg:px-0">
                    <Link href={{ pathname: "/" }}>
                      <a
                        className={ct(
                          "my-auto",
                          "flex",
                          "flex-shrink-0",
                          "items-center",
                          "rounded-lg",
                          "text-2xl",
                          "font-medium",
                          "text-white",
                          "ring-white",
                          "focus:outline-none",
                          "focus:ring-2",
                          "md:row-span-2",
                        )}
                        style={{
                          fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                        }}
                        onPointerEnter={prefetchFromEventTarget()}
                        onTouchStart={prefetchFromEventTarget()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={ct(
                            "mr-0",
                            "inline-block",
                            "h-8",
                            "w-8",
                            "rotate-180",
                            "text-amber-500",
                            "md:mr-2",
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.6}
                            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>

                        <span
                          className={ct(
                            "hidden",
                            "font-medium",
                            "lg:inline-block",
                          )}
                        >
                          Idealguides
                        </span>
                      </a>
                    </Link>
                    <div className="hidden lg:block lg:ml-6">
                      <div className="flex space-x-4">
                        {navItems.map(({ text, active, onClick }) =>
                          onClick ? (
                            <button
                              className={ct(
                                "rounded-md",
                                "py-2",
                                "px-3",
                                "text-sm",
                                "font-medium",
                                "ring-white",
                                "focus:outline-none",
                                "focus:ring-2",
                                active
                                  ? ct("bg-lime-900", "text-white")
                                  : ct(
                                      "text-gray-300",
                                      "hover:bg-lime-700",
                                      "hover:text-white",
                                    ),
                              )}
                              key={text}
                              onClick={onClick}
                            >
                              {text}
                            </button>
                          ) : (
                            <span
                              className={ct(
                                "rounded-md",
                                "py-2",
                                "px-3",
                                "text-sm",
                                "font-medium",
                                active
                                  ? ct("bg-lime-900", "text-white")
                                  : ct(
                                      "text-gray-300",
                                      "hover:bg-lime-700",
                                      "hover:text-white",
                                    ),
                              )}
                              key={text}
                            >
                              {text}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <Search />
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:block lg:ml-4">
                    <div className="flex items-center">
                      {/* Profile dropdown */}
                      <Link href={{ pathname: "/user" }}>
                        <a
                          className={ct(
                            "rounded-md",
                            "py-2",
                            "px-3",
                            "text-sm",
                            "font-medium",
                            "text-gray-300",
                            "ring-white",
                            "hover:bg-lime-700",
                            "hover:text-white",
                            "focus:outline-none",
                            "focus:ring-2",
                          )}
                        >
                          Account
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map(({ text, active, onClick }) =>
                    onClick ? (
                      <button
                        className={ct(
                          "block",
                          "rounded-md",
                          "rounded-md",
                          "py-2",
                          "px-3",
                          "text-base",
                          "font-medium",
                          "text-white",
                          active
                            ? ct("bg-lime-900", "text-white")
                            : ct(
                                "text-gray-300",
                                "hover:bg-lime-700",
                                "hover:text-white",
                              ),
                        )}
                        key={text}
                        onClick={onClick}
                      >
                        {text}
                      </button>
                    ) : (
                      <span
                        className={ct(
                          "rounded-md",
                          "py-2",
                          "px-3",
                          "text-sm",
                          "font-medium",
                          active
                            ? ct("bg-lime-900", "text-white")
                            : ct(
                                "text-gray-300",
                                "hover:bg-lime-700",
                                "hover:text-white",
                              ),
                        )}
                        key={text}
                      >
                        {text}
                      </span>
                    ),
                  )}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="px-2 space-y-1">
                    <Link href={{ pathname: "/user" }}>
                      <a
                        className={ct(
                          "block",
                          "rounded-md",
                          "rounded-md",
                          "py-2",
                          "py-2",
                          "px-3",
                          "px-3",
                          "text-base",
                          "text-sm",
                          "font-medium",
                          "font-medium",
                          "text-gray-400",
                          "text-gray-300",
                          "ring-white",
                          "hover:bg-lime-700",
                          "hover:bg-lime-700",
                          "hover:text-white",
                          "hover:text-white",
                          "focus:outline-none",
                          "focus:ring-2",
                        )}
                      >
                        Account
                      </a>
                    </Link>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">{children}</main>
    </>
  )
}

function Search() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  return (
    <form
      action="/search"
      className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end"
      onSubmit={async (event) => {
        event.preventDefault()

        await router.push({ pathname: "/search", query: { query } })
      }}
    >
      <div className="max-w-lg w-full lg:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="query"
            value={query}
            onChange={({ target }) => {
              setQuery(target.value)

              if (!target.value) return

              debouncedPrefetch(target)
            }}
            className={ct(
              "block",
              "w-full",
              "rounded-md",
              "border",
              "border-transparent",
              "bg-lime-700",
              "py-2",
              "pl-10",
              "pr-3",
              "leading-5",
              "text-gray-300",
              "placeholder-gray-400",
              "focus:border-white",
              "focus:bg-white",
              "focus:text-gray-900",
              "focus:outline-none",
              "focus:ring-white",
              "sm:text-sm",
            )}
            placeholder="Search"
            type="search"
          />
        </div>
      </div>
    </form>
  )
}

const debouncedPrefetch = debounce((target: EventTarget & HTMLInputElement) => {
  const route = Routes.ItemsSearch({ query: target.value })

  if (
    route.query &&
    typeof route.query === "object" &&
    typeof route.query.query === "string"
  ) {
    prefetch({
      params: { query: route.query.query },
      href: window.location.origin + route.pathname,
    })
  }
}, 200)
