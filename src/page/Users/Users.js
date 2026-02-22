import { useState, useEffect } from "react";
import { Spinner, ButtonGroup, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { isEmpty } from "lodash";
import { useDebouncedCallback } from "use-debounce";
import ListUsers from "../../components/ListUsers";
import BasicLayout from "../../layout/BasicLayout";
import { getFollowsApi } from "../../api/follow";

import "./Users.scss";

export default function Users(props) {
  const { setRefreshCheckLogin } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useUsersQuery(location);

  //console.log(location);
  //console.log(params);
  //console.log(queryString.stringify(params));

  const [users, setUsers] = useState(null); // null = cargando
  const [typeUser, setTypeUser] = useState(params.type || "follow");
  const [btnLoading, setBtnLoading] = useState(false);

  // Buscador con debounce
  const onSearch = useDebouncedCallback((value) => {
    setUsers(null); // reiniciamos estado mientras carga
    navigate({
      search: queryString.stringify({ ...params, search: value, page: 1 }),
    });
  }, 200);

  useEffect(() => {
    getFollowsApi(queryString.stringify(params))
      .then((response) => {
        if (params.page == 1) {
          if (isEmpty(response)) {
            setUsers([]);
          } else {
            setUsers(response);
          }
        } else {
          if (!response) {
            setBtnLoading(0);
          } else {
            setUsers([...users, ...response]);
            setBtnLoading(false);
          }
        }
      })
      .catch(() => {
        setUsers([]);
      });
  }, [location]);

  const onChangeType = (type) => {
    setUsers(null);
    if (type === "new") {
      setTypeUser("new");
    } else {
      setTypeUser("follow");
    }
    navigate({
      search: queryString.stringify({
        type: type,
        page: 1,
        search: "",
      }),
    });
  };

  const moreData = () => {
    setBtnLoading(true);
    const newPage = parseInt(params.page) + 1;
    navigate({
      search: queryString.stringify({ ...params, page: newPage }),
    });
  };

  return (
    <BasicLayout
      className="users"
      title="Usuarios"
      setRefreshCheckLogin={setRefreshCheckLogin}
    >
      <div className="users__title">
        <h2>Usuarios</h2>
        <input
          type="text"
          placeholder="Busca un usuario..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <ButtonGroup className="users__options">
        <Button
          className={typeUser === "follow" && "active"}
          onClick={() => onChangeType("follow")}
        >
          Siguiendo
        </Button>
        <Button
          className={typeUser === "new" && "active"}
          onClick={() => onChangeType("new")}
        >
          Nuevos
        </Button>
      </ButtonGroup>

      {!users ? (
        <div className="users__loading">
          <Spinner animation="border" variant="info" />
          Buscando usuarios
        </div>
      ) : (
        <>
          <ListUsers users={users} />
          <Button onClick={moreData} className="load-more">
            {!btnLoading ? (
              btnLoading !== 0 && "Cargar mas usuarios"
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
        </>
      )}
    </BasicLayout>
  );
}

function useUsersQuery(location) {
  const {
    page = 1,
    type = "follow",
    search,
  } = queryString.parse(location.search);
  return { page, type, search };
}
