/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
import "./SideNavBar.css";
import { MdOutlineReviews, MdOutlineSpaceDashboard } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { BiSolidBook } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";
import { GrTransaction, GrWorkshop } from "react-icons/gr";
import { BsImages } from "react-icons/bs";

const linkList = [
  {
    icon: <MdOutlineSpaceDashboard className="icon-md" />,
    text: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    icon: <BiSolidBook className="icon-md" />,
    text: "Courses",
    url: "/admin/courses",
  },
  { icon: <HiUsers className="icon-md" />, text: "Users", url: "/admin/users" },
  {
    icon: <GrWorkshop className="icon-md" />,
    text: "Workshops",
    url: "/admin/workshops",
  },
  {
    icon: <MdOutlineReviews className="icon-md" />,
    text: "Testimonials",
    url: "/admin/testimonials",
  },
  {
    icon: <GrTransaction className="icon-md" />,
    text: "Transactions",
    url: "/admin/transactions",
  },
  {
    icon: <BsImages className="icon-md" />,
    text: "Images",
    url: "/admin/images",
  },
];

const active_text = {
  Dashboard: "dashboard",
  Courses: "course",
  Users: "user",
  Workshops: "workshop",
  Testimonials: "testimonial",
  Transactions: "transaction",
  Images: "image",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.pathname;
  const [activeLink, setActiveLink] = useState("Dashboard");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const activeLinkHandler = (text) => {
    return pathname.includes(active_text[text]);
  };

  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="brand-link">
            {/* <img src={edwin_logo} alt="" width={"50px"} height="auto" /> */}
            <span className="brand-text ms-2 font-weight-light">
              Karmill Financial Literacy
            </span>
          </div>

          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <Link to="/view-profile" className="d-block">
                  {userInfo.avatar?.url && (
                    <img
                      src={userInfo.avatar?.url}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  <span className="info-text">
                    Welcome{" "}
                    {userInfo
                      ? `${userInfo.firstname} ${userInfo.lastname}`
                      : "Back"}
                  </span>
                </Link>
              </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {linkList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    } ${activeLinkHandler(text) && "active-item"}`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}
                <li
                  className={`nav-item has-treeview ${
                    isExpanded ? "menu-item" : "menu-item menu-item-NX"
                  }`}
                >
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
