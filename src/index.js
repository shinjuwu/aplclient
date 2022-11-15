import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import useWebSocket from 'react-use-websocket';
//import './index.css';

const SOCKET_URL_ONE = 'ws://localhost:10001';
const SOCKET_URL_TWO = 'ws://172.30.0.154:10001';
const SOCKET_URL_THREE = 'ws://172.30.0.154:20001'
const READY_STATE_OPEN = 1;

//Generates the click handler, which returns a promise that resovles to the provided url.
const generateAsyncUrlGetter =
  (url, timeout = 2000) =>
  () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(url);
      }, timeout);
    });
  };

export const UseWebSocketTester = ({}) => {
  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [inputtedMessage, setInputtedMessage] = useState('{"Login":{"token":"","gameCode":"STLB","account":"simon"}}');
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    currentSocketUrl,
    {
      share: true,
      shouldReconnect: () => false,
    }
  );

  useEffect(() => {
    lastMessage && setMessageHistory((prev) => prev.concat(lastMessage.data));
  }, [lastMessage]);

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];
  const handleChange=(e)=>{
    setInputtedMessage(e.target.value)
  }
  return (
    <div>
      <h3>DYTClient</h3>
      <div>
        {/* <input
          type={'text'}
          value={inputtedMessage}
          onChange={(e) => setInputtedMessage(e.target.value)}
        /> */}
        <select onChange={(e)=>handleChange(e)}>
          <option value='{"Login":{"token":"","gameCode":"STLB"}}'>login</option>
          <option value='{"EnterGame":{"game_id":2007}}'>EnterGame</option>
          <option value='{"Spin":{"bet":10000,"betLines":20,"betMultiple":1000}}'>Spin</option>
          <option value='{"BonusSpin":{"bet":10000,"betLines":20,"betMultiple":1000}}'>BonusSpin</option>
          <option value='{"HotShot":{}}'>HotShot</option>
          <option value='{"FreeSpin":{}}'>FreeSpin</option>
          <option value='{"FeverSpin":{}}'>FeverSpin</option>
          <option value='{"SpinDemo":{"bet":10000,"betLines":20,"betMultiple":1,"dramaNo":27,"dramaNoHSG":22}}'>SpinDemo</option>
          <option value='{"BonusDemo":{"bet":10000,"betLines":20,"betMultiple":1,"dramaNo":5}}'>BonusDemo</option>
        </select>
        <button
          onClick={() => sendMessage(inputtedMessage)}
          disabled={readyState !== READY_STATE_OPEN}
        >
          Send
        </button>
      </div>
      Select Socket Server:
      <br />
      <button
        onClick={() =>
          setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE))
        }
        disabled={currentSocketUrl === SOCKET_URL_ONE}
      >
        {"LOCAL"}
      </button>
      <button
        onClick={() =>
          setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_TWO))
        }
        disabled={currentSocketUrl === SOCKET_URL_TWO}
      >
        {"DEV"}
      </button>
      <button
        onClick={() =>
          setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_THREE))
        }
        disabled={currentSocketUrl === SOCKET_URL_THREE}
      >
        {"DEV_TEST"}
      </button>
      <br />
      ReadyState: {readyStateString}
      <br />
      MessageHistory: {messageHistory.join('\n')}
    </div>
  );
};

render(<UseWebSocketTester />, document.getElementById('root'));