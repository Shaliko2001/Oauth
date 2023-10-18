const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const FacebookStrategy = require("passport-facebook").Strategy;
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const logger = require("morgan");
const app = express();
const User = require("./models/facebook-model");


// set view engine
app.set("view engine", "ejs");
app.use(logger("dev"));

// set up session cookies
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// facebook  AUTH ------------------------------------------------------------
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


passport.use(
  new FacebookStrategy(
    {
      clientID:keys.facebook.clientID, // your App ID
      clientSecret: keys.facebook.clientSecret, // your App Secret
      callbackURL: '/auth/facebook/callback', // Adjust the callback URL
      profileFields: ['id', 'displayName', 'email'],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ facebookId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          console.log("user is: ", currentUser);
          done(null,currentUser)
        } else {
          // if not, create user in our db
          new User({
            facebookId: profile.id,
            username: profile.displayName,
          })
            .save()
            .then((newUser) => {
              console.log("created new user: ", newUser);
              done(null, newUser);
            });
        }
      });
      return done(null, profile);
    }
  )
);

//------------------------------------------------------------

// connect to mongodb
async function connect() {
  try {
    await mongoose.connect(keys.mongoDB.dbURl);
    console.log("connected to mongoDB ....");
  } catch (e) {
    console.log(e);
  }
}
connect();

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("app now listening for requests on port 3000");
});
