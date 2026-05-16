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
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UpdateEpisodeInput {
    title?: string;
    thumbnailUrl?: string;
    description?: string;
    episodeNumber?: bigint;
    durationSeconds?: bigint;
    videoUrl?: string;
}
export interface AdminAnalytics {
    proSubscribers: bigint;
    totalViews: bigint;
    totalEpisodes: bigint;
    totalShows: bigint;
    premiumSubscribers: bigint;
    totalUsers: bigint;
    freeSubscribers: bigint;
}
export interface EpisodePublic {
    id: EpisodeId;
    title: string;
    thumbnailUrl?: string;
    showId: ShowId;
    views: bigint;
    createdAt: Timestamp;
    description: string;
    seasonId: SeasonId;
    likes: bigint;
    episodeNumber: bigint;
    durationSeconds: bigint;
    videoUrl?: string;
}
export interface ShowPublic {
    id: ShowId;
    coverImageUrl?: string;
    isApproved: boolean;
    title: string;
    totalViews: bigint;
    seasonCount: bigint;
    createdAt: Timestamp;
    creatorId: UserId;
    description: string;
    isFree: boolean;
    trailerUrl?: string;
    totalLikes: bigint;
    isFeatured: boolean;
    category: Category;
}
export interface PendingSubscriptionPublic {
    username: string;
    userPrincipal: UserId;
    planName: string;
    requestedAt: Timestamp;
}
export type SeasonId = bigint;
export interface UpdateSeasonInput {
    title?: string;
    seasonNumber?: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface WatchHistoryEntryPublic {
    showId: ShowId;
    lastWatchedAt: Timestamp;
    progressSeconds: bigint;
    episodeId: EpisodeId;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CreateEpisodeInput {
    title: string;
    thumbnailUrl?: string;
    showId: ShowId;
    description: string;
    seasonId: SeasonId;
    episodeNumber: bigint;
    durationSeconds: bigint;
    videoUrl?: string;
}
export type CommentId = bigint;
export interface SeasonPublic {
    id: SeasonId;
    title: string;
    showId: ShowId;
    episodeCount: bigint;
    createdAt: Timestamp;
    seasonNumber: bigint;
}
export interface CommentPublic {
    id: CommentId;
    authorId: UserId;
    createdAt: Timestamp;
    text: string;
    episodeId: EpisodeId;
}
export interface UpdateShowInput {
    id: ShowId;
    coverImageUrl?: string;
    title: string;
    trailerBlob?: ExternalBlob;
    description: string;
    isFree: boolean;
    category: Category;
}
export interface CreateShowInput {
    coverImageUrl?: string;
    title: string;
    trailerBlob?: ExternalBlob;
    description: string;
    isFree: boolean;
    category: Category;
}
export interface SubscriptionPlanConfig {
    priceCredits: bigint;
    features: Array<string>;
    planId: string;
    name: string;
    discountPercent: bigint;
    discountActive: boolean;
}
export interface UserProfilePublic {
    bio: string;
    profilePicUrl?: string;
    principal: UserId;
    username: string;
    createdAt: Timestamp;
    subscriptionTier: SubscriptionTier;
    subscriptionExpiresAt?: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface UpdateProfileInput {
    bio: string;
    username: string;
    profilePicBlob?: ExternalBlob;
}
export interface SignupHistoryEntry {
    principal: string;
    username: string;
    currentTier: string;
    signedUpAt: Timestamp;
}
export type ShowId = bigint;
export interface CreateSeasonInput {
    title: string;
    showId: ShowId;
    seasonNumber: bigint;
}
export type EpisodeId = bigint;
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum Category {
    Drama = "Drama",
    Exclusive = "Exclusive",
    RealityTV = "RealityTV",
    Comedy = "Comedy"
}
export enum SubscriptionTier {
    Pro = "Pro",
    Premium = "Premium",
    Free = "Free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateSubscription(tier: SubscriptionTier): Promise<void>;
    addComment(episodeId: EpisodeId, text: string): Promise<CommentId>;
    addToWatchlist(showId: ShowId): Promise<void>;
    adminApproveShow(showId: ShowId, approved: boolean): Promise<void>;
    adminApproveSubscription(user: Principal, approve: boolean): Promise<void>;
    adminDeleteEpisode(episodeId: EpisodeId): Promise<void>;
    adminGetAnalytics(): Promise<AdminAnalytics>;
    adminGetSignupHistory(): Promise<Array<SignupHistoryEntry>>;
    adminListPendingSubscriptions(): Promise<Array<PendingSubscriptionPublic>>;
    adminListShows(): Promise<Array<ShowPublic>>;
    adminListUsers(): Promise<Array<UserProfilePublic>>;
    adminRemoveSubscription(user: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminResetAnalytics(): Promise<boolean>;
    adminSetFeatured(showId: ShowId, featured: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(tier: SubscriptionTier, successUrl: string, cancelUrl: string): Promise<string>;
    createEpisode(input: CreateEpisodeInput): Promise<EpisodeId>;
    createSeason(input: CreateSeasonInput): Promise<SeasonId>;
    createShow(input: CreateShowInput): Promise<ShowId>;
    deleteComment(commentId: CommentId): Promise<void>;
    deleteEpisode(episodeId: EpisodeId): Promise<void>;
    deleteShow(showId: ShowId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContinueWatching(): Promise<Array<EpisodePublic>>;
    getEpisode(episodeId: EpisodeId): Promise<EpisodePublic | null>;
    getImvuRecipient(): Promise<string>;
    getShow(showId: ShowId): Promise<ShowPublic | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubscriptionPlans(): Promise<Array<SubscriptionPlanConfig>>;
    getSubscriptionTier(): Promise<SubscriptionTier>;
    getUserProfile(user: Principal): Promise<UserProfilePublic | null>;
    getWatchHistory(): Promise<Array<WatchHistoryEntryPublic>>;
    getWatchlist(): Promise<Array<ShowPublic>>;
    hasLikedEpisode(episodeId: EpisodeId): Promise<boolean>;
    hasLikedShow(showId: ShowId): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    likeEpisode(episodeId: EpisodeId): Promise<void>;
    likeShow(showId: ShowId): Promise<void>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listApprovedShows(): Promise<Array<ShowPublic>>;
    listComments(episodeId: EpisodeId): Promise<Array<CommentPublic>>;
    listEpisodes(seasonId: SeasonId): Promise<Array<EpisodePublic>>;
    listFeaturedShows(): Promise<Array<ShowPublic>>;
    listSeasons(showId: ShowId): Promise<Array<SeasonPublic>>;
    listShowsByCategory(category: Category): Promise<Array<ShowPublic>>;
    listTrendingShows(): Promise<Array<ShowPublic>>;
    recordView(episodeId: EpisodeId): Promise<void>;
    registerUser(): Promise<UserProfilePublic>;
    removeFromWatchlist(showId: ShowId): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(input: UpdateProfileInput): Promise<void>;
    saveImvuRecipient(recipient: string): Promise<boolean>;
    saveSubscriptionPlan(planId: string, name: string, priceCredits: bigint, features: Array<string>, discountPercent: bigint, discountActive: boolean): Promise<boolean>;
    searchShows(term: string): Promise<Array<ShowPublic>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unlikeEpisode(episodeId: EpisodeId): Promise<void>;
    unlikeShow(showId: ShowId): Promise<void>;
    updateEpisode(episodeId: EpisodeId, input: UpdateEpisodeInput): Promise<{
        __kind__: "ok";
        ok: EpisodePublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateSeason(seasonId: SeasonId, input: UpdateSeasonInput): Promise<{
        __kind__: "ok";
        ok: SeasonPublic;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateShow(input: UpdateShowInput): Promise<void>;
    updateWatchProgress(episodeId: EpisodeId, progressSeconds: bigint): Promise<void>;
}
