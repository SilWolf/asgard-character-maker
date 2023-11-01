/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  readonly VITE_GOOGLE_DRIVE_API_KEY: string;
  readonly VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID: string;
  readonly VITE_GOOGLE_DRIVE_EXAMPLE_FOLDER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
