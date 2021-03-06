const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getUsers, (req, res) => {
  res.status(200).json(res.locals.users);
});

// Register:
// 1) POST to '/'
// 2) Check if user exists on database -> if not, create user.
// 3) Create and sign JWT token to encrypt the user information and put it into a cookie for the client (frontend) side.
router.post(
  "/register",
  userController.register,
  userController.signToken,
  (req, res) => {
    console.log("1) user sucessfully registered");
    res.status(200).json({ sucess: "yes" });
  }
);

// Login:
// 1) POST to '/login'
// 2) Check if user exists on the database -> if yes, compare hash password and log the user in.
// 3) Create and sign JWT token to encrypt the user information and put it into a cookie for the client (frontend) side.
router.post(
  "/login",
  userController.login,
  userController.signToken,
  (req, res) => {
    console.log("1) user sucessfully logged in");
    res.status(200).json(res.locals.user);
  }
);

// Mock route to test if verifyToken works.
// router.get('/secret', userController.verifyToken, (req, res) => {
// 	res.status(200).json({sucess: "secret"})
// })

// Private route:
// 1) GET to mygroups (groups user belongs to)
// 2) Check if the user has the JWT token stored in the cookie on the frontend -> if yes, verify it along with the JWT secret
// 3) Respond with the user's joined group details
router.get(
  "/mygroups",
  userController.verifyToken,
  userController.getMyGroups,
  (req, res) => {
    console.log("4) After my groups are gotten");
    res.status(200).json(res.locals.myGroups);
  }
);

// Joining group:
router.post("/joinGroup", userController.joinGroup, (req, res) => {
  console.log("joined the group");
  res.status(200).json("joined the group");
});

// quit group;
router.post("/quitGroup", userController.quitGroup, (req, res) => {
  console.log("quit the qroup");
  res.status(200).json("quit the group");
});

// Private Route to create groups
// 1) GET to mygroups/create so that the user can access the group creation form on the frontend
// 2) Check if the user has the JWT token stored in the cookie on the frontend -> if yes, verify it along with the JWT secret
// 3) Ultimately allowing the user to access the group creation form to make further post request,
//    at api/group/create which can be referenced in the groupRoutes.js
router.get("/create", userController.verifyToken, (req, res) => {
  //   console.log(req.user);
  res.status(200).json({ success: "yes" });
});

// Remain login when refreshing the page
// 1) get to /protectedRoute
// 2) check the token whether expired or logged out already
router.get("/protectedRoute", userController.verifyToken, (req, res) => {
  res.status(200).json({ success: "yes", user: req.user });
});

// Logout
// 1) Delete to /logout when user is logging on while the logout onClick
// 2) delete the token send back to client
router.delete("/logout", userController.deleteToken, (req, res) => {
  res.status(200).json({ logout: true });
});

module.exports = router;
