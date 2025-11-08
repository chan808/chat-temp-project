
const API_BASE_URL = 'http://localhost:8080';

// Based on MessageResponse.java
export interface ApiMessage {
    id: number;
    senderId: number;
    sender: string;
    content: string;
    createdAt: string; // Assuming ISO string format
    messageType: string;
    // Add other fields if needed
}

// Based on ChatRoomResponseDto.java
export interface ApiChatRoom {
    id: number;
    name: string;
    roomType: 'DIRECT' | 'GROUP';
    members: { id: number; nickname: string }[];
}

export interface Member {
    id: number;
    nickname: string;
    email: string;
}

export async function login(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
    }

    const accessToken = response.headers.get('Authorization');
    if (!accessToken) {
        throw new Error('로그인에 성공했으나 인증 토큰을 받지 못했습니다.');
    }

    return accessToken.replace('Bearer ', '');
}

export async function getUsers(token: string): Promise<Member[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/members`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('사용자 목록을 불러오는 데 실패했습니다.');
    }
    return response.json();
}

export async function getRooms(token: string): Promise<ApiChatRoom[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/rooms`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('채팅방 목록을 불러오는 데 실패했습니다.');
    }
    return response.json();
}

export async function getMessages(roomId: number, token: string): Promise<ApiMessage[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/rooms/${roomId}/messages`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('메시지를 불러오는 데 실패했습니다.');
    }
    return response.json();
}

export async function createDirectRoom(token: string, partnerId: number): Promise<ApiChatRoom> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/rooms/direct` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerId }),
    });

    if (!response.ok) {
        throw new Error('1:1 채팅방 생성에 실패했습니다.');
    }

    return response.json();
}

export async function createPublicRoom(token: string, roomName: string): Promise<ApiChatRoom> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats/rooms/public`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roomName }),
    });

    if (!response.ok) {
        throw new Error('공개 채팅방 생성에 실패했습니다.');
    }

    return response.json();
}

export async function uploadFile(roomId: number, file: File, messageType: 'IMAGE' | 'FILE', token: string): Promise<ApiMessage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageType', messageType);

    const response = await fetch(`${API_BASE_URL}/api/v1/chats/rooms/${roomId}/files`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' // FormData를 사용할 때는 브라우저가 자동으로 설정
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`파일 업로드 실패: ${response.status} ${errorText}`);
    }

    return response.json();
}
