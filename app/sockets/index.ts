// We put the Maps in a global because we use them in our custom server and that doesn't play nice
// with the rest of the applications modules.

if (!global.app) {
  global.app = {}
}

if (!global.app.browsers) {
  global.app.browsers = new Map()
}

export const browsers = global.app.browsers

if (!global.app.users) {
  global.app.users = new Map()
}

export const users = global.app.users
