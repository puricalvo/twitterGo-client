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

  const [users, setUsers] = useState(null);
  const [typeUser, setTypeUser] = useState(params.type || "follow");
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchText, setSearchText] = useState(params.search || "");

  const onSearch = useDebouncedCallback((value) => {
    setUsers(null);
    navigate({
      search: queryString.stringify({ ...params, search: value, page: 1 }),
    });
  }, 200);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    onSearch(val);
  };

  useEffect(() => {
    getFollowsApi(queryString.stringify(params))
      .then((response) => {
        if (params.page == 1) {
          if (isEmpty(response)) {
            setUsers([]);
            setBtnLoading(0); // No hay resultados, ocultamos botón
          } else {
            setUsers(response);
            // Si hay 20 o más, activamos el botón por si hay más páginas
            // Si hay menos de 20, asumimos que no hay más datos que cargar
            if (response.length >= 20) {
              setBtnLoading(false);
            } else {
              setBtnLoading(0);
            }
          }
        } else {
          if (!response || isEmpty(response)) {
            setBtnLoading(0);
          } else {
            setUsers([...users, ...response]);
            setBtnLoading(false);
          }
        }
      })
      .catch(() => {
        setUsers([]);
        setBtnLoading(0);
      });
  }, [location]);

  const onChangeType = (type) => {
    setUsers(null);
    setBtnLoading(false); // Reseteamos para que el botón pueda volver a aparecer
    setTypeUser(type);
    setSearchText("");
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
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>

      <ButtonGroup className="users__options">
        <Button
          className={typeUser === "follow" ? "active" : ""}
          onClick={() => onChangeType("follow")}
        >
          Siguiendo
        </Button>
        <Button
          className={typeUser === "new" ? "active" : ""}
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

          {/* Mostramos el botón siempre que btnLoading no sea 0 */}
          {btnLoading !== 0 && (
            <Button onClick={moreData} className="load-more">
              {!btnLoading ? (
                "Cargar más usuarios"
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
          )}
        </>
      )}
    </BasicLayout>
  );
}

function useUsersQuery(location) {
  const {
    page = 1,
    type = "follow",
    search = "",
  } = queryString.parse(location.search);
  return { page, type, search };
}
