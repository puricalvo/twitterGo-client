import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ConfigModal from "../../Modal/ConfigModal";
import EditUserForm from "../../user/EditUserForm";
import AvatarNoFound from "../../../assets/png/avatar-no-found.png";
import { S3_URL } from "../../../utils/constant";
import {
  checkFollowApi,
  followUserApi,
  unfollowUserApi,
} from "../../../api/follow";

import "./BannerAvatar.scss";

export default function BannerAvatar(props) {
  const { user, loggedUser, refreshUser } = props;
  const [showModal, setShowModal] = useState(false);
  const [following, setFollowing] = useState(null);

  const version = new Date().getTime();
  //const [reloadFollow, setReloadFollow] = useState(false);

  const bannerUrl = user?.banner
    ? `${S3_URL}${user.banner}?v=${version}`
    : null;

  const avatarUrl = user?.avatar
    ? `${S3_URL}${user.avatar}?v=${version}`
    : AvatarNoFound;

  const userId = user?.id;
  const loggedUserId = loggedUser?._id;

  // Efecto para CARGAR el estado inicial al entrar al perfil
  useEffect(() => {
    if (userId && loggedUserId && userId !== loggedUserId) {
      checkFollowApi(userId).then((response) => {
        // response es directamente true o false
        setFollowing(response);
      });
    }
    //setReloadFollow(false);
  }, [userId, loggedUserId]); // Solo cuando cambia el usuario o nos logueamos

  const onFollow = () => {
    followUserApi(userId).then(() => {
      // CAMBIO INMEDIATO: No esperes al useEffect
      setFollowing(true);
      //setReloadFollow(true);
      // Si tienes una función para refrescar contadores de seguidores en el padre:
      if (refreshUser) refreshUser();
    });
  };

  const onUnfollow = () => {
    unfollowUserApi(userId).then(() => {
      // CAMBIO INMEDIATO
      setFollowing(false);
      //setReloadFollow(true);
      if (refreshUser) refreshUser();
    });
  };

  return (
    <div
      className="banner-avatar"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    >
      <div
        className="avatar"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      />

      <div className="options">
        {/* Caso: Es mi perfil */}
        {loggedUserId === userId && (
          <Button onClick={() => setShowModal(true)}>Editar perfil</Button>
        )}

        {/* Caso: Es perfil de otro y ya sabemos si lo seguimos o no */}
        {loggedUserId !== userId &&
          (following ? (
            <Button onClick={onUnfollow} className="unfollow">
              <span>Siguiendo</span>
            </Button>
          ) : (
            <Button onClick={onFollow}>Seguir</Button>
          ))}
      </div>

      <ConfigModal
        show={showModal}
        setShow={setShowModal}
        title="Editar perfil"
      >
        <EditUserForm
          user={user}
          setShowModal={setShowModal}
          refreshUser={refreshUser}
        />
      </ConfigModal>
    </div>
  );
}
