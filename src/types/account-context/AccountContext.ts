export type AccountCtx = {
  needRegisterClan: boolean,
  needRegisterAccount: boolean,
  registerClan: () => void,
  registerAccount: () => void,
}