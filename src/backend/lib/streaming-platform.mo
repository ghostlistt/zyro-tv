import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/streaming-platform";
import Common "../types/common";

module {

  public func profileToPublic(
    profile : Types.UserProfile,
  ) : Types.UserProfilePublic {
    Debug.todo()
  };

  public func showToPublic(
    show : Types.Show,
    seasonCount : Nat,
  ) : Types.ShowPublic {
    Debug.todo()
  };

  public func seasonToPublic(
    season : Types.Season,
    episodeCount : Nat,
  ) : Types.SeasonPublic {
    Debug.todo()
  };

  public func episodeToPublic(episode : Types.Episode) : Types.EpisodePublic {
    Debug.todo()
  };

  public func commentToPublic(comment : Types.Comment) : Types.CommentPublic {
    Debug.todo()
  };

  public func newShow(
    id : Common.ShowId,
    input : Types.CreateShowInput,
    creatorId : Common.UserId,
  ) : Types.Show {
    Debug.todo()
  };

  public func newSeason(
    id : Common.SeasonId,
    input : Types.CreateSeasonInput,
  ) : Types.Season {
    Debug.todo()
  };

  public func newEpisode(
    id : Common.EpisodeId,
    input : Types.CreateEpisodeInput,
  ) : Types.Episode {
    Debug.todo()
  };

  public func buildAnalytics(
    userProfiles : Map.Map<Principal, Types.UserProfile>,
    shows : Map.Map<Common.ShowId, Types.Show>,
    episodes : Map.Map<Common.EpisodeId, Types.Episode>,
  ) : Types.AdminAnalytics {
    Debug.todo()
  };

  public func searchShows(
    shows : Map.Map<Common.ShowId, Types.Show>,
    seasons : Map.Map<Common.SeasonId, Types.Season>,
    term : Text,
  ) : [Types.ShowPublic] {
    Debug.todo()
  };

  public func countSeasons(
    seasons : Map.Map<Common.SeasonId, Types.Season>,
    showId : Common.ShowId,
  ) : Nat {
    Debug.todo()
  };

  public func countEpisodes(
    episodes : Map.Map<Common.EpisodeId, Types.Episode>,
    seasonId : Common.SeasonId,
  ) : Nat {
    Debug.todo()
  };

};
