const createCirculumReducer = (state, action) => {
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

const getCirculumReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "DELETE_REQUEST":
      return { ...state, deleteLoading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        circulum: action.payload.circulum,
        circulumCount: action.payload.circulumCount,
        filteredCirculumCount: action.payload.filteredCirculumCount,
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

const viewCirculumReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, circulum: action.payload.circulum };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const createCirculumSectionReducer = (state, action) => {
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

const addCirculumLessonReducer = (state, action) => {
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

const updateCirculumLessonReducer = (state, action) => {
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

const deleteCirculumLessonReducer = (state, action) => {
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

const deleteCirculumSectionReducer = (state, action) => {
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

const deleteCirculumReducer = (state, action) => {
  switch (action.type) {
    case "DELETE_CIRCULUM_REQUEST":
      return { ...state, loading: true };
    case "DELETE_CIRCULUM_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "DELETE_CIRCULUM_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export {
  getCirculumReducer,
  createCirculumReducer,
  viewCirculumReducer,
  createCirculumSectionReducer,
  addCirculumLessonReducer,
  updateCirculumLessonReducer,
  deleteCirculumLessonReducer,
  deleteCirculumSectionReducer,
  deleteCirculumReducer,
};
