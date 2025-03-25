export type OverlayCtx = {
  isOpen: boolean,
  open: ({ title, description, content, className }: { 
    title: string, 
    content: React.ReactNode,
    description?: string,
    className?: string
  }) => void,
  close: () => void,
  greetings: () => void,
}