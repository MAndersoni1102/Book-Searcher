// Replace the loginUser() functionality imported from the API file with the LOGIN_USER mutation functionality.
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
// Import the useMutation hook from the @apollo/client React hook.
import { useMutation } from "@apollo/client";
// Import the LOGIN_USER mutation.
import { LOGIN_USER } from "../utils/mutations";
// Import the Auth service.
import Auth from "../utils/auth";
// Define the LoginForm functional component.
const LoginForm = () => {
  // Define the userFormData and setUserFormData states using the useState hook.
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // Define the loginUser mutation.
  const [loginUser] = useMutation(LOGIN_USER);
  const handleInputChange = (event) => {
    // Destructure the name and value properties from the event.target object.
    const { name, value } = event.target;
    // Update the userFormData state using the setUserFormData function.
    setUserFormData({ ...userFormData, [name]: value });
  };
  // Define the handleFormSubmit function with the event parameter.
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });
      // Console.log(data)
      // Use the Auth.login() method to log the user in with the token received from the mutation response.
      const token = data.login.token;
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;