import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { S3_URL } from "../../utils/constant";

import AvatarNoFound from "../../assets/png/avatar-no-found.png";

export default function User(props) {
  const { user } = props;

  return (
    <div className="list-users__user">
      <Link to={`/${user.id}`}>
        <Image
          width={64}
          height={64}
          roundedCircle
          className="me-3"
          src={user?.avatar ? `${S3_URL}${user.avatar}` : AvatarNoFound}
          alt={`${user.nombre} ${user.apellidos}`}
        />
      </Link>

      <span>
        <h5>
          {user.nombre} {user.apellidos}
        </h5>
        <p>{user?.biografia || "Sin biografía disponible"}</p>
      </span>
    </div>
  );
}
