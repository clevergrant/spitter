# Tables

- Story
- Feed
- Following
- Followers

primary key is partition key plus sort key, if there's no sort key, you have to have a unique primary key

follows:
(partition key) - (sort key)
follower id - followee id

to find opposite, create an index:

(partition key) - (sort key)
followee id - follower id

users:
1 - Grant
2 - David

never store an array in the database

Partition key: The user's ID or something
Sort Key: Hashtags, timestamps
