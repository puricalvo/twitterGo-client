import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { values, size } from "lodash";
import { toast } from "react-toastify";
import { isEmailValid } from "../../utils/validations";
import { signInApi, setTokenApi } from "../../api/auth";

import "./SignInForm.scss";

export default function SignInForm(props) {
  const { setRefreshCheckLogin } = props;
  const [formData, setFormData] = useState(initialFormValue());
  const [signInLoading, setSignInLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    let validCount = 0;
    values(formData).some((value) => {
      value && validCount++;
      return null;
    });

    if (validCount !== size(formData)) {
      toast.warning("Completa todos los campos del formulario", {
        theme: "colored",
      });
    } else {
      if (!isEmailValid(formData.email)) {
        toast.warning("El email no es válido", {
          theme: "colored",
        });
      } else {
        setSignInLoading(true);
        signInApi(formData)
          .then((response) => {
            if (response.message) {
              toast.warning(response.message, {
                theme: "colored",
              });
            } else {
              setTokenApi(response.token);
              setRefreshCheckLogin(true);
            }
          })
          .catch(() => {
            toast.error("Error del servidor, inténtelo más tarde!", {
              theme: "colored",
            });
          })
          .finally(() => {
            setSignInLoading(false);
          });
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="sign-in-form">
      <h2>Entrar</h2>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Group className="mb-4">
          <Form.Control
            type="email"
            name="email"
            placeholder="Correo electrónico"
            defaultValue={formData.email}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            type="password"
            name="password"
            placeholder="Contraseña"
            defaultValue={formData.password}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {!signInLoading ? "Iniciar sesión" : <Spinner animation="border" />}
        </Button>
      </Form>
    </div>
  );
}

function initialFormValue() {
  return {
    email: "",
    password: "",
  };
}
