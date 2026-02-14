import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Data__5 {
    id: MessageId;
    text: string;
    author: UserId;
    timestamp: Time;
}
export type ReelId = string;
export type Time = bigint;
export interface Data {
    id: TrackId;
    title: string;
    audio: ExternalBlob;
    author: UserId;
    timestamp: Time;
}
export type PostId = string;
export type StoryId = string;
export interface Data__2 {
    id: StoryId;
    text: string;
    author: UserId;
    timestamp: Time;
    image?: ExternalBlob;
    expiry: Time;
}
export interface Data__1 {
    id: MessageId;
    content: string;
    recipient: UserId;
    sender: UserId;
    timestamp: Time;
}
export type UserId = Principal;
export interface Data__3 {
    id: ReelId;
    title: string;
    video?: ExternalBlob;
    link?: string;
    author: UserId;
    timestamp: Time;
}
export type MessageId = string;
export interface Notification {
    content: string;
    sender: UserId;
    timestamp: Time;
}
export interface Data__4 {
    id: PostId;
    author: UserId;
    timestamp: Time;
    caption: string;
    image?: ExternalBlob;
}
export type TrackId = string;
export interface UserProfile {
    bio?: string;
    username: string;
    displayName: string;
    avatar?: ExternalBlob;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatRoomMessage(roomId: UserId, text: string): Promise<void>;
    addNotification(content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUserFromNotificationsRoom(adminPassword: string, userToBan: UserId): Promise<void>;
    createPost(caption: string, image: ExternalBlob | null): Promise<Data__4>;
    createPrivateChatRoom(password: string): Promise<void>;
    createReel(title: string, video: ExternalBlob | null, link: string | null): Promise<Data__3>;
    createStory(text: string, image: ExternalBlob | null): Promise<Data__2>;
    deletePost(postId: PostId): Promise<void>;
    deleteReel(reelId: ReelId): Promise<void>;
    deleteStory(storyId: StoryId): Promise<void>;
    enterNotificationsRoom(password: string): Promise<void>;
    enterNotificationsRoomAdminMode(adminPassword: string): Promise<void>;
    enterPrivateChatRoom(roomId: UserId, password: string): Promise<void>;
    getActiveStories(): Promise<Array<Data__2>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatRoomMessages(roomId: UserId): Promise<Array<Data__5>>;
    getFameLevel(): Promise<bigint>;
    getMessage(id: MessageId): Promise<Data__1 | null>;
    getMessages(partner: UserId): Promise<Array<Data__1>>;
    getNotificationsRoomEntries(): Promise<Array<Notification>>;
    getPosts(): Promise<Array<Data__4>>;
    getPrivacySetting(): Promise<string>;
    getReels(): Promise<Array<Data__3>>;
    getStory(storyId: StoryId): Promise<Data__2 | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTracks(userId: UserId): Promise<Array<Data>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchUsernames(searchText: string): Promise<Array<string>>;
    sendMessage(recipient: Principal, content: string): Promise<Data__1>;
    unbanUserFromNotificationsRoom(adminPassword: string, userToUnban: UserId): Promise<void>;
    uploadTrack(title: string, audio: ExternalBlob): Promise<Data>;
}
