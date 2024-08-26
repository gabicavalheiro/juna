import React from 'react';
import styles from './css/modalG.module.css';

const ModalGeneric = ({
  show,
  onClose,
  title,
  children,
  onConfirm,
  onRemove,
  confirmText = "Save",
  cancelText = "Cancel",
  removeText = "Remove",
  onSubmit // Função de submit que será chamada no botão de submit
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          {onRemove && (
            <button onClick={onRemove} className={styles.removeButton}>
              {removeText}
            </button>
          )}


          {onSubmit && ( // Adiciona o botão de submit se a função onSubmit estiver definida
            <button onClick={onSubmit} className={styles.confirmButton}>
              Submit
            </button>
          )}

          <button onClick={onClose} className={styles.cancelButton}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGeneric;
