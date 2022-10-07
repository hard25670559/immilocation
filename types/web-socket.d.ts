declare type WebSocketPackage<T> = {
  type: PackageType,
  data: T,
}

declare type ClientSendMessage = {
  message: string,
}

declare type ServerSendInitMessage = {
  id: string,
}

declare type PackageType = 'server-init' | 'client-init' | 'client-send-message' | 'server-send-message';
