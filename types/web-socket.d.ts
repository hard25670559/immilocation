declare type WebSocketPackage<T> = {
  type: PackageType,
  from: Sender | null,
  data: T,
}

declare type Sender = {
  name: string,
  id: string,
}

declare type ClientSendInitMessage = {
  name: string,
}

declare type ClientSendMessage = {
  from: Sender,
  message: string,
}

declare type ServerSendInitMessage = {
  id: string,
}

declare type PackageType =
  'server-init' | 'client-init' | 'client-send-message' | 'server-send-message'
  'get-location';

