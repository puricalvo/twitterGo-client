import React, { useState, useCallback } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { S3_URL } from "../../../utils/constant";
import { Camera } from "../../../utils/Icons";
import {
  uploadBannerApi,
  uploadAvatarApi,
  updateInfoApi,
} from "../../../api/user";

import "./EditUserForm.scss";

export default function EditUserForm(props) {
  const { user, setShowModal } = props;
  const [formData, setFormData] = useState(initialValue(user));

  const [version] = useState(new Date().getTime());

  const [bannerUrl, setBannerUrl] = useState(
    user?.banner ? `${S3_URL}${user.banner}?v=${version}` : null,
  );
  const [bannerFile, setBannerFile] = useState(null);

  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar ? `${S3_URL}${user.avatar}?v=${version}` : null,
  );
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const onDropBanner = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setBannerUrl(URL.createObjectURL(file));
    setBannerFile(file);
  });
  const {
    getRootProps: getRootBannerProps,
    getInputProps: getInputBannerProps,
  } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    multiple: false,
    onDrop: onDropBanner,
  });

  const onDropAvatar = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setAvatarUrl(URL.createObjectURL(file));
    setAvatarFile(file);
  });
  const {
    getRootProps: getRootAvatarProps,
    getInputProps: getInputAvatarProps,
  } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    multiple: false,
    onDrop: onDropAvatar,
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Subir Banner
      if (bannerFile) {
        await uploadBannerApi(bannerFile);
      }

      // 2. Subir Avatar
      if (avatarFile) {
        await uploadAvatarApi(avatarFile);
      }

      // 3. Actualizar Info
      await updateInfoApi(formData).then(() => {
        setShowModal(false);
      });

      window.location.reload();
    } catch (error) {
      toast.error("Error al actualizar los datos", {
        theme: "colored",
      });
    } finally {
      setLoading(false);
      toast.success("Perfil actualizado correctamente", {
        theme: "colored",
      });
    }
  };

  return (
    <div className="edit-user-form">
      <div
        className="banner"
        // Importante: backgroundImage con la URL que tiene el "timestamp"
        style={{ backgroundImage: `url('${bannerUrl}')` }}
        {...getRootBannerProps()}
      >
        <input {...getInputBannerProps()} />
        <Camera />
      </div>

      <div
        className="avatar"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
        {...getRootAvatarProps()}
      >
        <input {...getInputAvatarProps()} />
        <Camera />
      </div>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-4">
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="nombre"
                defaultValue={formData.nombre}
                onChange={onChange}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Apellidos"
                name="apellidos"
                defaultValue={formData.apellidos}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Ubicación"
            name="ubicacion"
            defaultValue={formData.ubicacion}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            as="textarea"
            row="3"
            placeholder="Agrega tu biografía"
            type="text"
            name="biografia"
            defaultValue={formData.biografia}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Sitio web"
            name="sitioweb"
            defaultValue={formData.sitioweb}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <DatePicker
            placeholder="Fecha de nacimiento"
            locale={es}
            selected={new Date(formData.fechaNacimiento)}
            onChange={(value) =>
              setFormData({ ...formData, fechaNacimiento: value })
            }
          />
        </Form.Group>

        <Button className="btn-submit" variant="primary" type="submit">
          {loading && <Spinner animation="border" size="sm" />} Actualizar
        </Button>
      </Form>
    </div>
  );
}

function initialValue(user) {
  return {
    nombre: user.nombre || "",
    apellidos: user.apellidos || "",
    biografia: user.biografia || "",
    ubicacion: user.ubicacion || "",
    sitioweb: user.sitioweb || "",
    fechaNacimiento: user.fechaNacimiento || "",
  };
}
