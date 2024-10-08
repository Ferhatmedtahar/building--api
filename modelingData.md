# learn how to work with data & modeling concepts and techniques & implement data model using mongoose

-- whole new level of mongoose and data modeling
-- totally functioning with all routes and resources and complete auth and establshed relations between all data sets .

##### lecture 148 : mongo DB Data Modeling

-to build data intensive apps is to medel all this data in mongo db.

--data modeling is : process of taking unstructured data generated from real life senarios and structure it into a logical data model in database follwing centain creteria . learned about in lecture .

for example : we want to build and disgn online shop data model :
-- first we get tons of this unstructred data : cart , categories , orders ,products ,,,,ect

the goal here is to structure and connect them into logical way.

the most demending place where we need to think alot : no unique way + no straight answer .

```js
process : 4 steps :
1- indentify the diffrent relationships between data
2- referencing /normalization VS embedding /denormalization
3- framework choise :embedding or referncing  other documents . based on some 3 creteria
4/types of referencing
```

relations: movie

###### 1:1 movie ----> name

###### 1:many `most important !`: we enter the quantity not like sql

1:few : few around 1:[2-100] rewards
1:many: many : 1:[100-99999] reiews one document to many
1:ton: ton :1:[millions to infinity] login grow to million

###### many:many

1 movie can have multiple actors but one actor can act also in many movies
-->
<--

1:1 , 1 :many... have one directions

many:many go in both directions

2// referencing Vs embedding :
movies :
movie have actors and we decide if we normalize or embedded the data either
we connect them using the id's :
child referencing . movie reference the child .
this will allow us to query the embedded data on its own but more queries to the data base for the referenced docs.

if we choose embedding we will have everythhing in one place which will give us less queries to the database
for better performancr but cannot query the embedded data on its own

-3// choosing to normalize or denormalize data .
COMBINE:
3 cretiria : relationship types , data access (read/write data ratio ) , data closeness how much the data is related to each other . if we want to query each data set alone or not !

`we want to query each data set alone or not !` than check the other two by the ratio readwrite and type of relations

//4 types of referenceing [if we choose refercing based on previous creterias]:
-child referencing : always try to avoid . parent referce to his child `reach limit of childs in that array to 60mb` used for the little references data

-parent referencing: child referce to his parent parent doesnt know how much childs referencing to him `best`
1:many , 1:ton

-two way referencing : many to many one refernce to other in both documents
easy to manupilate data and aggregate and get statistics about it.

-

1/ data sets places [all data we need to have without the details yet].

2/make conntection `who is parent &who is the child |the type of relationship |  referencing or embedding `

finished implementing this part

##### lecture 150 : modeling Geospatial

Geospatial : data describe places on earth using : lat longor even complex geometries
the locations are embedded in the tours so everything related to the locatoin are declared in the tour model [parent]
####GeoJSON data

```js
 startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      adress: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
          coordinates: [Number],
          adress: String,
          description: String,
          day: Number,
        },
      },
    ],
```

object which is one field and the big object inside of it other firlds which will make it : embedded documents

we can do alot good stuff with this geojson like querying and aggregating close areas amd ..ect

##### lecture 151 : tour guides embedding :

when we create new tour u need to specify all the guides id's in array to get them behind the scenes by doing `pre save middleware`
async function when we take the id which is the request and aawait to get them from the user Collection & next()

SAME LOGIC FOR CREATE AND UPDATE ALWAYS

##### lecture 152 : tour guides child referencing :

bcs if we create new tour than we update some user in that tour we have to update it too and this is not good so we do referencing

-seperated entities tour and users ofc !!
in the tour we save ids of the users guide
we expect the guide sub fields to be array of ids
--how to establish `references`connection between diffrent data sets `diffrent entites `

