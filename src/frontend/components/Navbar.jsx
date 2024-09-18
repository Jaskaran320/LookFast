import styles from '../stylesheets/Navbar.module.scss';

const Navbar = () => {
  return (
    <nav class={styles.navbar}>
      <div class={styles.logo}><a href='/'>LookFast</a></div>
      <ul class={styles.navLinks}>
        <li><a href="/blogs">Blogs</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;