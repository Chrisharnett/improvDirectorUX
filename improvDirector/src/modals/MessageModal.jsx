import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

export const MessageModal = ({
  show,
  setShow,
  message,
  setMessage,
  disableTimer,
}) => {
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  useEffect(() => {
    if (show && !disableTimer) {
      const timeout = setTimeout(() => {
        handleClose();
        setMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [setMessage, show, disableTimer]);

  const [title, announcement] = (message && Object.entries(message)[0]) || [
    "",
    "",
  ];

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">{announcement}</Modal.Body>
      </Modal>
    </>
  );
};

MessageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  setMessage: PropTypes.func.isRequired,
  disableTimer: PropTypes.bool,
};
