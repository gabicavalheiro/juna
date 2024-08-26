import React, { useState } from 'react';
import styles from './css/modal.module.css';

const Modal = ({ show, onClose, onSave }) => {
  const [description, setDescription] = useState('');

  const handleSave = () => {
    onSave(description);
    setDescription('');
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2>Adicione o evento</h2>
        <input
          className={styles.input}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Evento"
        />
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Modal;
