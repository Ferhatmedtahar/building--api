# Project Explaination

## starter

.prettier file and eslint file and public which contain html and css and images and

- dev-data which contain 3 folders :
  1- data : data we use to build the app before we do the database
  2-img :
  3- temp : . pug

---

all the express js are in app.js `convention`

now we are building our rest api first we start with:
our api handling the get requests `when someone hit the api/v1/tours` he get all data about the tours and using our route handles we send back responses

##### we read our data and parse it and send it

when the post methods :body parser ` app.use(express.json());`
only we need to understand in the life cycle of req-res and in between we can set however we want from middlewares and the other are depend on the order in the code .

`we need to use a middleware :function that can modify the incoming data before it reach the server`
