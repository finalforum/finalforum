# FinalForum API

## Model

| Name           | Description                           | Resource root                |
|----------------|---------------------------------------|------------------------------|
| Forums         | Forum instances                       | `/api/v1/users`              |
| Users          | Forum users                           | `/api/v1/users`              |
| Categories     | Groups of boards                      | `/api/v1/categories`         |
| Boards         | Collections of posts                  | `/api/v1/boards`             |
| Posts          | Posts to a board                      | `/api/v1/topics`             |
| Replies        | Replies to a post or reply            | `/api/v1/posts`              |
| Messages       | Private messages between users        | `/api/v1/messages`           |


## Relationships

* One forum has
  * many users
  * many categories
  * many messages
* One user has
  * many forums (memberships and ownerships)
  * many users (followers, followees, and blocked users)
  * many posts
  * many replies
  * many messages
* One category has
  * one forum
  * many boards
* One board has
  * one category
  * many posts
* One post has
  * one user
  * one board
  * many replies
* One reply has
  * zero or one posts   (must have a post if it doesn't have a reply. cannot have a post if it has a reply.)
  * zero or one replies (must have a reply if it doesn't have a post. cannot have a reply if it has a post.)
* One message has
  * one user (sender)
  * many users (one or more recipient who is not the sender)
