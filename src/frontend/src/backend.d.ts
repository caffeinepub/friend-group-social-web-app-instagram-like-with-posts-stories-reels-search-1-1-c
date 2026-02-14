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
export type ReelId = string;
export type Time = bigint;
export interface Data {
    id: MessageId;
    content: string;
    recipient: UserId;
    sender: UserId;
    timestamp: Time;
}
export type PostId = string;
export type StoryId = string;
export interface Data__2 {
    id: ReelId;
    title: string;
    video?: ExternalBlob;
    link?: string;
    author: UserId;
    timestamp: Time;
}
export interface Data__1 {
    id: StoryId;
    text: string;
    author: UserId;
    timestamp: Time;
    image?: ExternalBlob;
    expiry: Time;
}
export type UserId = Principal;
export interface Data__3 {
    id: PostId;
    author: UserId;
    timestamp: Time;
    caption: string;
    image?: ExternalBlob;
}
export type MessageId = string;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(caption: string, image: ExternalBlob | null): Promise<Data__3>;
    createReel(title: string, video: ExternalBlob | null, link: string | null): Promise<Data__2>;
    createStory(text: string, image: ExternalBlob | null): Promise<Data__1>;
    getActiveStories(): Promise<Array<Data__1>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessage(id: MessageId): Promise<Data | null>;
    getMessages(partner: UserId): Promise<Array<Data>>;
    getPosts(): Promise<Array<Data__3>>;
    getReels(): Promise<Array<Data__2>>;
    getStory(storyId: StoryId): Promise<Data__1 | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchUsernames(searchText: string): Promise<Array<string>>;
    sendMessage(recipient: Principal, content: string): Promise<Data>;
}
