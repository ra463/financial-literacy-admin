import { Store } from "./Store";
import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import ViewProfile from "./components/profile/ViewProfile";

import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";

import AdminLoginScreen from "./components/AdminLoginScreen";
import UnprotectedRoute from "./components/protectedRoute/UnprotectedRoute";
import Courses from "./components/courses/Course";
import ViewCourse from "./components/courses/ViewCourse";
import ViewSection from "./components/courses/ViewSection";
import Workshop from "./components/workshops/Workshop";
import Viewworkshop from "./components/workshops/Viewworkshop";
import Transaction from "./components/transaction/Transaction";
import ViewTransaction from "./components/transaction/ViewTransaction";
import Testimonial from "./components/testimonial/Testimonial";
import ViewTestimonial from "./components/testimonial/ViewTestimonial";
import Images from "./components/addImages/Images";
import Dashboard from "./components/layout/Dashboard";

function App() {
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/view-profile", element: <ViewProfile /> },
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/admin/users", element: <Users /> },
    { path: "/admin/courses", element: <Courses /> },
    { path: "/admin/workshops", element: <Workshop /> },
    { path: "/admin/transactions", element: <Transaction /> },
    { path: "/admin/testimonials", element: <Testimonial /> },
    { path: "/admin/images", element: <Images /> },
    { path: "/admin/view/course/:id", element: <ViewCourse /> },
    { path: "/admin/view/user/:id", element: <ViewUser /> },
    { path: "/admin/view/course/:id/:sectionId", element: <ViewSection /> },
    { path: "/admin/view/workshop/:id", element: <Viewworkshop /> },
    { path: "/admin/view/transaction/:id", element: <ViewTransaction /> },
    { path: "/admin/view/testimonial/:id", element: <ViewTestimonial /> },
  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        {userInfo?.role === "admin" && <SideNavbar isExpanded={isExpanded} />}
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"} ${
          token ? "" : "m-0"
        } d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />
          {routeList.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{element}</AdminProtectedRoute>}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
