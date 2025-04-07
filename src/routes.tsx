import { useRoutes } from "react-router-dom";
import {Home, CreateCourse, EditCourse, FillDetails, Generator} from "./pages/allPages";
import Layout from "./pages/Layout";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { 
          path: 'course', 
          children: [
            { path: "create", element: <CreateCourse /> },
            { path: "edit", element: <EditCourse /> }
          ]
        },
        { 
          path: "certificate", 
          children: [
            {
              path: 'fill-details',
              element: <FillDetails/>
            },
            {
              path: 'generate',
              element: <Generator/>
            }
          ]
        }
      ],
    },
]);

  return routes;
};

export default AppRoutes;
