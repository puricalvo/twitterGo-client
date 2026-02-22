import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom"; // 👈 usar useParams
import { toast } from "react-toastify";
import useAuth from "../../hooks/userAuth";
import BasicLayout from "../../layout/BasicLayout";
import BannerAvatar from "../../components/user/BannerAvatar";
import InfoUser from "../../components/user/InfoUser";
import ListTweets from "../../components/ListTweets";
import { getUserApi } from "../../api/user";
import { getUserTweetsApi } from "../../api/tweet";

import "./User.scss";

export default function User(props) {
  const { setRefreshCheckLogin } = props;
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const loggedUser = useAuth();
  const [reloadTweets, setReloadTweets] = useState(false);

  useEffect(() => {
    setUser(null);
    getUserApi(id)
      .then((response) => {
        if (!response) toast.error("El usuario que has visitado no existe");
        setUser(response);
      })
      .catch(() => {
        toast.error("El usuario que has visitado no existe");
      });
  }, [id]);

  // Solo obtener tweets si user ya se cargó
  useEffect(() => {
    getUserTweetsApi(id, 1).then((response) => {
      setTweets(response);
      setReloadTweets(false); // Importante: lo volvemos a poner en false
    });
  }, [id, reloadTweets]);
  const moreData = () => {
    const pageTemp = page + 1;
    setLoadingTweets(true);

    getUserTweetsApi(id, pageTemp).then((response) => {
      if (!response) {
        setLoadingTweets(0);
      } else {
        setTweets([...tweets, ...response]);
        setPage(pageTemp);
        setLoadingTweets(false);
      }
    });
  };

  const refreshUser = () => {
    getUserApi(id)
      .then((response) => {
        if (response) {
          setUser(response);
        }
      })
      .catch(() => {
        toast.error("Error al refrescar usuario");
      });
  };

  return (
    <BasicLayout className="user" setRefreshCheckLogin={setRefreshCheckLogin}>
      <div className="user__title">
        <h2>
          {user ? `${user.nombre} ${user.apellidos}` : "Este usuario no existe"}
        </h2>
      </div>
      <BannerAvatar
        user={user}
        loggedUser={loggedUser}
        refreshUser={refreshUser}
      />
      <InfoUser user={user} />
      <div className="user__tweets">
        <h3>Tweets</h3>
        {tweets && (
          <ListTweets tweets={tweets} setReloadTweets={setReloadTweets} />
        )}
        <Button onClick={moreData}>
          {!loadingTweets ? (
            loadingTweets !== 0 && "Obtener más Tweets"
          ) : (
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </div>
    </BasicLayout>
  );
}
