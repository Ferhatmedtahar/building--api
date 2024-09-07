# ERROR HANDLING

using express and mongoose and evn variable to build robust error handling work flow

### debug

debugging node js with tool :ndb
we can use vdcode or ndb from google
download it from npm and create script in package.json for it

1-fundamontals : create breakPoints to see variables ...ect
2-in server.js we can take look to our middleware stack to see order ...ect we can see everything
app :order of middlewares and routers , values of variables , paths .

we see the global :processes and local variables and all functions of js
if we have bug and want to fix we can stop excution and see step by step like i was doing in assembly
so good to understand more our code .

- handler for undefined route by app.all('\*',CALLBACK_FUNCTION)
- overview on error instead of what we used to used in that json .

### `Erros`:

there are two types :
1- `Operational Errors`: problems that depend on the system or user or network :invalid route , invalid data , fail to connect database ...ect .`we prepare for them `

2- `Programming Errors`: mistakes like reading undefined and await withour async or reading the wrong propeties.

`express` come with global error middleware to send nice response to let the user know what happend .
or it mean retry the operations .

- having global error allow us to have seperation of concern means that we dont need to worry about it in the business logic or controller , just send them and thats all .

```js
app.use((err, req, res, next) => {});
```

4 arguments
created a middleware to handle error with 4 argument that catch error and
to Trigger this middleware we just pass `next(err)` in the route for example who handle the undefined routes .and this err we create from custom class so we have `class+ route ` + middleware with 4 args 'error'.

---

## catching errors in our async functions :

in the TourController we have async/await function yes using try/catch to catch error `makes our code so messy`

we created catch async to remove the try/catch . catch async

instead of throwing new error we call just the return next()

- errors during development VS production bcs we are sending the same error message
  bcs in production we want to send so less info to user to beb freindly not like development
  in error controller we just make if else statement and control what we want to show

keep in mind the errors which they come from mongoose `mongo db driver`
`we need to mark them as Operational` in the `production not in development `:
1- invalid id
2- unique: duplicate FIELDS,like id or name
3- validator: passing diffrent than the min & max or diffrent type ...ect

## handle error outside of express

for example database conntection: using proccess.on('unhandledRejection)
this will emmit an event called unhandledreje.. from the process to stop the app so we handle that

so as SUMMARY

- we debug the app using ndb than handle the error in this order :
- identify the operational errors and programattic error
- create a handle for the undefined routes
- create general error handler: middleware in `Controller folder`
- `custom error class+ route`
- created one util for catch async to remore the try catch
- we handle the error from the requiest in this way : in get methods ::

```js
if (!tour) {
  return next(new appError('tour not found with that id', 404));
}
```

- we handle in the create and update and delete the validations error from mongoose and mongo db driver which are 3 : invalid id , unique properties , validators error all in the error controller to make them operational

#### unhandled rejection:

in server.js

- handle the unhandled rejection which we might get in fail in db by process.exit but before we need to close the server that it handle the pending requiets first than shut the app down.

#### uncaugh expections :

errors or bugs which they occurs in our sync program and they are not caught
example : console.log(x) which is not defined
