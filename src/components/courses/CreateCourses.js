import React, { useReducer, useContext, useState, useEffect } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { createCourseReducer as reducer } from "../../reducers/course";
import { getCategoryReducer as getcategory } from "../../reducers/course";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, InputGroup } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";
import AddCategory from "./AddCategory";

export default function CreateCourseModel(props) {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const [{ categories }, dispatch1] = useReducer(getcategory, {
    loading: false,
    error: "",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [class_type, setClass_type] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("");
  const [creater_name, setCreater_name] = useState("");
  const [creater_title, setCreater_title] = useState("");
  const [addModalShow, setAddModalShow] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");
    setClass_type("");
    setCreater_name("");
    setCreater_title("");
  };

  const createCourseHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "CREATE_REQUEST" });

      const { data } = await axiosInstance.post(
        `/api/admin/create-course`,
        {
          title,
          description,
          category,
          price,
          class_type,
          creater_name,
          creater_title,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "CREATE_SUCCESS" });
        toast.success("Course Created Succesfully.", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        setTimeout(() => {
          props.onHide();
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

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
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [categories, token]);

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

    // Check if the class is not already selected
    if (!class_type.includes(selectedClass)) {
      setClass_type([...class_type, selectedClass]);
      setSelectedClasses("");
    }
  };

  const handleRemoveClass = (selectedClass) => {
    const updatedClasses = class_type.filter((cls) => cls !== selectedClass);
    setClass_type(updatedClasses);
  };

  const availableClasses = classes.filter((cls) => !class_type.includes(cls));

  return (
    <>
      {addModalShow === true ? (
        <AddCategory
          show={addModalShow}
          onHide={() => setAddModalShow(false)}
        />
      ) : (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Course
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={createCourseHandler}>
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
                    <Button onClick={() => setAddModalShow(true)}>Add</Button>
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
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cre_name">
                  <Form.Label>Creator Name</Form.Label>
                  <Form.Control
                    value={creater_name}
                    onChange={(e) => setCreater_name(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cre_title">
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
                disabled={loading ? true : false}
              >
                Submit
              </Button>
              {loading && <LoadingBox></LoadingBox>}
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
}
