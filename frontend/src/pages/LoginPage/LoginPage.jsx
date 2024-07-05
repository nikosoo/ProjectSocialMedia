import { useState } from "react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.mixed().required("Picture is required"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: null,
  };

  const initialValuesLogin = {
    email: "",
    password: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      if (pageType === "login") {
        // Handle login form submission
        const response = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const loggedIn = await response.json();

        if (loggedIn) {
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            })
          );
          onSubmitProps.resetForm();
          navigate("/home");
        }
      }

      if (pageType === "register") {
        // Handle registration form submission
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === "picture") {
            formData.append("picture", values.picture);
            formData.append("picturePath", values.picture.name);
          } else {
            formData.append(key, values[key]);
          }
        });

        const response = await fetch("http://localhost:3001/auth/register", {
          method: "POST",
          body: formData,
        });

        const savedUser = await response.json();

        if (savedUser) {
          onSubmitProps.resetForm();
          setPageType("login");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Formik
      initialValues={
        pageType === "login" ? initialValuesLogin : initialValuesRegister
      }
      validationSchema={pageType === "login" ? loginSchema : registerSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit} className="form-container space-y-4">
          {/* Conditional fields for registration */}
          {pageType === "register" && (
            <>
              <div className="form-field">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {touched.firstName && errors.firstName && (
                  <div className="text-red-500">{errors.firstName}</div>
                )}
              </div>
              <div className="form-field">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {touched.lastName && errors.lastName && (
                  <div className="text-red-500">{errors.lastName}</div>
                )}
              </div>
              <div className="form-field">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {touched.location && errors.location && (
                  <div className="text-red-500">{errors.location}</div>
                )}
              </div>
              <div className="form-field">
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.occupation}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {touched.occupation && errors.occupation && (
                  <div className="text-red-500">{errors.occupation}</div>
                )}
              </div>
              <div className="form-field">
                <label
                  htmlFor="picture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Picture
                </label>
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) =>
                    setFieldValue("picture", acceptedFiles[0])
                  }
                  className="dropzone"
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="dropzone-inner">
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <p>Add Picture Here</p>
                      ) : (
                        <div className="picture-preview">
                          <p>{values.picture.name}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
                {touched.picture && errors.picture && (
                  <div className="text-red-500">{errors.picture}</div>
                )}
              </div>
            </>
          )}

          {/* Common fields for both login and registration */}
          <div className="form-field">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {touched.email && errors.email && (
              <div className="text-red-500">{errors.email}</div>
            )}
          </div>
          <div className="form-field">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {touched.password && errors.password && (
              <div className="text-red-500">{errors.password}</div>
            )}
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {pageType === "login" ? "LOGIN" : "REGISTER"}
            </button>
            <p
              onClick={() => {
                setPageType(pageType === "login" ? "register" : "login");
                resetForm();
              }}
              className="toggle-link text-sm text-gray-600 cursor-pointer"
            >
              {pageType === "login"
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </p>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Form;
