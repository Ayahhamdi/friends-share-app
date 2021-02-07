# Friends-Share-App
 A Web application to share with your friends posts with images and add comments on them, it is implemented using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching POSTS. Each POST item can optionally have an attachment image. Each user has access to his posts so that he/she can delete, update with an image and view its comments. Each user also can view all other posts only for view or add comments on them, he/she has not authorized to delete nor edit them.


# POSTS and COMMENTS

The application stores both POST and COMMENTS items, and each POST item contains the following fields:

* `userId` (string) a unique id for a user
* `postId` (string) a unique id for a post item
* `createdAt` (string) - date and time when a post was created
* `postText` (string) - contains the text of the post
* `updatedAt` (string) - date and time when a post was updated
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a POST item

Each COMMENT contains the following fields:

* `postId` (string) a unique id for a post item which this comment belongs to
* `creatorId` (string) a unique id for a user who create this comment
* `commentId` (string) a unique id for a comment item
* `createdAt` (string) - date and time when a post was created
* `postText` (string) - contains the comment text


# Functions that are implemented

the following functions are implemented and configured in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that added to all other functions.

* `GetAllPosts` - returns all POSTs for all users 
It should return data that look like this:

```json
{
    "items": [
        {
            "createdAt": "2021-02-04T18:58:19.580Z",
            "postId": "fd971642-ee14-4aaf-8384-82a978fe6eda",
            "postText": "edit post",
            "attachmentUrl": "https://friends-share-posts-dev.s3.amazonaws.com/fd971642-ee14-4aaf-8384-82a978fe6eda",
            "updatedAt": "2021-02-04T18:59:03.239Z",
            "userId": "auth0|6019799c64a910006a0fb626"
        },
        {
            "createdAt": "2021-02-04T17:35:44.875Z",
            "postId": "a793ff78-7a39-4b5f-b43c-bdd30076d4e9",
            "postText": "hi farah",
            "userId": "auth0|6019799c64a910006a0fb626",
            "updatedAt": "2021-02-04T17:35:44.875Z"
        }
    ]
}
```

* `GetPostsPerUser` - returns all POSTs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
    "items": [
        {
            "createdAt": "2021-02-03T07:06:03.949Z",
            "postId": "616b1b84-113b-437e-b467-270fa7d02760",
            "postText": "Have a great day",
            "attachmentUrl": "https://friends-share-posts-dev.s3.amazonaws.com/616b1b84-113b-437e-b467-270fa7d02760",
            "updatedAt": "2021-02-03T07:06:03.949Z",
            "userId": "auth0|6019799c64a910006a0fb626"
        },
        {
            "createdAt": "2021-02-03T09:03:28.798Z",
            "postId": "fd550efd-5461-4ed7-a0c6-38a018bb1e4a",
            "postText": "I am ayah",
            "attachmentUrl": "https://friends-share-posts-dev.s3.amazonaws.com/fd550efd-5461-4ed7-a0c6-38a018bb1e4a",
            "updatedAt": "2021-02-03T09:03:28.798Z",
            "userId": "auth0|6019799c64a910006a0hd654"
        },
        {
            "createdAt": "2021-02-04T08:52:49.922Z",
            "postId": "513b90fd-2795-48ee-9fb4-3ba4c437e007",
            "postText": "Hi Hamza",
            "attachmentUrl": "https://friends-share-posts-dev.s3.amazonaws.com/513b90fd-2795-48ee-9fb4-3ba4c437e007",
            "updatedAt": "2021-02-04T08:52:49.922Z",
            "userId": "auth0|6019799c64a910006a0hg478"
        }
    ]
}
```

* `CreatePost` - creates a new POST for a current user. A shape of data send by a client application to this function can be found in the `CreatePostRequest.ts` file

It receives a new POST item to be created in JSON format that looks like this:

```json
{
	"postText": "Hi Hamza"
}
```

It returns a new POST item that looks like this:

```json
{
    "item": {
        "userId": "auth0|6019799c64a910006a0fb626",
        "postId": "f64003b5-0c83-40a5-9f06-711d25499d28",
        "createdAt": "2021-02-07T12:38:41.592Z",
        "postText": "Hi Hamza",
        "updatedAt": "2021-02-07T12:38:41.592Z"
    }
}
```

* `EditPost` - updates a POST item created by a current user. A shape of data send by a client application to this function can be found in the `EditPostRequest.ts` file

It receives an object to be updated in JSON format that looks like this:

```json
{
	"postText": "edit post"
}
```

It returns a JSON item that looks like this:

```json
{
    "items": {
        "Items": [
            {
                "createdAt": "2021-02-04T18:58:19.580Z",
                "userId": "auth0|6019799c64a910006a0fb626"
            }
        ],
        "Count": 1,
        "ScannedCount": 1
    }
}
```

The id of an item that should be updated is passed as a URL parameter.


* `DeletePost` - deletes a POST item created by a current user. Expects an id of a POST item to remove.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an image file for a POST item.

* `GetCommentsPerPost` - returns all COMMENTS for a current post. A post id is extracted from URL

It should return data that looks like this:

```json
{
    "items": [
        {
            "commentText": "bring to me lunch",
            "createdAt": "2021-02-04T08:53:42.391Z",
            "postId": "513b90fd-2795-48ee-9fb4-3ba4c437e007",
            "commentId": "7f821c03-4d4f-45e8-9d06-b606e97e963f",
            "creatorId": "auth0|6019799c64a910006a0bh546"
        },
        {
            "commentText": "hiiiii",
            "createdAt": "2021-02-04T09:36:19.111Z",
            "postId": "513b90fd-2795-48ee-9fb4-3ba4c437e007",
            "commentId": "7c2b1542-7b37-4a60-95a0-caa21d6adff0",
            "creatorId": "auth0|6019799c64a910006a0rf345"
        },
        {
            "commentText": "bye",
            "createdAt": "2021-02-04T17:00:51.474Z",
            "postId": "513b90fd-2795-48ee-9fb4-3ba4c437e007",
            "commentId": "20c5102a-b023-4c18-b0e5-59c6ab2a41af",
            "creatorId": "auth0|6019799c64a910006a0se123"
        }
    ]
}
```

* `CreateComment` - creates a new Comment for a current post. A shape of data send by a client application to this function can be found in the `CreateCommentRequest.ts` file

It receives a new Comment item to be created in JSON format that looks like this:

```json
{
	"commentText": "give me the book link"
}
```

It returns a new COMMENT item that looks like this:

```json
{
    "item": {
        "postId": "513b90fd-2795-48ee-9fb4-3ba4c437e007",
        "creatorId": "auth0|6019799c64a910006a0fb626",
        "commentId": "7f821c03-4d4f-45e8-9d06-b606e97e963f",
        "createdAt": "2021-02-04T08:53:42.391Z",
        "commentText": "give me the book link"
    }
}
```

* `DeleteComment` -  deletes a COMMENT item created by a current user. Expects an id of a COMMENT item to remove.

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.


# Frontend

The `client` folder contains a web application that can use the API that developed in the project.

## Authentication

An Auth0 application is created to implement the authentication in the application, "domain" and "client id" are copied into the `config.ts` file in the `client` folder. asymmetrically encrypted JWT tokens are used.

# How to run the application

## Backend

Application is deployed @ https://p91ejgm028.execute-api.ap-south-1.amazonaws.com/dev/posts/

## Frontend

To run the client application, run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the Friends Share application.

# Postman collection

An alternative way to test the API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")

