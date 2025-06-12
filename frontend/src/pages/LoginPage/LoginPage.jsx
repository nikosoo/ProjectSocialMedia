import { useState } from "react";
import { Formik } from "formik";
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
        const response = await fetch(
          "https://project-social-media-backend.vercel.app/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

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
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === "picture") {
            formData.append("picture", values.picture);
            formData.append("picturePath", values.picture.name);
          } else {
            formData.append(key, values[key]);
          }
        });

        const response = await fetch(
          "https://project-social-media-backend.vercel.app/auth/register",
          {
            method: "POST",
            body: formData,
          }
        );

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome to Connectify</h1>
        <p className="text-xl text-white mt-2">
          Connect with people and share your experiences.
        </p>
      </div>
      <div
        className={`w-full ${
          pageType === "login" ? "max-w-md" : "max-w-3xl"
        } p-10 bg-white rounded-lg shadow-lg space-y-6 animate__animated animate__fadeIn`}
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          {pageType === "login" ? "Login" : "Register"}
        </h2>

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
            <form
              onSubmit={handleSubmit}
              className={`${
                pageType === "register" ? "w-full max-w-3xl" : "w-full max-w-md"
              } space-y-6`}
            >
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                        <div
                          {...getRootProps()}
                          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p className="text-gray-500">Add Picture Here</p>
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500">{errors.password}</div>
                )}
              </div>

              <div className="form-buttons flex flex-col items-center space-y-4">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {pageType === "login" ? "LOGIN" : "REGISTER"}
                </button>
                <p
                  onClick={() => {
                    setPageType(pageType === "login" ? "register" : "login");
                    resetForm();
                  }}
                  className="text-sm text-gray-600 cursor-pointer hover:text-purple-700 transition duration-300 ease-in-out"
                >
                  {pageType === "login"
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Form;
