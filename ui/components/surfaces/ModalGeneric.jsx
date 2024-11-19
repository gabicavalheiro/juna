import React from 'react';
import styles from './css/modalG.module.css';

const ModalGeneric = ({
  show,
  onClose,
  title,
  children,
  onConfirm,
  onRemove,
  confirmText = "SALVAR",
  cancelText = "CANCELAR",
  removeText = "REMOVER",
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


          {onConfirm && ( // Adiciona o botão de submit se a função onSubmit estiver definida
            <button onClick={onConfirm} className={styles.confirmButton}>
              {confirmText}
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
