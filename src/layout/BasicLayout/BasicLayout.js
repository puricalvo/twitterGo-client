import React, { useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouseChimney,
  faUser,
  faUsers,
  faPowerOff,
  faFeatherPointed,
} from "@fortawesome/free-solid-svg-icons";

import LeftMenu from "../../components/LeftMenu";
import TweetModal from "../../components/Modal/TweetModal"; // Importamos el modal
import { logoutApi } from "../../api/auth";
import useAuth from "../../hooks/userAuth";

import "./BasicLayout.scss";

export default function BasicLayout(props) {
  const { className, setRefreshCheckLogin, children } = props;
  const [showModal, setShowModal] = useState(false); // Estado del modal aquí
  const user = useAuth();

  const logout = () => {
    logoutApi();
    setRefreshCheckLogin(true);
    window.location.replace("");
  };

  return (
    <Container className={`basic-layout ${className}`}>
      <Row>
        <Col md={3} className="basic-layout__menu d-none d-md-block">
          {/* Pasamos showModal y setShowModal al LeftMenu */}
          <LeftMenu
            setRefreshCheckLogin={setRefreshCheckLogin}
            setShowModal={setShowModal}
          />
        </Col>

        <Col xs={12} md={9} className="basic-layout__content">
          <div className="mobile-nav-wrapper d-md-none">
            <Dropdown className="basic-layout__dropdown">
              <Dropdown.Toggle as="div" className="hamburger-icon">
                <FontAwesomeIcon icon={faBars} />
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark">
                <Dropdown.Item as={Link} to="/">
                  <FontAwesomeIcon icon={faHouseChimney} /> Inicio
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/users">
                  <FontAwesomeIcon icon={faUsers} /> Usuarios
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={`/${user?._id}`}>
                  <FontAwesomeIcon icon={faUser} /> Perfil
                </Dropdown.Item>

                {/* Opción de Twittear en el menú móvil */}
                <Dropdown.Item onClick={() => setShowModal(true)}>
                  <FontAwesomeIcon icon={faFeatherPointed} /> Twittear
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>
                  <FontAwesomeIcon icon={faPowerOff} /> Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {children}
        </Col>
      </Row>

      {/* El Modal vive aquí para que cualquiera pueda abrirlo */}
      <TweetModal show={showModal} setShow={setShowModal} />
    </Container>
  );
}
