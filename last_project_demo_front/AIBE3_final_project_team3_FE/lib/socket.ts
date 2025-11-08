
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ApiMessage } from './api';

const SOCKET_URL = 'http://localhost:8080/ws-stomp';

let stompClient: Client | null = null;

export function getStompClient(): Client {
    if (!stompClient) {
        stompClient = new Client({
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.webSocketFactory = () => {
            return new SockJS(SOCKET_URL);
        };
    }
    return stompClient;
}

export function connect(token: string, onConnectCallback: () => void): void {
    const client = getStompClient();

    if (client.connected) {
        console.log('Already connected');
        onConnectCallback();
        return;
    }

    client.connectHeaders = {
        Authorization: `Bearer ${token}`,
    };

    client.onConnect = () => {
        console.log('WebSocket Connected');
        onConnectCallback();
    };

    client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    client.activate();
}

export function subscribeToRoom(roomId: number, onMessageReceived: (message: ApiMessage) => void) {
    const client = getStompClient();
    if (!client.connected) {
        console.error("Cannot subscribe, client not connected");
        return null;
    }

    return client.subscribe(`/topic/rooms/${roomId}`, (message: IMessage) => {
        const parsedMessage: ApiMessage = JSON.parse(message.body);
        onMessageReceived(parsedMessage);
    });
}

export function subscribeToNewRooms(userId: number, onNewRoom: (room: ApiChatRoom) => void) {
    const client = getStompClient();
    if (!client.connected) {
        console.error("Cannot subscribe, client not connected");
        return null;
    }

    return client.subscribe(`/topic/user/${userId}/rooms`, (message: IMessage) => {
        const newRoom: ApiChatRoom = JSON.parse(message.body);
        onNewRoom(newRoom);
    });
}

export function sendMessage(roomId: number, content: string) {
    const client = getStompClient();
    if (!client.connected) {
        console.error("Cannot send message, client not connected");
        return;
    }

    const messageRequest = {
        roomId,
        content,
        messageType: 'TEXT',
    };

    client.publish({
        destination: '/app/chats/sendMessage',
        body: JSON.stringify(messageRequest),
    });
}

export function disconnect() {
    const client = getStompClient();
    if (client.connected) {
        client.deactivate();
        console.log('WebSocket Disconnected');
    }
}
