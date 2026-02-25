import { useState, useCallback } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { addTweetApi, uploadImageTweetApi } from "../../../api/tweet";
import { Close, Camera } from "../../../utils/Icons";
import imageCompression from "browser-image-compression";

import "./TweetModal.scss";

export default function TweetModal(props) {
  const { show, setShow } = props;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const maxLength = 280;

  const onHide = () => {
    setMessage("");
    setFile(null);
    setPreviewUrl(null);
    setShow(false);
  };

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setPreviewUrl(URL.createObjectURL(file));
    setFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    let imageName = "";

    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        const response = await uploadImageTweetApi(compressedFile);

        if (response && response.includes("tweetImage")) {
          imageName = response;
        } else {
          toast.error("Error al subir la imagen");
          return;
        }
      } catch (error) {
        toast.error("Error al procesar la imagen");
        return;
      }
    }

    addTweetApi(message, imageName)
      .then((response) => {
        if (response?.code === 200 || response?.status === 200) {
          setShow(false);
          setMessage("");
          setFile(null);
          setPreviewUrl(null);

          toast.success("¡Tweet publicado!");
          setTimeout(() => {
            window.location.reload();
          }, 600);
        } else {
          toast.error("Error al guardar el tweet");
        }
      })
      .catch(() => {
        toast.error("Error de servidor");
      });
  };

  return (
    <Modal
      className="tweet-modal"
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >
      <Modal.Header>
        <Modal.Title>
          <Close onClick={onHide} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Control
            as="textarea"
            rows="6"
            placeholder="¿Qué estás pensando?"
            name="mensaje"
            value={message}
            onChange={onChange}
          />

          {previewUrl && (
            <div
              className="image-preview"
              style={{ backgroundImage: `url('${previewUrl}')` }}
            />
          )}

          <div className="btns-container">
            <div {...getRootProps()} className="camera-icon">
              <input {...getInputProps()} />
              <Camera />
            </div>

            <span
              className={classNames("count", {
                error: message.length > maxLength,
              })}
            >
              {message.length} / {maxLength}
            </span>
          </div>

          <Button
            type="submit"
            disabled={
              (message.length < 1 && !file) || message.length > maxLength
            }
          >
            Twittoar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
