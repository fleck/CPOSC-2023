// These reference imports provide type definitions for things like styled-jsx and css modules
/// <reference types="next" />
/// <reference types="next/types/global" />

declare global {
  var app: {
    browsers?: Map<string, import("ws").WebSocket>
    users?: Map<string, import("ws").WebSocket>
  }
}

export {}
