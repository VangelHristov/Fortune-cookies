
#/
Redirects to #/home
#/home
Shows all fortune cookies
Available to all users, logged-in or not
Provides a way to sort the cookies by likes or shareDate
Provides a way to filter fortune cookies by category
#/home?category=CCCC
Shows only the fortune cookies in category CCC
#/my-cookie
Shows the current hourly fortune cookie for the logged-in user
Application requirements

---------------------------------------------------------------------
# Users

# api/users

#GET
Returns all users

#POST
Registers a new user
Needs username and passHash to be sent in the body of the request
--------------------------------------------------------------------

#api/auth

#PUT
Logs in an user
Needs username and passHash to be sent in the body of the request
If the request is valid returns username and authKey
Fortune Cookies
#---------------------------------------------------------------------


#api/cookies

#GET
Returns all shared fortune cookies

#POST
Shares or re-shares a new fortune cookie
User must be logged-in
Needs text, category, img to be sent in the body of the request and the current user's authKey as a header with name: x-auth-key
img is a string to an online image
img is optional and if not sent, a default batman image will be provided
------------------------------------------------------------------------

#api/cookies/:id

#PUT

Likes or dislikes a fortune cookie
Needs type to be sent in the body of the request
type can only have values 'like' or 'dislike'
My Fortune Cookies

-----------------------------------------------------------------------

#api/my-cookie

#GET

Returns the hourly fortune cookie
Categories

---------------------------------------------------------------------


#api/categories

#GET

Returns an array with all categories
Deliverables
--------------------------------------------------------------------------



#Username
A string
Has length between 6 and 30
Can contain only Latin letters, digits and the characters '_' and '.'

#Fortune Cookie Text
A string
Has length between 6 and 30
Can contain any characters

#Fortune Cookie Category
A string
Has length between 6 and 30
Can contain any characters

#Fortune Cookie Img
A string
Must be a valid url address