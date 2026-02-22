import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { map } from "lodash";
import moment from "moment";
import AvatarNoFound from "../../assets/png/avatar-no-found.png";
import { S3_URL } from "../../utils/constant";
import { replaceURLWithHTMLLinks } from "../../utils/functions";
import { getUserApi } from "../../api/user";
import { deleteTweetApi } from "../../api/tweet";
import userAuth from "../../hooks/userAuth";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

import "./ListTweets.scss";

export default function ListTweets(props) {
  const { tweets, setReloadTweets } = props;
  return (
    <div className="list-tweets">
      {map(tweets, (tweet, index) => (
        <Tweet key={index} tweet={tweet} setReloadTweets={setReloadTweets} />
      ))}
    </div>
  );
}

function Tweet(props) {
  const { tweet, setReloadTweets } = props;
  const [userInfo, setUserInfo] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const loggedUser = userAuth();

  const deleteTweet = () => {
    deleteTweetApi(tweet._id).then((response) => {
      if (response?.code === 200) {
        toast.success("Tweet eliminado", {
          theme: "colored",
        });
        setReloadTweets(true);
      } else {
        toast.error("Error al eliminar el tweet", {
          theme: "colored",
        });
      }
    });
  };

  const version = new Date().getTime();

  useEffect(() => {
    getUserApi(tweet.userid).then((response) => {
      if (response) {
        setUserInfo(response);
        setAvatarUrl(
          response?.avatar
            ? `${S3_URL}${response.avatar}?v=${version}`
            : AvatarNoFound,
        );
      }
    });
  }, [tweet]);

  return (
    <div className="tweet">
      <Image className="avatar" src={avatarUrl} roundedCircle />
      <div className="tweet-content">
        <div className="name">
          {userInfo?.nombre} {userInfo?.apellidos}
          <span className="fecha">{moment(tweet.fecha).calendar()}</span>
          {loggedUser?._id === tweet.userid && (
            <Button variant="link" className="btn-delete" onClick={deleteTweet}>
              Eliminar
            </Button>
          )}
        </div>
        <div
          className="mensaje"
          dangerouslySetInnerHTML={{
            __html: replaceURLWithHTMLLinks(tweet.mensaje),
          }}
        />
      </div>
    </div>
  );
}
