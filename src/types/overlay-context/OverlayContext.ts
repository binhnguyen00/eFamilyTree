export type OverlayCtx = {
  isOpen: boolean,
  open: ({ title, content }: { title: string, content: React.ReactNode }) => void,
  close: () => void,
}