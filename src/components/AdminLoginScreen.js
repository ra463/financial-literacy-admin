import React, { useReducer, useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils/error";
import { editReducer as reducer } from "../reducers/commonReducer";
import axiosInstance from "../utils/axiosUtil";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function AdminLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch: ctxDispatch } = useContext(Store);

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axiosInstance.post("/api/admin/login", {
        email: username,
        password: password,
      });

      // console.log("data", data);
      if (data.token) {
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.token));

        // navigate("/admin/dashboard");
        dispatch({ type: "FETCH_SUCCESS" });
      } else {
        toast.error(data, { position: toast.POSITION.BOTTOM_CENTER });
      }
    } catch (err) {
      // console.log("err", err.response);
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err),
      });
      toast.error(getError(err), { position: toast.POSITION.BOTTOM_CENTER });
    }
  };

  return (
    <Container fluid className="p-0 vh-100 f-center flex-column login-page">
      <div className="login-logo">
        <Link to="/" className="text-center">
          <b>Karmill Financial Literacy</b>
        </Link>
      </div>

      <div className="link-center">
        <Link to="/" className="toggle-link-item active-link">
          Admin
        </Link>
      </div>

      <Card className="login-box">
        <Card.Body>
          <p className="text-center">Sign in to start your session</p>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="text" className="input-group mb-3">
              <Form.Control
                placeholder="Username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
            </Form.Group>
            <Form.Group controlId="password" className="input-group mb-3">
              <Form.Control
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
            </Form.Group>
            <Row>
              <Col sm={7} className="mb-sm-0 mb-3">
                <Form.Group controlId="remember">
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Remember Me"
                  />
                </Form.Group>
              </Col>
              <Col sm={5}>
                {loading ? (
                  <Button disabled className="float-sm-end">
                    <Spinner animation="border" size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" className="float-sm-end">
                    Sign In
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
          <ToastContainer />
        </Card.Body>
      </Card>
    </Container>
  );
}
