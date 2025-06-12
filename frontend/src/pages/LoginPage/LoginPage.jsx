import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
  };

  const initialValuesLogin = {
    email: "",
    password: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      setLoginError("");
      setRegistrationError("");

      if (pageType === "login") {
        const response = await fetch("https://project-social-media-backend.vercel.app/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setLoginError(errorData.message || "Invalid email or password");
          return;
        }

        const loggedIn = await response.json();
        if (loggedIn.token && loggedIn.user) {
          dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
          onSubmitProps.resetForm();
          navigate("/home");
        } else {
          setLoginError("Invalid email or password");
        }
      }

      if (pageType === "register") {
        const response = await fetch("https://project-social-media-backend.vercel.app/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message?.toLowerCase().includes("email")) {
            setRegistrationError(errorData.message);
          } else {
            setRegistrationError("Registration failed. Please try again.");
          }
          return;
        }

        const savedUser = await response.json();
        if (savedUser) {
          onSubmitProps.resetForm();
          setPageType("login");
        }
      }
    } catch (err) {
      console.error(err);
      if (pageType === "login") setLoginError("Something went wrong. Please try again.");
      if (pageType === "register") setRegistrationError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome to Connectify</h1>
        <p className="text-xl text-white mt-2">Connect with people and share your experiences.</p>
      </div>

      <div className={`w-full ${pageType === "login" ? "max-w-md" : "max-w-3xl"} p-10 bg-white rounded-lg shadow-lg space-y-6`}>
        <h2 className="text-2xl font-bold text-center text-purple-700">
          {pageType === "login" ? "Login" : "Register"}
        </h2>

        <Formik
          initialValues={pageType === "login" ? initialValuesLogin : initialValuesRegister}
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
            resetForm,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {pageType === "register" && (
                <>
                  <div className="form-field">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      className="input-field"
                    />
                    {touched.firstName && errors.firstName && <div className="text-red-500">{errors.firstName}</div>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      className="input-field"
                    />
                    {touched.lastName && errors.lastName && <div className="text-red-500">{errors.lastName}</div>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.location}
                      className="input-field"
                    />
                    {touched.location && errors.location && <div className="text-red-500">{errors.location}</div>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.occupation}
                      className="input-field"
                    />
                    {touched.occupation && errors.occupation && <div className="text-red-500">{errors.occupation}</div>}
                  </div>
                </>
              )}

              <div className="form-field">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="input-field"
                />
                {touched.email && errors.email && <div className="text-red-500">{errors.email}</div>}
              </div>

              <div className="form-field">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="input-field"
                />
                {touched.password && errors.password && <div className="text-red-500">{errors.password}</div>}
              </div>

              {/* Error display */}
              {pageType === "register" && registrationError && (
                <div className="text-center text-red-600 font-semibold">{registrationError}</div>
              )}
              {pageType === "login" && loginError && (
                <div className="text-center text-red-600 font-semibold">{loginError}</div>
              )}

              <div className="form-buttons flex flex-col items-center space-y-4">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {pageType === "register" ? "REGISTER" : "LOGIN"}
                </button>

                <p
                  onClick={() => {
                    setPageType(pageType === "login" ? "register" : "login");
                    resetForm();
                    setLoginError("");
                    setRegistrationError("");
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
