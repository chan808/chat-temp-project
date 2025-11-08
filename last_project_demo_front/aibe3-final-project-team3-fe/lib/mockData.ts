
export interface User {
  id: number;
  name: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  text: string;
  timestamp: string;
}

export interface ChatRoom {
  id: number;
  participants: number[];
  name: string;
}

export const users: User[] = [
  { id: 1, name: '회원1' },
  { id: 2, name: '회원2' },
  { id: 3, name: '회원3' },
  { id: 4, name: '회원4' },
  { id: 5, name: '회원5' },
];

export const chatRooms: ChatRoom[] = [
  { id: 101, participants: [1, 2], name: '회원2' },
  { id: 102, participants: [1, 3], name: '회원3' },
  { id: 103, participants: [2, 4], name: '회원4' },
  { id: 104, participants: [3, 5], name: '회원5' },
  { id: 105, participants: [1, 5], name: '회원5' },
];

export const messages: ChatMessage[] = [
  { id: 1, roomId: 101, senderId: 1, text: '안녕하세요, 회원2님.', timestamp: '10:00' },
  { id: 2, roomId: 101, senderId: 2, text: '네, 안녕하세요 회원1님.', timestamp: '10:01' },
  { id: 3, roomId: 101, senderId: 1, text: '채팅 테스트입니다.', timestamp: '10:01' },
  { id: 4, roomId: 102, senderId: 1, text: '회원3님, 반갑습니다.', timestamp: '11:30' },
  { id: 5, roomId: 102, senderId: 3, text: '네, 반가워요.', timestamp: '11:31' },
  { id: 6, roomId: 103, senderId: 4, text: '회원2님, 뭐하세요?', timestamp: '14:00' },
  { id: 7, roomId: 103, senderId: 2, text: '코딩하고 있습니다.', timestamp: '14:01' },
  { id: 8, roomId: 105, senderId: 5, text: '회원1님, 저번에 말씀드린 내용입니다.', timestamp: '16:55' },
];
