import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UserApproval "mo:caffeineai-user-approval/approval";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "types/streaming-platform";
import Common "types/common";
import StreamingMixin "mixins/streaming-platform-api";

actor {
  // ── Authorization & Approval ───────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  // ── Object Storage ─────────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ── User Approval endpoints ────────────────────────────────────────────────
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    UserApproval.setApproval(approvalState, user, status);
  };

  public query func listApprovals() : async [UserApproval.UserApprovalInfo] {
    UserApproval.listApprovals(approvalState);
  };

  // ── Content State ──────────────────────────────────────────────────────────
  let userProfiles     = Map.empty<Principal,              Types.UserProfile>();
  let shows            = Map.empty<Common.ShowId,          Types.Show>();
  let seasons          = Map.empty<Common.SeasonId,        Types.Season>();
  let episodes         = Map.empty<Common.EpisodeId,       Types.Episode>();
  let comments         = Map.empty<Common.CommentId,       Types.Comment>();

  // ── Social State ───────────────────────────────────────────────────────────
  let watchlists       = Map.empty<Principal,              Set.Set<Common.ShowId>>();
  let watchHistory     = Map.empty<Principal,              Map.Map<Common.EpisodeId, Types.WatchHistoryEntry>>();
  let showLikes        = Map.empty<Common.ShowId,          Set.Set<Principal>>();
  let episodeLikes     = Map.empty<Common.EpisodeId,       Set.Set<Principal>>();

  // ── Counters ───────────────────────────────────────────────────────────────
  let nextShowId    = { var value : Nat = 1 };
  let nextSeasonId  = { var value : Nat = 1 };
  let nextEpisodeId = { var value : Nat = 1 };
  let nextCommentId = { var value : Nat = 1 };

  // ── Subscription Plan Config ───────────────────────────────────────────────
  let subscriptionPlans    = Map.empty<Text, Types.SubscriptionPlanConfig>();
  let imvuRecipient        = { var value : Text = "ExpressPlus" };
  let pendingSubscriptions = Map.empty<Principal, Types.PendingSubscription>();

  // Seed default plans
  subscriptionPlans.add("free", {
    planId = "free";
    name = "Free";
    priceCredits = 0;
    features = ["Access to free content", "SD quality", "Ad-supported"];
    discountPercent = 0;
    discountActive = false;
  });
  subscriptionPlans.add("pro", {
    planId = "pro";
    name = "Pro";
    priceCredits = 1000;
    features = ["All free content", "HD quality", "Ad-free", "Download episodes"];
    discountPercent = 0;
    discountActive = false;
  });
  subscriptionPlans.add("premium", {
    planId = "premium";
    name = "Premium";
    priceCredits = 2000;
    features = ["All Pro content", "4K quality", "Early access", "Exclusive content", "Priority support"];
    discountPercent = 0;
    discountActive = false;
  });

  // ── Stripe Config ───────────────────────────────────────────────────────────
  let stripeConfig = { var value : ?Stripe.StripeConfiguration = null };

  public query func isStripeConfigured() : async Bool {
    stripeConfig.value != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig.value := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(tier : Types.SubscriptionTier, successUrl : Text, cancelUrl : Text) : async Text {
    let cfg = switch (stripeConfig.value) {
      case null { Runtime.trap("Stripe needs to be first configured") };
      case (?c) { c };
    };
    let (productName, priceInCents) = switch tier {
      case (#Free)    { ("Express+ Free",    0) };
      case (#Pro)     { ("Express+ Pro",     999) };
      case (#Premium) { ("Express+ Premium", 1999) };
    };
    await Stripe.createCheckoutSession(
      cfg,
      caller,
      [{ currency = "usd"; productName; productDescription = productName # " monthly subscription"; priceInCents; quantity = 1 }],
      successUrl,
      cancelUrl,
      transform,
    );
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let cfg = switch (stripeConfig.value) {
      case null { Runtime.trap("Stripe needs to be first configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(cfg, sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Streaming Platform API ─────────────────────────────────────────────────
  include StreamingMixin(
    accessControlState,
    userProfiles,
    shows,
    seasons,
    episodes,
    comments,
    watchlists,
    watchHistory,
    showLikes,
    episodeLikes,
    nextShowId,
    nextSeasonId,
    nextEpisodeId,
    nextCommentId,
    stripeConfig,
    subscriptionPlans,
    imvuRecipient,
    pendingSubscriptions,
  );
};
