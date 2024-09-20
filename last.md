# upload files & image proccessing & sending emails & accept credit cart payments

##### image uploads using Multer package

image uploades for image photos with package called `Multer`
popular middleware to handle multipart form data ,used for upload files from a form.
for user photos

```js
// where we want to save our images which got uploaded
const upload = multer({ dest: 'public/img/users' });
const router = express.Router();

router.patch('/updateMe', protect, upload.single('photo'), updateMe);
```

now we need to config the multer for our needs , better file names , allow only image files to be uploaded to the server.

```js
const multerStrorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image!, please upload only Images.', 400), false);
  }
};

// where we want to save our images which got uploaded
const upload = multer({ storage: multerStrorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');
```

#### lecture 201-202:

we have now everything setted up the storage and naming and filter
now we want to link the user to the new updated image in :the req.body in controller user we do this.

- resizing the image:
  image manupilation and proccessing and convert
  we use `sharp` for :image proccessing library in node js
  when we upload a image and than we do a proccessing in it we just store in the memory

```js
const multer = require('multer');

// const multerStrorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });
const multerStrorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Not an image!, please upload only Images.', 400), false);
  }
};

// where we want to save our images which got uploaded
const upload = multer({ storage: multerStrorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');
//!resize the user photo
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  //redefine the filename bcs we removed the storage from disk to memory to process the images before its saved
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  // sharp
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  //write in in a file in our disk
  next();
};
```

add form in the page which we want to submit that photo

```pug
        form.form.form-user-data(action='/submit-user-data' method='POST')
```

```js
//form data
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('photo', document.getElementById('photo').files);
    updateSettings(form, 'data');
  });
```

# building complex email handler

#### build email template with pug & sendGrid service

in email.js we define a class and we pass the user and the url and we define some methods and we can add whatever we want .
and ofc dont forget we define the transport and the email options
`we use two services: mailtrap for DEV  & sendgrid for production`

we have a package that remove all the text from html file and let just the content
`npm i html-to-text`

we can define the urls here like that everything from the requests

```js
const url = `${req.protocol}://${req.get('host')}`;
```

sendGrid now
created account
we go to the setup guide
integrate our api with smtp :Relay `that it work with nodemailer`
-create api key than copy and make :env varaialbes for them

---

payments with STRIPE

to allow users to buy
//backend:
we create a route that create a stripe checkout session `secret key`[data about the product and client]
//frontend
we create a function that request a checkout session in BUY BUTTON

than we charge the credit cart using THAT SESSION using `public key`

//work only in deployed .
than we use `stripe web hook ` on backend to create new booking

---

on booking controller and router we create a get handler on specific tour
we find the tour and craete a session using `npm i stripe`+ get the secret key

we got the session and send it back to the client

---

on

# DEPLOY

1/ install a package to compress all our responces.
`npm i compression`

2/ remove all the logs .

3/change the url in the client side from the development url `http:127.0.0.3000` ,
we let only the relative url not absolute . `not this if the front and back ends are hosted in diffrent places `

4/ created the bundle : build
