import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, InputGroup } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";
import { getCategoryReducer } from "../../reducers/course";

export default function EditCourseModal(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ categories }, dispatch1] = useReducer(getCategoryReducer, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [class_type, setClass_type] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("");
  const [price, setPrice] = useState("");
  const [creater_name, setCreater_name] = useState("");
  const [creater_title, setCreater_title] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setClass_type("");
    setPrice("");
    setCreater_name("");
    setCreater_title("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/getcourse/${id}`, {
          headers: { Authorization: token },
        });

        const course = data.course;

        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setClass_type(course.class_type);
        setPrice(course.price);
        setCreater_name(course.createdBy.name);
        setCreater_title(course.createdBy.title);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, props.show, token, error]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch1({ type: "FETCH_CATEGORY_REQUEST" });
      try {
        const res = await axiosInstance.get(`/api/admin/all-categories`, {
          headers: { Authorization: token },
        });

        dispatch1({ type: "FETCH_CATEGORY_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch1({
          type: "FETCH_CATEGORY_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.put(
        `/api/admin/getcourse/${id}`,
        {
          title,
          description,
          category,
          class_type,
          price,
          creater_name,
          creater_title,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (data.message) {
        toast.success("Course Updated Succesfully. Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate(`/admin/courses`);
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      dispatch({
        type: "UPDATE_FAIL",
        payload: getError(err),
      });
      toast.error(getError(error), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const classes = [
    "LKG",
    "UKG",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;

    const classIndex = class_type.indexOf(selectedClass);

    if (classIndex !== -1) {
      const updatedClasses = [...class_type];
      updatedClasses[classIndex] = selectedClass;

      setClass_type(updatedClasses);
    } else {
      setClass_type([...class_type, selectedClass]);
    }
    setSelectedClasses("");
  };

  const handleRemoveClass = (selectedClass) => {
    const updatedClasses = class_type.filter((cls) => cls !== selectedClass);
    setClass_type(updatedClasses);
  };

  const availableClasses = classes.filter((cls) => !class_type?.includes(cls));

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Course
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <InputGroup>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Default select example"
                  required
                >
                  <option value="">Select Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  {categories?.length === 0 && (
                    <option value="">No Category Found</option>
                  )}
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="class">
              <Form.Label>Add Class</Form.Label>
              <InputGroup>
                <Form.Select
                  value={selectedClasses}
                  onChange={handleClassChange}
                  aria-label="Default select example"
                >
                  <option value="">Select Class(s)</option>
                  {availableClasses.map((availableClass) => (
                    <option key={availableClass} value={availableClass}>
                      {availableClass}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Form.Group
              style={{
                border: "1px solid rgba(0, 0, 0, 0.175)",
                borderRadius: "5px",
              }}
              className="mb-3"
              controlId="class"
            >
              <div>
                {class_type?.length > 0 ? (
                  class_type.map((cls) => (
                    <Button
                      variant="outline-primary"
                      key={cls}
                      className="m-1"
                      onClick={() => handleRemoveClass(cls)}
                    >
                      {cls} <span>&times;</span>
                    </Button>
                  ))
                ) : (
                  <b>No Class(s) are Selected</b>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Creator Name</Form.Label>
              <Form.Control
                value={creater_name}
                onChange={(e) => setCreater_name(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="creator_title">
              <Form.Label>Creator Title</Form.Label>
              <Form.Control
                value={creater_title}
                onChange={(e) => setCreater_title(e.target.value)}
                required
              />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loadingUpdate ? true : false}
          >
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
