# Authentication Authorization and Security

- it's all about users signing up and logging in to our app
- allowing users to access some protected parts in the app that are not accessable to the not logged in users .
- JWT technique

- all about users
- remember that the user resource are special bcs it have to deal with the auth
  i started by :

1/ model our user data and create the `schema and model`
2/create new user
we do create user and log them in and update password in auth controller `sign up `and user controller and all rest operations
3/ we use in the user handler `router.post .. for signup`

- authentication: `signup and login and reset password`are relevant only the user it self not for an admin or anything else

#### password managment !!!

validate `passowrd are same with confirm  password`and encypt we do it in the model where anything
have to do with data there we place it in the model to have fat model and thin controller

```js
validate: {
      //this only work on .create() / .save
      validator: function (value) {
        return this.password === value;
      },
      message: 'mismatch password and confirm password',
    },
```

we use middleware to remore the confirm and encrypt the password

---

### after setting up the model and the signupin auth controller and secure the password in user model.we implement the user authentication and authorization to : log in and allow or not users to interact with protected resources that we define in our app .

`JWT one of the methods of this auth flow`

stateless solution for authentication : so need to store or remember in server `follow RESTFUL API`

there are alternative which is store the user loggin state on the server using sessions.`not stateless`

-- we have registered user in out data base so he login FOLLOWING :
1/ post request{email , password }
2/ check if user and password are true SO generate`SECRET` JWT
3/ send JWT back to the client
4/ store it in cookie or localstorage
LOGGED ;`the server doesnt know which user are logged in but the user know bcs he have a VALID JWT `
like a passport .
this jwt not saved in server so its stateless

---

now the user is logged in now when he will access any protected route he send his jwt with request
`like he is showing his passport to airport `
-check if its valid if yes get if not handled error

-this should be in https to save the jwt and data .ONLY THAN WE WILL HAVE SECURE SYSTEM

`check the lectures`

forming the jwt :

jwt : just coded and anyone can decode them so dont put sensitive data  
header:meta data
payload :`data we can encode into the tocken`
verify signature:made by => the(header , payload) , and the sercet inside the server

------- than its send to the client and than when the client want to visit protected route we verify it :
to make sure thatt no third party or anyone changed it so we take the header and payload and the secret
and create test signature and compare ----- if they are same u are `authenticated` if no u are not

login and signup. `we need to be so so carful when we write the auth `

responsiblity with no mistakes done . there are one library called passport.

everything we write it alone .
start in the auth controller

-- usually when we sign in in a web app we get automaticlly logged in

`installed npm i jsonwebtoken`

expire , verify we use to login the users  
jwt.sign take the paylouad and secet to create new token .
aync and the callback take an err

##### now in lecture 130 :

- we created jwt and token and send it back to the user in signup process than
  -we want to verify and login user based on there email and p assword nd log them in

- the concept of user login means to sign JWT and send it back to the client .
  start in authcontroller
  implement a route for login and in authController a login function

--note: not good to leak the user data to the client so we say that in the schema
-- get all users should not return the password

##### lecture:131-132:protecte routes

-- in authentication we have 2 steps : 1/login users , 2/ protect routes

for example we want `getalltours` route to be protected to allow only logged in users can access the list of tours .

means that before running `getalltours` we need to check if the user are logged in or not
so we use middleware in `tourController` before excuting this function

we need to verify this 4 things in this steps :

ofc the client is the one who need to send his jwt in header request after he get it from his signup or login

```js
  1) get token and check if its there (exist)
  2) most imporetant :`verification`:validate token using jwt algorithm
  3)check if the user still exist
  4) if user changed password after the jwt token was issued
```

we get the token usually in http header we can do that in postman and read with req.headers

--to send a jwt token in header we have a standard way to do that
in post man or in header
`  key :Authorization ||||||value :  Bearer JWT`
-2 error can appear hear and we can handle` 1/ invalid token && 2/ expired token`
so in total we have 5 operational errors

