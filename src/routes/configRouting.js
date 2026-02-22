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
    path: "/:id",
    exact: true,
    page: User,
  },
  {
    path: "/",
    exact: true,
    page: Home,
  },

  {
    path: "*",
    page: Error404,
  },
];
