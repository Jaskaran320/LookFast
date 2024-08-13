import styles from './Navbar.module.scss';

const Navbar = () => {
  return (
    <nav class={styles.navbar}>
      <div class={styles.logo}><a href='/'>Objectif.ai</a></div>
      <ul class={styles.navLinks}>
        <li><a href="/Test">Test</a></li>
        <li><a href="/About">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;