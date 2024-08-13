import styles from './style/App.module.scss';
import Navbar from './Navbar';

import discordIcon from './assets/discord.svg';
import githubIcon from './assets/github.svg';
import mailIcon from './assets/mail.svg';

const App = () => {
  return (
    <div class={styles.container}>
      <Navbar />
      <main class={styles.main}>
        <h1 class={styles.title}>Hi There!</h1>
        <h2 class={styles.subtitle}>Welcome to <span class={styles.mid_link}>Drisht.ai</span></h2>
        <p class={styles.description}>
          A growing platform showcasing<br />
          Computer Vision applications
        </p>
        <p class={styles.check}>
          Check out our work <a href="/Test" class={styles.highlight}>here</a>.
        </p>
        <div class={styles.contribute}>
          <p>Want to contribute to this platform?<br />
          Connect with us</p>
          <div className={styles.socialIcons}>
            <a href="/" aria-label="GitHub"><img src={githubIcon} alt="GitHub" /></a>
            <a href="/" aria-label="Discord"><img src={discordIcon} alt="Discord" /></a>
            <a href="/" aria-label="Email"><img src={mailIcon} alt="Email" /></a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;