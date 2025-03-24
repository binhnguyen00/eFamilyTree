export type OverlayCtx = {
  isOpen: boolean,
  openWithContent: (content: React.ReactNode) => void,
  close: () => void,
}