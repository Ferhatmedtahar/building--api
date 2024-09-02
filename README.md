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

-max size for each document 60mb
-each document have its own id `primary id ` no need to worry abt it

# create and connect a remote database `{Cluster}`

we created in atlas in the free plan a cluster and i connect it to the compass mongo and to the shell using the commnad `Win + r ` .

now we connect it to our app using mongoose

---

###### we downloaded the vs code extention than copied the app development string and put everything in the `env`

```js
const mongoose = require('mongoose');

const DB = process.env.APPDEV;

mongoose.connect(DB).then(() => console.log(`DB connection successful !`));
```

this is what we did

- mongoose is an `ODM` object data modeling library for mongo db and node js

  -layer of abstractions like express and node js

  -ODM allow us to write js code to interact with this db and we use it to get better DX and alot more functionality out of the box .

- schemas : structure and validation and default values and easy model data and validations and query api .

#### we require the mongoose

```js
const mongoose = require('mongoose');
```

than we use all function in it

1/ connect the database by doing proccessing the url which i get from the cluster than use the connect method .

2/ create a schema for a spific collection : we can validate and give an error message and required and unique ...ect

```js
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
});
```

create model from the schema .

```js
const Tour = mongoose.model('Tour', tourSchema);
```

CHECK DOCS ONLY...

create a schema in the modelfile than create a model from that schema than export it and import it in the controllers than create a documentt and save it and handle the promise

-- we can make alot thigns with the :get-query operations like filtering sorting paginations

---

# Summary :

so first of all when we start building our api we create :`app.js server.js`
and 3 folders :`routes , models , controllers`.

router contain only direction to -> the controllers

- which are bunch of `async/await : try/catch` and they use `model which we export ` to perform the CRUD operations and alot other stuff like sort and filter ...ect
- in app.js we use `mongoose` to connect to the server`mongoose.connect(DB)` and in the model `schema ,model` to create and export model which we spesify in it the structure of our documents .

---

we can create a file that it connect to the database and import data to use it while develment
completly seperate from our express app

---

we implement the filter and sort and rest of operations in the controllers :getALL

### to implement that features we need just to `manupilate string which we get from url and see what the DB accept`

#### filter :

filter the req.query from the other field and make lt , gt ,... available and thats all

#### sort :

we do if statemnet and we fix the string of query in sort field : `asc , - desc , multiple fields sorting  seperate by espace , default sort in the else statement which the createdAt field`

#### Limit fields`project `:

its just the select fields in SQL if andthats all

#### pagination :

easy work with skip and limit only

#### alias:

prefill the request queries.

route for a request which is very popular for example the best 5 cheap tours
that we dont have so huge url for that for example :
`request done all the time :127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingAverage,price`

we want request easy to memorize for users so we do in new route and
set a middleware in the controller file and export which change the query object and thats all

---

## refactor the code always: CLASS FOR THE FEATURES

we create class called APIFeatures and we add methods to the class
and we create instance of this class [object] and we call this method
passing the `req.query , Tour.find()` which is the model it self which we keep adding to it methods and excute it at the end once its done

---

---

## next topic: AGGREGATION PIPELINE

- aggreation we can calculate alot things and process our data using : max min count avg and distances ...ect for statistics and alot other reasons
  aggreation allow us to perform operations on the documents we can filter them than group than calculate and we can `update` documents
  [MONGODB-DOCS]('https://www.mongodb.com/docs/manual/aggregation/#std-label-aggregation-pipeline-intro')

- $unwind take array in some field and create for each item a document with everything same expect the field
