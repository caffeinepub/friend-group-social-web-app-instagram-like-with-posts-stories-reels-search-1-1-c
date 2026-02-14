import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
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
  type TrackId = Text;
  type NotificationId = Text;

  public type UserProfile = {
    displayName : Text;
    username : Text;
    bio : ?Text;
    avatar : ?Storage.ExternalBlob;
  };

  public type Notification = {
    content : Text;
    sender : UserId;
    timestamp : Time.Time;
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

  module Track {
    public type Data = {
      id : TrackId;
      author : UserId;
      title : Text;
      audio : Storage.ExternalBlob;
      timestamp : Time.Time;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      compareDescending(a.timestamp, b.timestamp);
    };

    func compareDescending(a : Time.Time, b : Time.Time) : Order.Order {
      if (a < b) { #greater } else if (a > b) { #less } else { #equal };
    };
  };

  module ChatRoomMessage {
    public type Data = {
      id : MessageId;
      author : UserId;
      text : Text;
      timestamp : Time.Time;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      compareDescending(a.timestamp, b.timestamp);
    };

    func compareDescending(a : Time.Time, b : Time.Time) : Order.Order {
      if (a < b) { #greater } else if (a > b) { #less } else { #equal };
    };
  };

  // State and Storage
  var nextPostId = 0;
  var nextMessageId = 0;
  var nextStoryId = 0;
  var nextReelId = 0;
  var nextTrackId = 0;
  var nextNotificationId = 0;

  let profiles = Map.empty<UserId, Profile.Data>();
  let posts = Map.empty<PostId, Post.Data>();
  let stories = Map.empty<StoryId, Story.Data>();
  let messages = Map.empty<MessageId, Message.Data>();
  let reels = Map.empty<ReelId, Reel.Data>();
  let tracks = Map.empty<TrackId, Track.Data>();
  let notifications = Map.empty<NotificationId, Notification>();

  let chatMessages = Map.empty<UserId, Map.Map<MessageId, ChatRoomMessage.Data>>();
  let roomPasswordMap = Map.empty<UserId, Text>();

  // Access tracking for global notifications room and private chat rooms
  let notificationsRoomAccess = Map.empty<UserId, Bool>();
  let notificationsRoomBannedUsers = Map.empty<UserId, Bool>();
  let privateChatRoomAccess = Map.empty<UserId, Map.Map<UserId, Bool>>();

  // User Profiles (Required functionality)
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

  // Helper (initial state for empty message array)
  func emptyMessageArray() : [Message.Data] {
    let emptyList = List.empty<Message.Data>();
    emptyList.toArray();
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

  public shared ({ caller }) func deletePost(postId : PostId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete posts");
    };
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("This post does not exist") };
      case (?post) {
        if (post.author != caller) {
          Runtime.trap("Unauthorized: User is not authorized to delete this post");
        };
        posts.remove(postId);
      };
    };
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

  public shared ({ caller }) func deleteStory(storyId : StoryId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete stories");
    };
    switch (stories.get(storyId)) {
      case (null) { Runtime.trap("This story does not exist") };
      case (?story) {
        if (story.author != caller) {
          Runtime.trap("Unauthorized: User is not authorized to delete this story");
        };
        stories.remove(storyId);
      };
    };
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

  public shared ({ caller }) func deleteReel(reelId : ReelId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete reels");
    };
    switch (reels.get(reelId)) {
      case (null) { Runtime.trap("This reel does not exist") };
      case (?reel) {
        if (reel.author != caller) {
          Runtime.trap("Unauthorized: User is not authorized to delete this reel");
        };
        reels.remove(reelId);
      };
    };
  };

  // Music Upload & Playback
  public shared ({ caller }) func uploadTrack(title : Text, audio : Storage.ExternalBlob) : async Track.Data {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload tracks");
    };
    let track : Track.Data = {
      id = nextTrackId.toText();
      author = caller;
      title;
      audio;
      timestamp = Time.now();
    };
    tracks.add(track.id, track);
    nextTrackId += 1;
    track;
  };

  public query ({ caller }) func getUserTracks(userId : UserId) : async [Track.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tracks");
    };
    tracks.values().toArray().filter(
      func(track) {
        track.author == userId;
      }
    ).sort(Track.compareByTimestamp);
  };

  // Shared "Notifications & Info" Room
  public shared ({ caller }) func enterNotificationsRoom(password : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can enter Notifications & Info room");
    };

    // Check if user is banned
    switch (notificationsRoomBannedUsers.get(caller)) {
      case (?true) {
        Runtime.trap("Unauthorized: You have been banned from the Notifications & Info room");
      };
      case _ {};
    };

    let expectedPassword = "piyush1618rajput1816";
    if (password != expectedPassword) {
      Runtime.trap("Incorrect password for Notifications & Info room");
    };

    // Grant access
    notificationsRoomAccess.add(caller, true);
  };

  public shared ({ caller }) func addNotification(content : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add notifications");
    };

    // Verify user has access to the notifications room
    switch (notificationsRoomAccess.get(caller)) {
      case (?true) {};
      case _ {
        Runtime.trap("Unauthorized: You must enter the Notifications & Info room first");
      };
    };

    // Check if user is banned
    switch (notificationsRoomBannedUsers.get(caller)) {
      case (?true) {
        Runtime.trap("Unauthorized: You have been banned from the Notifications & Info room");
      };
      case _ {};
    };

    let notification : Notification = {
      content;
      sender = caller;
      timestamp = Time.now();
    };
    notifications.add(nextNotificationId.toText(), notification);
    nextNotificationId += 1;
  };

  public query ({ caller }) func getNotificationsRoomEntries() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    // Verify user has access to the notifications room
    switch (notificationsRoomAccess.get(caller)) {
      case (?true) {};
      case _ {
        Runtime.trap("Unauthorized: You must enter the Notifications & Info room first");
      };
    };

    // Check if user is banned
    switch (notificationsRoomBannedUsers.get(caller)) {
      case (?true) {
        Runtime.trap("Unauthorized: You have been banned from the Notifications & Info room");
      };
      case _ {};
    };

    notifications.values().toArray();
  };

  // Admin Control Mode for Global Notifications Room
  public shared ({ caller }) func enterNotificationsRoomAdminMode(adminPassword : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access admin mode");
    };

    let expectedAdminPassword = "piyush13775";
    if (adminPassword != expectedAdminPassword) {
      Runtime.trap("Incorrect admin password");
    };

    // Admin password is correct - no further action needed, 
    // caller can now use admin functions
  };

  public shared ({ caller }) func banUserFromNotificationsRoom(adminPassword : Text, userToBan : UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access admin functions");
    };

    // Verify admin password
    let expectedAdminPassword = "piyush13775";
    if (adminPassword != expectedAdminPassword) {
      Runtime.trap("Unauthorized: Incorrect admin password");
    };

    // Ban the user
    notificationsRoomBannedUsers.add(userToBan, true);
    // Remove their access
    notificationsRoomAccess.remove(userToBan);
  };

  public shared ({ caller }) func unbanUserFromNotificationsRoom(adminPassword : Text, userToUnban : UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access admin functions");
    };

    // Verify admin password
    let expectedAdminPassword = "piyush13775";
    if (adminPassword != expectedAdminPassword) {
      Runtime.trap("Unauthorized: Incorrect admin password");
    };

    // Unban the user
    notificationsRoomBannedUsers.remove(userToUnban);
  };

  // Private Password-Locked Chat Rooms
  public shared ({ caller }) func createPrivateChatRoom(password : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create chat rooms");
    };
    if (password.size() < 8) {
      Runtime.trap("Passwords must have at least 8 characters");
    };
    if (roomPasswordMap.get(caller) != null) {
      Runtime.trap("User already has an existing chat room");
    };
    let emptyChat = Map.empty<MessageId, ChatRoomMessage.Data>();
    chatMessages.add(caller, emptyChat);
    roomPasswordMap.add(caller, password);

    // Initialize access map for this room
    let roomAccess = Map.empty<UserId, Bool>();
    // Room creator has automatic access
    roomAccess.add(caller, true);
    privateChatRoomAccess.add(caller, roomAccess);
  };

  public shared ({ caller }) func enterPrivateChatRoom(roomId : UserId, password : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can enter chat rooms");
    };

    switch (roomPasswordMap.get(roomId)) {
      case (null) { Runtime.trap("This chat room does not exist") };
      case (?pw) {
        if (pw != password) {
          Runtime.trap("Incorrect password for this chat room");
        };

        // Grant access to this user for this room
        switch (privateChatRoomAccess.get(roomId)) {
          case (?roomAccess) {
            roomAccess.add(caller, true);
          };
          case null {
            // Initialize access map if it doesn't exist
            let roomAccess = Map.empty<UserId, Bool>();
            roomAccess.add(caller, true);
            privateChatRoomAccess.add(roomId, roomAccess);
          };
        };
      };
    };
  };

  public query ({ caller }) func getChatRoomMessages(roomId : UserId) : async [ChatRoomMessage.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chat room messages");
    };

    // Verify user has access to this room
    switch (privateChatRoomAccess.get(roomId)) {
      case (?roomAccess) {
        switch (roomAccess.get(caller)) {
          case (?true) {};
          case _ {
            Runtime.trap("Unauthorized: You must enter this chat room first");
          };
        };
      };
      case null {
        Runtime.trap("This chat room does not exist");
      };
    };

    switch (chatMessages.get(roomId)) {
      case (null) { Runtime.trap("This chat room does not exist") };
      case (?messages) { messages.values().toArray().sort(ChatRoomMessage.compareByTimestamp) };
    };
  };

  public shared ({ caller }) func addChatRoomMessage(roomId : UserId, text : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add chat room messages");
    };

    // Verify user has access to this room
    switch (privateChatRoomAccess.get(roomId)) {
      case (?roomAccess) {
        switch (roomAccess.get(caller)) {
          case (?true) {};
          case _ {
            Runtime.trap("Unauthorized: You must enter this chat room first");
          };
        };
      };
      case null {
        Runtime.trap("This chat room does not exist");
      };
    };

    switch (chatMessages.get(roomId)) {
      case (null) { Runtime.trap("This chat room does not exist") };
      case (?messages) {
        let newMessage : ChatRoomMessage.Data = {
          id = nextMessageId.toText();
          author = caller;
          text;
          timestamp = Time.now();
        };
        messages.add(newMessage.id, newMessage);
        nextMessageId += 1;
      };
    };
  };

  // Fame/Privacy/Account Settings Management Stubs
  public query ({ caller }) func getFameLevel() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profile data");
    };
    0;
  };

  public query ({ caller }) func getPrivacySetting() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profile data");
    };
    "public";
  };
};
