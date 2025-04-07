import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const Layout = () => (
  <div>
    <Header />
    <main className="container">
      <Outlet />
    </main>
  </div>
);

export default Layout;
