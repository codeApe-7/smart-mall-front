/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MALL_USER_API_BASE_URL?: string
  readonly VITE_MALL_USER_WS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
