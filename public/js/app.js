
function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
  }, (error) => {
    console.log(error);
  })
}

/**
 * @type {HTMLInputElement}
 */
const keyInDom = document.querySelector('#txtInput');

/**
 * @type {HTMLInputElement}
 */
const showDom = document.querySelector('#txtShow');

/**
 * @type {HTMLInputElement}
 */
const nameDom = document.querySelector('#name');

/**
 * @type {WebSocket}
 */
let ws = null;

/**
 * @type {string}
 */
let serverId = null;

function joinTheChannel() {
  ws = initWS({
    name: nameDom.value,
  }, getMessage);
}

/**
 * @param {MessageEvent<string>} mEvent
 */
function getMessage(mEvent) {
  console.log('message', mEvent.data);

  /**
   * @type {WebSocketPackage<ClientSendMessage | ServerSendInitMessage>}
   */
  const {
    data,
    type,
  } = JSON.parse(mEvent.data);

  if (type === 'server-init') {
    serverId = data.id;
    localStorage.setItem('serverId', data.id);
    console.log(serverId);
  }

  if (type === 'server-send-message') {
    console.log(data.message);
    if (!showDom.value) {
      showDom.value = data.message;
    } else {
      showDom.value = `${showDom.value}\n${data.message}`;
    }
    keyInDom.value = '';
    // getLocation();
  }
}

function sendMessage() {
  /**
   * @type {WebSocketPackage<ClientSendMessage>}
   */
  const sendData = {
    type: 'client-send-message',
    data: {
      message: keyInDom.value,
    }
  };

  ws.send(JSON.stringify(sendData));
}

/**
 * This callback is displayed as part of the Requester class.
 * @callback WhenSuccess
 * @param {MessageEvent<any>} mEvent
 */

/**
 * @typedef {Object} Options
 *
 * @property {string} name
 */

/**
 *
 * @param {Options} options
 * @param {WhenSuccess} cb
 */
function initWS(options, cb) {

  const url = 'ws://localhost:3000';
  const ws = new WebSocket(url);

  // 監聽連線狀態
  ws.onopen = (ev) => {
    ws.send(JSON.stringify({
      type: 'client-init',
      data: {
        name: nameDom.value,
      },
    }));
    console.log('open connection');
  }

  ws.onclose = () => {
    console.log('close connection');
  }

  //接收 Server 發送的訊息
  ws.onmessage = cb;

  return ws;
}