- when we log in or sign up we get a token (every user have its own token contain his id),
  and than always he need to send that token in the header to allow him pass some routes by verifying that 4 things.

- implement signup and login and protect in the authController and usr it with the userRouter

##### lecture 133: postman setup

- environments : context where our app is running
  that we can test our app in dev and prod to change env variable just once
  -automate the process of copying the token and pasting in the header of the request by this:
  create a tests in post responce script and automaticlly create that env variable beside the url
  than use it in the authorization tap .

##### lecture 134: authorizaztion && user roles && permisions:

`authorizaztion: is verifying if a certain user have the right or (permission)to perform and interact with some resource  ,allowed or not even if its logged in`

login in users are not enough so we implement the authorization and permissions and roles .
we know that u need to be logged in , in order to be able to see the tours but now what if delete or adding tours
you ofc can't

so we build middleware to restrict certain routes like deleting only to some users.

the middleware called restrict which check if the user role if he can do that operation or not !

##### lecture 135-136-137 : password reset functionality and reset token

think works like that :
you provide ur email than we get an email message inside of it a link to go enter ur new password .

2 steps:

1/ user send a post request to forgotPassword route with email and this will create reset random token
and send that to this email .

2/user send from his email with the password to update it

so in auth controller we go create : resetPassword and forgetPassword routes in user like signupa and login
post requests

- we create in our schema fields for resetpasswordtoken and token expire time in our data base and method to create this two peices of data for each document in the database. and crypt the sensitive once.

- send it in email using NodeMailer + mailtrap in email.js in utils:

```js
   1 create transporter
   2 define email options
   3 send email with node mailer
```

for example :

```js
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    //activate in gmail 'less secure app option'
    // not good idea for production app bcs of limit 500 per day and ususally u get marked as spam
    // so if its just private app its fine if no than dont .
  },
});
```

-- used development secrices fakes sending emails to real email but they come to us in development inbox.

reset password flow :

```js
  1/ get user based on the token
  2/ if token has not expired && there is user , set the new password
  3/ update changedPasswordAt property for the user
  4/ Log the user in : send jwt

```

###### summary:

to implement the reset password we need first to hit to the forgot password route which is :
get user based on the posted email than generate random token:`passwordResetToken` not jwt token than sendemail to the email contain the reset url and message than we get email contain the url with that token that we indentify the users using that token  
that we hash it and look for user who have the same hashed token and check if its not exipred than update the changed passwordat property and return the token to the user

##### lecture 138:update the current user password :

in auth controller , ofc this route is protected means that the user should be logged in to allow him to change his password and in the protect middleware we check if the user exist and alot validation than store it in the req so we use that and we take in the body current password and the new password and the confirm password than inside the function we ge the user based in the id than we check if the current password are true than we save the new two passwords than we generate new token and return back to the user .

##### lecture 139 : update the user data by himself:

allow the logged in users to manupilate his user data in userControllers
pattern is to update data abt the account in route and password in another route

##### lecture 140 : delete the user for himself :

when the user want to delete his account we dont delete the account but we just set the document to
`unactive` bcs the user might in some point reActivate his Account
we create in schema field called active Boolean

##### lecture 141 : security best practices

gather summary for best practices in security.
check lecture

- 1:hacker gained access to the DATABASE :we must ys encreypt our password and passwordresetToken

- 2/ hacker tring to access the account trying millions of requests trying to reach : use bcrypt + rate limiter and max-login-attemps.(after fail 10 times or idk wait 2h or 3h).

3/ cross site scripting :hacker try to inject script to our app that he run the code he want.
`sanitize input`and `save JWT in HTTPonly cookies {browser can't modify just send and recieve }`not LOCALSTORAGE. and `SET HEADERS`

4/DOS attack :hacker send million of requests patch and post :rate limiter , limit body parser avoid regular expression :take so much time to run .

5/ use mongoose to avoid nosql injection + sanitize

##### lecture 142 : sned token via cookie

jwt should be stored in httponly cookies but now we are sending it as string in response.
