export type WebSocketPackage<T> = {
  type: PackageType,
  from: Sender | null,
  data: T,
}

export type Sender = {
  name: string,
  id: string,
}

export type ClientSendInitMessage = {
  name: string,
}

export type ClientSendMessage = {
  from: Sender,
  message: string,
}

export type ServerSendInitMessage = {
  id: string,
}

export type PackageType =
  'server-init' | 'client-init' | 'client-send-message' | 'server-send-message'
  'get-location';

