// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Twitter {

    uint16 public MAX_TWEET_LENGTH = 280;

    struct Tweet {
        uint256 tweetId;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    event TweetCreated(uint256 tweetId, address indexed author, string content, uint256 timestamp);

    event TweetLiked(address liker, address indexed tweetAuthor, uint256 tweetId, uint256 newLikeCount);

    event TweetUnliked(address unliker, address indexed tweetAuthor, uint256 tweetId, uint256 newLikeCount);

    mapping(address => Tweet[]) public tweets;

    address internal owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not authorised");
        _;
    }

    function createTweet(string memory _tweet) public {
        require(bytes(_tweet).length <= MAX_TWEET_LENGTH,"Content is too long!");
        Tweet memory newTweet = Tweet({
            tweetId: tweets[msg.sender].length,
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0

        });

        tweets[msg.sender].push(newTweet);
        emit TweetCreated(newTweet.tweetId, newTweet.author, newTweet.content, newTweet.timestamp);
    }

    function changeTweetLength(uint16 _newTweetLength) public onlyOwner {
        MAX_TWEET_LENGTH = _newTweetLength;
    }

    function getTweet(uint _i) public view returns (Tweet memory) {
        require(tweets[msg.sender].length >= 1, "No tweets yet!");
        return tweets[msg.sender][_i];
    }

    function getAllTweets() public view returns(Tweet[] memory) {
        return tweets[msg.sender];
    }

    function tweetOwner() public view returns (address) {
        return msg.sender;
    }

    function likeTweet(address author, uint _tweetId) external {
        require(tweets[author][_tweetId].tweetId == _tweetId, "Tweet does not exist!");

        tweets[author][_tweetId].likes++;
        emit TweetLiked(msg.sender, author, _tweetId, tweets[author][_tweetId].likes);
    }
    
    function unLikeTweet(address author, uint _tweetId) external {
        require(tweets[author][_tweetId].likes > 0, "There are no likes");
        tweets[author][_tweetId].likes--;
        emit TweetUnliked(msg.sender, author, _tweetId, tweets[author][_tweetId].likes);
    }
}