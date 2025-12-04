/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IK_BASE: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