````js
//guides
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref:'User'
      },
    ],```
````

when we create a new tour we dont behind the scenes get the user data and save it , instead
we do child referencing for that `the tour stored as its craeted only the array of id have `
and to display the data when we get we do in two process : populating

##### lecture 151 : Polulating tour guides process:

populate to get access to the referenced tour guides when wequery for certain tour
the data will look like its embedded but in schema its referenced so we do this process in query

.populate('guides'): we want to fill the fields called guides in our model

```js
const tour = await Tour.findById(req.params.id).populate({
  path: 'guides',
  select: '-__v -passwordChangedAt',
});
```

we can specify what we want or dont want to see

\*--POPULATE we need it when we have relations it create new query ,its the one which create new query to get rest of referenced data and we still can query it alone

when we query data and we have duplicate in populate we do query middleware

##### lecture 154: reviews model and parents referencing :

when we do model we do the schema than consider doing the virtual properties:fields are not stored in database but calculated using some other values in that documents
than the methods than and middlewares like query or document ...ect

##### lecture 157 : virtual populate:

populating tour or user good but left for us one problem : how to access reveiws on tours.
means that how can i get all reviews of a specific tour or to get all reveiws of a user
EXPLAINATION: this problem araise bcs we did parent referencing on reviews

solutions:after we did parent ref we now have the review point to the parent and the parent have no knowledge about the reviews pointing to it SO :
we do instead of doing ref inside the tour:NOT GOOD!

the `virtual populate`:we can populate tour with reviews:
like gaining the knowledge about who is pointing on u without having that array which can grow indirently.

have that array of ids of reviews but not stored in thatt document and in that database.

```js
//virtual populate
//. virtual() , name of this field,
//objectof options:
//1/name of model which we want to ref
//2/ specify 2 fields : foreign field and local field
//foreign field :name of field in the other fields
//local field : in this cuurent firlds
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
```

we dont get it till we call it in one of the routes usually only in `get/:id`

//REVIEW :got CHAIN OF POPULATE

##### lecture158 : implement nested routes:

when we create a review we need manually to pass the tour id and the user id manually in req body than create the review its ok to do this while development .
REVIEW is created in real world by the user id should come from the logged in user and the tour id should come from the current open tour .should be incoded from the url

<!-- ? NESTED ROUTES USED WHEN  WE HAVE CLEAR RELATIONSHIP BETWEEN THE PARENT AND CHILD BETWEEN RESOURCES IN DATA MODEL -->
<!-- * we implement this touring in the parent router  -->

SHOW THE RELATION BETWEEN PARENT CHILD

##### lecture 159: nested routes in express

`merge params`
WE CAN REDIRECT AND JUMP FROM ROUTE TO ANOTHER
so when i have relation :Parent-Child :we connect them using parent router than we redirect it to the child route that we dont write the id's manual

#### lecture 161 : building factory function delete:

function that return our handler function. for the CRUD operations
now we do delete

its like having one controller function producer that create delete update..ect for each one
GENERALIZATION , bcs all the delete functions are so specific but this one are general

- for all CRUD operations

SO CLEAN:
controllers : user , tour , review + `auth , error ,HANDLEFACTORY`
models:for Schema ,virtual , methods,pre +post middlewares ,
routes :route , post ,get ...+ function related to
Utils:apiFeatures ,appError , catchAsync , email
static: css ,img ,html to serve (temp)

--always the auth stuff are defined in route declarations
--if u ever needed to modify req or validate something make a middleware

##### lecture 165:auth missing peice

we can expose some methods and route to the world that we can share for other websites to get

##### lecture:167 Indexes

huge win for performance in reading data for search and filter ...ect

```js
//add explain
const doc = await features.query.explain();
```

chain .explain() after the query wil add STATISTICS.

-when we did query we got 3 results and it show us that we examen 9 docs which is not good if we have alot docs not effient .

`we can build indexes on specific fields in a collection `
when we set a unique field , behind the scenes mongoose create index for it

-which field to index it ? how do we decide ?

-- think about access pattern like which field are queried the most and which are mostly read not write

##### lecture 168-169: calculating the Average Rating on Tours

Storing summary of related data set in the main data set is popular technique .
ratings , we have in tours ratings average. and number of rating.
great to avoid extra queruies

we create a function that it take this tour id and calculate what we need and even update the tour and than we call this function in middleware .

`STATIC METHOD`
same as methods but they point to the model so we can do in it the aggreagation .

after calculating what we need , now we want to call this static function using middlware

so in general we created a statics function inside the schema and we aggreate than we update the tour model
than we call this statics function using post save middleware

ok , now this function run only when the review are craeted! now we need to do when its updated and deleted

```js
reviewSchema.post('save', function () {
  //this points to the current  review document .
  // this.constructor is the document than the constructor is the model who craeted that document
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.tour);
});
```

it work it always calculate and upadte the tour when new review CREATED , or UPDATED , or DELETED

##### lecture 170 : preventing duplicated reviews

before we created alot review for same tour with same review and this should not happend , a user can have only one review for each 1 tour
we make an index for user,tour combined

##### lecture 171 : geospacial queries

we created in tour model startLocation and locations fields which they are GEOJSON :
data describe places on earth using : lat long or even complex geometries .

geospatial query allow us to perform great operations to offer more features

-we create route for this in get methods all in url not search query params

```js
//!1- get the data we need
const { distance, latlng, unit } = req.params;
const [lat, lng] = latlng.split(',');
if (!lat || !lng) err...ect
//? 2specify the filter object
//!the unit is radiante = our distance/raduis of earth in
const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
const tours = await Tour.find({
  startLocation: { $geoWithin: { $center: [[lng, lat], radius] } },
});
//? 3-add index for the field which are doing in it the geospatial query
tourSchema.index({ startLocation: '2dsphere'});
```

-we define the route and params to know which data we are working with .

aggreagation middleware
