import React, { useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Dropdown,
  ListGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import { Store } from "../../Store";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  notificationReducer,
  notificationUpdateReducer,
} from "../../reducers/notification";
import axios from "../../utils/axiosUtil";
import { getError } from "../../utils/error";
import { MdNotifications } from "react-icons/md";
import Skeleton from "react-loading-skeleton";

export default function Header({ sidebarHandler }) {
  const [{ loading, notifications }, dispatch] = useReducer(
    notificationReducer,
    {
      loading: true,
      error: "",
    }
  );

  const [dispatchx] = useReducer(notificationUpdateReducer, {
    loadingUpdate: true,
    error: "",
  });

  const [notificationCard, showNotificationCard] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, token } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const fetchNotification = async () => {
    // if(cart)return;
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get("/api/intermediary/get-notification", {
        headers: {
          Authorization: token,
        },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      // console.log(`error in fetching the notification ${getError(error)}`);
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(error),
      });
      toast.error(getError(error), {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  const markAsRead = async (itemId) => {
    dispatchx({ type: "UPDATE_REQUEST" });
    try {
      const { data } = await axios.put(
        `/api/intermediary/mark-read/${itemId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (data) {
        dispatchx({ type: "UPDATE_SUCCESS" });
        //  fetch all the notification
        await fetchNotification();
      }
    } catch (error) {
      dispatchx({ type: "UPDATE_FAIL" });
      // console.log("error occured while marks the notifications", error);
      toast.error(getError(error), {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  return (
    <>
      {userInfo ? (
        <Navbar className="header">
          <Container fluid className="ps-0">
            <GiHamburgerMenu
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginLeft: "1.75rem",
                cursor: "pointer",
              }}
              onClick={() => sidebarHandler()}
            />

            <Nav className="ms-auto">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {userInfo?.role === "intermediary" && (
                  <div style={{ cursor: "pointer", position: "relative" }}>
                    <MdNotifications
                      size={30}
                      style={{ color: "white" }}
                      onClick={() => {
                        fetchNotification();
                        showNotificationCard(!notificationCard);
                      }}
                    />
                    {notificationCard && (
                      <Card className="notification-card">
                        <Card.Header>Notifications</Card.Header>
                        <ListGroup variant="flush">
                          {loading ? (
                            <div className="pankaj">
                              <Skeleton height={30} />
                              <Skeleton height={30} />
                              <Skeleton height={30} />
                              <Skeleton height={30} />
                            </div>
                          ) : (
                            <>
                              {notifications?.length === 0 ? (
                                <p
                                  style={{
                                    textAlign: "center",
                                    fontSize: "0.9rem",
                                    marginTop: "15px",
                                  }}
                                >
                                  You have no new notification.
                                </p>
                              ) : (
                                notifications[0]?.notification?.map(
                                  (item, index) => (
                                    <ListGroup.Item
                                      className="notification-list"
                                      key={index}
                                      style={
                                        item?.isRead
                                          ? { background: "#f3f3f3" }
                                          : { background: "#fff" }
                                      }
                                    >
                                      <div className="notification-message">
                                        {item?.isRead ? (
                                          <i style={{ opacity: 0.8 }}>
                                            {item?.message}
                                          </i>
                                        ) : (
                                          item?.message
                                        )}
                                      </div>
                                      {item?.isRead ? (
                                        ""
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "flex-end",
                                            width: "100%",
                                          }}
                                        >
                                          <Button
                                            variant="primary"
                                            size="sm"
                                            className="mark-read-btn"
                                            onClick={() => {
                                              markAsRead(item?._id);
                                            }}
                                          >
                                            Mark as read
                                          </Button>
                                        </div>
                                      )}
                                    </ListGroup.Item>
                                  )
                                )
                              )}
                            </>
                          )}
                        </ListGroup>
                      </Card>
                    )}
                  </div>
                )}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    id="user_profile"
                    className="right-profile-logo"
                  >
                    {/* <img
                    src={userInfo.profile_image}
                    alt="profile_img"
                    className="dropdown-logo"
                  /> */}
                    <FaUserCircle size={"25px"} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      Signed in as
                      <br />
                      <b>{`${userInfo.firstname} ${userInfo.lastname}`}</b>
                    </Dropdown.Header>

                    <Dropdown.Divider />
                    <Dropdown.Item>
                      <Link
                        to={
                          userInfo?.role === "intermediary"
                            ? "/intermediary/view-profile"
                            : "/view-profile"
                        }
                        className="dropdown-item"
                      >
                        {/* <Link to="/view-profile/" className="dropdown-item"> */}
                        <FaUser className="me-2" /> Profile
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        onClick={signoutHandler}
                        to="/"
                        className="nav-link"
                      >
                        <FaSignOutAlt className="icon-md me-2" /> Log Out
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <></>
      )}
    </>
  );
}
