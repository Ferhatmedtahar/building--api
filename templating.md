# Server Side Rendering with PUG

##### lecture 175:

- we builded an api which can be consumed by web client in order to build web site or native application

create server side rendered ,after we already created `working auth system + modeling all data`.
now the front end with html css and later with `next js`.

- the actual building of the website happend of the client side so we need a data source
  usually its a api that send the data when its requested .
  so now i can build a client side with react or next js and thats all

- in server side rendering the website building happend on the backend :
  building in templates which have placeholder in html to the nessacery data + send it with css ,js, image files .

- we still can use the API for somethings in the front end .

##### lecture 176:Send Final Rendered website using PUG TEMPLATE ENGINE

- template engine :PUG or HandleBars or egs ...ect
  allow us to create a template and easily fill it up with the data we have or we get .

in `app.js`

```js
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

// NEED THIS TO WORK :bcs it serve the needed data
// serving static data
app.use(express.static(path.join(__dirname, 'public')));
```

-tell express what template engine to use + WHERE IS VIEWS ARE LOCATED IN OUR FILE SYSTEM

we created a route :

```js
app.get('/', (req, res) => {
  res.status(200).render(
    'base',
    //variable
    {
      tour: 'The Forest Hicker',
      user: 'ferhat',
    },
  );
});
```

##### lecture 177 - basics of pug :

pug is simple wide space sensitive syntax to write html
----to do nested elements just make a `tab` key haha

----for attributes
favicon and style:
link(rel='stylesheet' href='css/style.css')

----for variables

```pug
  head
    title Natours #{tour}  //first one of js like template string
  body
    h1= tour     //using  direct the value or the data we get
    p= user.toUpperCase()
    - const x = 5  //unBuffered js . have no affect in the output
    p= x*2

```

we can do some simple javaScript in it

Buffered code is the code which are added to the view .

- we can include file inside another like export and import in all programming language
- to do classes in elements : `header.header  , a.nav__el.nav__el--logout  `

##### lecture 180 : extending the base :EXtends base template :blocks

like the layout in next js

# skipped!!!

---
