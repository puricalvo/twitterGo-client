import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faUser,
  faUsers,
  faPowerOff,
  faPen,
  faFeatherPointed,
} from "@fortawesome/free-solid-svg-icons";
import TweetModal from "../Modal/TweetModal";
import { logoutApi } from "../../api/auth";
import useAuth from "../../hooks/userAuth";
import LogoWhite from "../../assets/png/logo-white.png";

import "./LeftMenu.scss";

export default function LeftMenu(props) {
  const { setRefreshCheckLogin } = props;
  const [showModal, setShowModal] = useState(false);
  const user = useAuth();

  const logout = () => {
    logoutApi();
    setRefreshCheckLogin(true);
    window.location.replace("");
  };

  return (
    <div className="left-menu">
      <img className="logo" src={LogoWhite} alt="Twittor" />

      <Link to="/">
        <FontAwesomeIcon icon={faHouseChimney} /> <span>Inicio</span>
      </Link>
      <Link to="/users">
        <FontAwesomeIcon icon={faUsers} /> <span>Usuarios</span>
      </Link>
      <Link to={`/${user?._id}`}>
        <FontAwesomeIcon icon={faUser} /> <span>Perfil</span>
      </Link>
      <Link to="" onClick={logout}>
        <FontAwesomeIcon icon={faPowerOff} /> <span>Cerrar sesión</span>
      </Link>

      <Button onClick={() => setShowModal(true)}>
        {/* Este span se ocultará en pantallas pequeñas */}
        <span className="text">Twittear</span>

        {/* Este icono solo aparecerá en pantallas pequeñas (puedes usar un + o un icono de pluma) */}
        <FontAwesomeIcon icon={faFeatherPointed} className="icon-mobile" />
      </Button>

      <TweetModal show={showModal} setShow={setShowModal} />
    </div>
  );
}
