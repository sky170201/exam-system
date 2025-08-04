import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import UpdatePassword from "./pages/updatePassword";
import ExamList from "./pages/examList";
import "@ant-design/v5-patch-for-react-19";
import Edit from "./pages/edit";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const routes = [
  {
    path: "/",
    element: <ExamList />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  },
  {
    path: "edit/:id",
    element: <Edit />,
  },
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <DndProvider backend={HTML5Backend}>
    <RouterProvider router={router} />
  </DndProvider>
);
