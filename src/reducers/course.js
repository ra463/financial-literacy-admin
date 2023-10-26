const createCourseReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const getCoursesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "DELETE_REQUEST":
      return { ...state, deleteLoading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        courses: action.payload.courses,
        coursesCount: action.payload.coursesCount,
        filteredCourseCount: action.payload.filteredCourseCount,
      };
    case "DELETE_SUCCESS":
      return { ...state, deleteLoading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_FAIL":
      return { ...state, deleteLoading: false, deleteError: action.payload };
    default:
      return state;
  }
};

const viewCourseReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, course: action.payload.course };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const createSectionReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const addCategoryReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CATEGORY_REQUEST":
      return { ...state, loading: true };
    case "ADD_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "ADD_CATEGORY_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const getCategoryReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CATEGORY_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: action.payload.categories,
      };
    case "FETCH_CATEGORY_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const deleteCategoryReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_CATEGORY_REQUEST":
      return { ...state, loading: true };
    case "DELETE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "DELETE_CATEGORY_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const addLessonsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_REQUEST":
      return { ...state, loading: true };
    case "ADD_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "ADD_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const updateLessonReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "UPDATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const deleteLessonReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_REQUEST":
      return { ...state, loading: true };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "DELETE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const deleteSectionReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_SECTION_REQUEST":
      return { ...state, loading: true };
    case "DELETE_SECTION_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "DELETE_SECTION_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const deleteCourseReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_COURSE_REQUEST":
      return { ...state, loading: true };
    case "DELETE_COURSE_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "DELETE_COURSE_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export {
  createCourseReducer,
  getCategoryReducer,
  getCoursesReducer,
  viewCourseReducer,
  addLessonsReducer,
  addCategoryReducer,
  deleteCategoryReducer,
  updateLessonReducer,
  deleteLessonReducer,
  deleteSectionReducer,
  deleteCourseReducer,
  createSectionReducer,
};
