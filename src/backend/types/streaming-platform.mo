import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {

  // ── Enums ──────────────────────────────────────────────────────────────────

  public type Category = {
    #RealityTV;
    #Drama;
    #Comedy;
    #Exclusive;
  };

  public type SubscriptionTier = {
    #Free;
    #Pro;
    #Premium;
  };

  // ── User Profile ───────────────────────────────────────────────────────────

  public type UserProfile = {
    principal : Common.UserId;
    var username : Text;
    var bio : Text;
    var profilePicBlob : ?Storage.ExternalBlob;
    var subscriptionTier : SubscriptionTier;
    var subscriptionExpiresAt : ?Int;
    createdAt : Common.Timestamp;
  };

  public type UserProfilePublic = {
    principal : Common.UserId;
    username : Text;
    bio : Text;
    profilePicUrl : ?Text;
    subscriptionTier : SubscriptionTier;
    subscriptionExpiresAt : ?Int;
    createdAt : Common.Timestamp;
  };

  // ── Show ──────────────────────────────────────────────────────────────────

  public type Show = {
    id : Common.ShowId;
    var title : Text;
    var description : Text;
    var category : Category;
    creatorId : Common.UserId;
    var coverImageUrl : ?Text;
    var trailerBlob : ?Storage.ExternalBlob;
    var totalViews : Nat;
    var totalLikes : Nat;
    var isFeatured : Bool;
    var isApproved : Bool;
    var isFree : Bool;
    createdAt : Common.Timestamp;
  };

  public type ShowPublic = {
    id : Common.ShowId;
    title : Text;
    description : Text;
    category : Category;
    creatorId : Common.UserId;
    coverImageUrl : ?Text;
    trailerUrl : ?Text;
    totalViews : Nat;
    totalLikes : Nat;
    isFeatured : Bool;
    isApproved : Bool;
    isFree : Bool;
    seasonCount : Nat;
    createdAt : Common.Timestamp;
  };

  // ── Season ─────────────────────────────────────────────────────────────────

  public type Season = {
    id : Common.SeasonId;
    showId : Common.ShowId;
    var seasonNumber : Nat;
    var title : Text;
    createdAt : Common.Timestamp;
  };

  public type SeasonPublic = {
    id : Common.SeasonId;
    showId : Common.ShowId;
    seasonNumber : Nat;
    title : Text;
    episodeCount : Nat;
    createdAt : Common.Timestamp;
  };

  // ── Episode ────────────────────────────────────────────────────────────────

  public type Episode = {
    id : Common.EpisodeId;
    showId : Common.ShowId;
    seasonId : Common.SeasonId;
    var episodeNumber : Nat;
    var title : Text;
    var description : Text;
    var videoUrl : ?Text;
    var thumbnailUrl : ?Text;
    var durationSeconds : Nat;
    var views : Nat;
    var likes : Nat;
    createdAt : Common.Timestamp;
  };

  public type EpisodePublic = {
    id : Common.EpisodeId;
    showId : Common.ShowId;
    seasonId : Common.SeasonId;
    episodeNumber : Nat;
    title : Text;
    description : Text;
    videoUrl : ?Text;
    thumbnailUrl : ?Text;
    durationSeconds : Nat;
    views : Nat;
    likes : Nat;
    createdAt : Common.Timestamp;
  };

  // ── Watch History ──────────────────────────────────────────────────────────

  public type WatchHistoryEntry = {
    episodeId : Common.EpisodeId;
    showId : Common.ShowId;
    var progressSeconds : Nat;
    var lastWatchedAt : Common.Timestamp;
  };

  public type WatchHistoryEntryPublic = {
    episodeId : Common.EpisodeId;
    showId : Common.ShowId;
    progressSeconds : Nat;
    lastWatchedAt : Common.Timestamp;
  };

  // ── Comment ────────────────────────────────────────────────────────────────

  public type Comment = {
    id : Common.CommentId;
    episodeId : Common.EpisodeId;
    authorId : Common.UserId;
    var text : Text;
    createdAt : Common.Timestamp;
  };

  public type CommentPublic = {
    id : Common.CommentId;
    episodeId : Common.EpisodeId;
    authorId : Common.UserId;
    text : Text;
    createdAt : Common.Timestamp;
  };

  // ── Input DTOs ─────────────────────────────────────────────────────────────

  public type CreateShowInput = {
    title : Text;
    description : Text;
    category : Category;
    coverImageUrl : ?Text;
    trailerBlob : ?Storage.ExternalBlob;
    isFree : Bool;
  };

  public type UpdateShowInput = {
    id : Common.ShowId;
    title : Text;
    description : Text;
    category : Category;
    coverImageUrl : ?Text;
    trailerBlob : ?Storage.ExternalBlob;
    isFree : Bool;
  };

  public type CreateSeasonInput = {
    showId : Common.ShowId;
    seasonNumber : Nat;
    title : Text;
  };

  public type CreateEpisodeInput = {
    showId : Common.ShowId;
    seasonId : Common.SeasonId;
    episodeNumber : Nat;
    title : Text;
    description : Text;
    videoUrl : ?Text;
    thumbnailUrl : ?Text;
    durationSeconds : Nat;
  };

  public type UpdateEpisodeInput = {
    title : ?Text;
    description : ?Text;
    videoUrl : ?Text;
    thumbnailUrl : ?Text;
    episodeNumber : ?Nat;
    durationSeconds : ?Nat;
  };

  public type UpdateSeasonInput = {
    title : ?Text;
    seasonNumber : ?Nat;
  };

  public type UpdateProfileInput = {
    username : Text;
    bio : Text;
    profilePicBlob : ?Storage.ExternalBlob;
  };

  // ── Subscription Plan Config ───────────────────────────────────────────────

  public type SubscriptionPlanConfig = {
    planId : Text;
    name : Text;
    priceCredits : Nat;
    features : [Text];
    discountPercent : Nat;  // 0-100
    discountActive : Bool;
  };

  // ── Pending Subscription ───────────────────────────────────────────────────

  public type PendingSubscription = {
    userPrincipal : Common.UserId;
    planName : Text;
    tier : SubscriptionTier;
    requestedAt : Common.Timestamp;
  };

  public type PendingSubscriptionPublic = {
    userPrincipal : Common.UserId;
    username : Text;
    planName : Text;
    requestedAt : Common.Timestamp;
  };

  // ── Signup History ─────────────────────────────────────────────────────────

  public type SignupHistoryEntry = {
    principal : Text;
    username : Text;
    signedUpAt : Common.Timestamp;
    currentTier : Text;
  };

  // ── Analytics ──────────────────────────────────────────────────────────────

  public type AdminAnalytics = {
    totalUsers : Nat;
    totalShows : Nat;
    totalEpisodes : Nat;
    totalViews : Nat;
    freeSubscribers : Nat;
    proSubscribers : Nat;
    premiumSubscribers : Nat;
  };
};
