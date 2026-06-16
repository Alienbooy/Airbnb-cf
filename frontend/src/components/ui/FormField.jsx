import { cloneElement, isValidElement } from 'react';
import styles from './ui.module.css';

export default function FormField({ label, as = 'input', children, className = '', ...props }) {
  const Component = as;
  const controlClass = as === 'textarea' ? styles.textarea : as === 'select' ? styles.select : styles.input;

  return (
    <label className={`${styles.field} ${className}`}>
      <span>{label}</span>
      {children
        ? isValidElement(children)
          ? cloneElement(children, {
              className: [controlClass, children.props.className].filter(Boolean).join(' '),
            })
          : children
        : <Component className={controlClass} {...props} />}
    </label>
  );
}
