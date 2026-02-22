import { useState } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { values, size } from "lodash";
import { toast } from "react-toastify";
import { isEmailValid } from "../../utils/validations";
import { signUpApi } from "../../api/auth";

import "./SignUpForm.scss";

export default function SignUpForm(props) {
  console.log(props);
  const { setShowModal } = props;
  const [formData, setFormData] = useState(initialFormValue());
  const [signUpLoading, setSignUpLoading] = useState(false);

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
      } else if (formData.password !== formData.repeatPassword) {
        toast.warning("Las contraseñas no son iguales", {
          theme: "colored",
        });
      } else if (size(formData.password) < 6) {
        toast.warning("La contraseña debe tener al menos 6 caracteres", {
          theme: "colored",
        });
      } else {
        setSignUpLoading(true);
        toast.success("¡Registro correcto!", {
          theme: "colored",
        });
        signUpApi(formData)
          .then((response) => {
            if (response?.code) {
              toast.warning(response.message, {
                theme: "colored",
              });
            } else {
              setShowModal(false);
              setFormData(initialFormValue());
            }
          })
          .catch(() => {
            toast.error("Error del servidor, inténtelo más tarde!", {
              theme: "colored",
            });
          })
          .finally(() => {
            setSignUpLoading(false);
          });
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="sing-up-form">
      <h2>Crea tu cuenta</h2>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Group className="mb-4">
          <Row>
            <Col>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Nombre"
                defaultValue={formData.nombre}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="apellidos"
                placeholder="Apellidos"
                defaultValue={formData.apellidos}
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            type="email"
            name="email"
            placeholder="Correo electrónico"
            defaultValue={formData.email}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Row>
            <Col>
              <Form.Control
                type="password"
                name="password"
                placeholder="Contraseña"
                defaultValue={formData.password}
              />
            </Col>
            <Col>
              <Form.Control
                type="password"
                name="repeatPassword"
                placeholder="Repetir Contraseña"
                defaultValue={formData.repeatPassword}
              />
            </Col>
          </Row>
        </Form.Group>
        <Button variant="primary" type="submit">
          {!signUpLoading ? "Registrarse" : <Spinner animation="border" />}
        </Button>
      </Form>
    </div>
  );
}

function initialFormValue() {
  return {
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    repeatPassword: "",
  };
}
