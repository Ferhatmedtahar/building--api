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
