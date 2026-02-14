import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Timer "mo:core/Timer";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type UserId = Principal;
  type PostId = Text;
  type MessageId = Text;
  type StoryId = Text;
  type ReelId = Text;

  public type UserProfile = {
    displayName : Text;
    username : Text;
    bio : ?Text;
    avatar : ?Storage.ExternalBlob;
  };

  module Profile {
    public type Data = {
      id : Principal;
      displayName : Text;
      username : Text;
      bio : ?Text;
      avatar : ?Storage.ExternalBlob;
    };

    public func compare(a : Data, b : Data) : Order.Order {
      Text.compare(a.username, b.username);
    };
  };

  module Message {
    public type Data = {
      id : MessageId;
      sender : UserId;
      recipient : UserId;
      content : Text;
      timestamp : Time.Time;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      compareDescending(a.timestamp, b.timestamp);
    };

    func compareDescending(a : Time.Time, b : Time.Time) : Order.Order {
      if (a < b) { #greater } else if (a > b) { #less } else { #equal };
    };
  };

  module Post {
    public type Data = {
      id : PostId;
      author : UserId;
      caption : Text;
      image : ?Storage.ExternalBlob;
      timestamp : Time.Time;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      compareDescending(a.timestamp, b.timestamp);
    };

    func compareDescending(a : Time.Time, b : Time.Time) : Order.Order {
      if (a < b) { #greater } else if (a > b) { #less } else { #equal };
    };
  };

  module Story {
    public type Data = {
      id : StoryId;
      author : UserId;
      text : Text;
      image : ?Storage.ExternalBlob;
      timestamp : Time.Time;
      expiry : Time.Time;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      compareDescending(a.timestamp, b.timestamp);
    };

    func compareDescending(a : Time.Time, b : Time.Time) : Order.Order {
      if (a < b) { #greater } else if (a > b) { #less } else { #equal };
    };
  };

  module Reel {
    public type Data = {
      id : ReelId;
      author : UserId;
      title : Text;
      video : ?Storage.ExternalBlob;
      link : ?Text;
      timestamp : Time.Time;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      compareDescending(a.timestamp, b.timestamp);
    };

    func compareDescending(a : Time.Time, b : Time.Time) : Order.Order {
      if (a < b) { #greater } else if (a > b) { #less } else { #equal };
    };
  };

  // State and storage
  var nextPostId = 0;
  var nextMessageId = 0;
  var nextStoryId = 0;
  var nextReelId = 0;

  let profiles = Map.empty<UserId, Profile.Data>();
  let posts = Map.empty<PostId, Post.Data>();
  let stories = Map.empty<StoryId, Story.Data>();
  let messages = Map.empty<MessageId, Message.Data>();
  let reels = Map.empty<ReelId, Reel.Data>();

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (profiles.get(caller)) {
      case null { null };
      case (?profile) {
        ?{
          displayName = profile.displayName;
          username = profile.username;
          bio = profile.bio;
          avatar = profile.avatar;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    switch (profiles.get(user)) {
      case null { null };
      case (?profile) {
        ?{
          displayName = profile.displayName;
          username = profile.username;
          bio = profile.bio;
          avatar = profile.avatar;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let profileData : Profile.Data = {
      id = caller;
      displayName = profile.displayName;
      username = profile.username;
      bio = profile.bio;
      avatar = profile.avatar;
    };
    profiles.add(caller, profileData);
  };

  // Posts
  public query ({ caller }) func getPosts() : async [Post.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.values().toArray().sort(Post.compareByTimestamp);
  };

  public shared ({ caller }) func createPost(caption : Text, image : ?Storage.ExternalBlob) : async Post.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let post : Post.Data = {
      caption;
      id = nextPostId.toText();
      image;
      author = caller;
      timestamp = Time.now();
    };
    posts.add(post.id, post);
    nextPostId += 1;
    post;
  };

  // Stories
  public query ({ caller }) func getStory(storyId : StoryId) : async ?Story.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view stories");
    };
    switch (stories.get(storyId)) {
      case null { null };
      case (?story) {
        // Verify story is not expired
        if (Time.now() >= story.expiry) {
          return null;
        };
        ?story;
      };
    };
  };

  public query ({ caller }) func getActiveStories() : async [Story.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view stories");
    };
    stories.values().toArray().filter(
      func(story) {
        Time.now() < story.expiry;
      }
    ).sort(Story.compareByTimestamp);
  };

  public shared ({ caller }) func createStory(text : Text, image : ?Storage.ExternalBlob) : async Story.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create stories");
    };
    let story : Story.Data = {
      id = nextStoryId.toText();
      author = caller;
      text;
      image;
      timestamp = Time.now();
      // Set expiry to 24 hours
      expiry = Time.now() + (24 * 60 * 60 * 1000_000_000);
    };
    stories.add(story.id, story);
    nextStoryId += 1;
    story;
  };

  // User Discovery
  public query ({ caller }) func searchUsernames(searchText : Text) : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search for other users");
    };
    let lowercaseSearch = searchText.toLower();
    profiles.values().toArray().filter(
      func(profile) {
        profile.username.toLower().contains(#text lowercaseSearch);
      }
    ).map(func(p) { p.username });
  };

  // Messages (1:1 Chat)
  public shared ({ caller }) func sendMessage(recipient : Principal, content : Text) : async Message.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let message : Message.Data = {
      id = nextMessageId.toText();
      sender = caller;
      recipient;
      content;
      timestamp = Time.now();
    };
    messages.add(message.id, message);
    nextMessageId += 1;
    message;
  };

  public query ({ caller }) func getMessage(id : MessageId) : async ?Message.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    switch (messages.get(id)) {
      case null { null };
      case (?message) {
        // Verify caller is sender or recipient
        if (message.sender != caller and message.recipient != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own messages");
        };
        ?message;
      };
    };
  };

  public query ({ caller }) func getMessages(partner : UserId) : async [Message.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    let filteredIter = messages.values().filter(
      func(message) {
        (message.sender == partner and message.recipient == caller) or
        (message.sender == caller and message.recipient == partner);
      }
    );
    filteredIter.toArray().sort(Message.compareByTimestamp);
  };

  // Reels
  public query ({ caller }) func getReels() : async [Reel.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reels");
    };
    reels.values().toArray().sort(Reel.compareByTimestamp);
  };

  public shared ({ caller }) func createReel(title : Text, video : ?Storage.ExternalBlob, link : ?Text) : async Reel.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create reels");
    };
    let reel : Reel.Data = {
      id = nextReelId.toText();
      author = caller;
      title;
      video;
      link;
      timestamp = Time.now();
    };
    reels.add(reel.id, reel);
    nextReelId += 1;
    reel;
  };
};
