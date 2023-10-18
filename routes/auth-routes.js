const router = require("express").Router();
const passport = require("passport");

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send(req.user);
});

// auth with facebook
router.get('/facebook' ,passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' }));
router.get('/profile', (req, res) => {
  res.send('Welcome, ' + req.user.displayName);
});

module.exports = router;
