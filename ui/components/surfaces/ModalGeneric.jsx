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
  cancelText = "FECHAR",
  removeText = "REMOVER",
  onSubmit, // Adiciona o suporte para onSubmit
}) => {
  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (onSubmit) {
      onSubmit(); // Chama a função onSubmit se estiver definida
    } else if (onConfirm) {
      onConfirm(); // Fallback para onConfirm se onSubmit não estiver definido
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.modalBody}> {/* Adiciona o formulário */}
          {children}
          <div className={styles.modalFooter}>
            {onRemove && (
              <button type="button" onClick={onRemove} className={styles.removeButton}>
                {removeText}
              </button>
            )}

            <button type="submit" className={styles.confirmButton}>
              {confirmText}
            </button>

            <button type="button" onClick={onClose} className={styles.cancelButton}>
              {cancelText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGeneric;
