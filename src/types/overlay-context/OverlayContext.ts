export type OverlayCtx = {
  isOpen: boolean,
  open: ({ title, description, content }: { 
    title: string, 
    description?: string,
    content: React.ReactNode 
  }) => void,
  close: () => void,
  greetings: () => void,
}