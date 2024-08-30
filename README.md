# Project Explaination

## starter

.prettier file and eslint file and public which contain html and css and images and

- dev-data which contain 3 folders :
  - data : data we use to build the app `seed data like the database ` to work with .
    -img : some images to use.
  - temp : template engine that we change the data using it and send back to the user.

---

all the express js are in app.js `convention`

now we are building our rest api first we start with:
our api handling the get requests `when someone hit the api/v1/tours` he get all data about the tours and using our route handles we send back responses

##### we read our data and parse it and send it

when the post methods :body parser ` app.use(express.json());`
only we need to understand in the life cycle of req-res and in between we can set however we want from middlewares and the other are depend on the order in the code .

`we need to use a middleware :function that can modify the incoming data before it reach the server`

## file structure

adding controllers +routes folder for each endpoint +server.js and the npm script

# Mongo db & mongoose

install - create databases and insert and query in multiple ways

- it's noSQL DB
- each DB contain collections `table` and each collection contain (data structure) documents `rows` for a entity 'post , review ,user'

- collection is collection of entities and the entity is document which is also a data structure like json which make our lives alot easier .

- flexible and scalable with indexing which we need

- easy to scale horizontally

-no require to define the data schema , so each document is flexible

-performant : indexing , sharding ,embedded data model ,native duplication .

- most used db with node js

### document:

the document uses similar data format like json but its called `BJON` bcs it's each value are `TYPED `...

`{"id":5555,"title":"study"}` field are key value pair .

#### embedded documents : `reverse of normalization `

extermly important concept : we can have array of objects
we can instead of creating new documnet , we can make it better by embedding :including related data into a single document for quicker access and eisier data model `{not always}`
