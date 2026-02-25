import Home from "../page/Home/Home";
import User from "../page/User/User";
import Users from "../page/Users";
import Error404 from "../page/Error404/Error404";

export default [
  {
    path: "/users",
    exact: true,
    page: Users,
  },
  {
    path: "/",
    exact: true,
    page: Home,
  },
  {
    path: "/:id",
    exact: true,
    page: User,
  },

  {
    path: "*",
    page: Error404,
  },
];
