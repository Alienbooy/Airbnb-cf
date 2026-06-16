import styles from './ui.module.css';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size,
  full = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant],
    size ? styles[size] : '',
    full ? styles.full : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
