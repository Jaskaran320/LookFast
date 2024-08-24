import styles from "../stylesheets/App.module.scss";
import discordIcon from "../assets/discord.svg";
import githubIcon from "../assets/github.svg";
import mailIcon from "../assets/mail.svg";

const Intro = () => {
  return (
    <>
      <h1 className={styles.title}>Hi There!</h1>
      <h2 className={styles.subtitle}>
        Welcome to <span className={styles.mid_link}>LookFast</span>
      </h2>
      <p className={styles.description}>
        A growing platform showcasing
        <br />
        Computer Vision applications
      </p>
      <p className={styles.check}>
        Check out our work{" "}
        <a href="/Test" className={styles.highlight}>
          here
        </a>
        .
      </p>
    </>
  );
};

const Contribute = () => {
  return (
    <div className={styles.contribute}>
      <p>
        Want to contribute to this platform?
        <br />
        Connect with us
      </p>
      <div className={styles.socialIcons}>
        <a href="https://github.com/Jaskaran320/LookFast" target="_blank">
          <img src={githubIcon} alt="GitHubIcon" />
        </a>
        <a href="https://discord.gg/xnUcSmBQ" target="_blank">
          <img src={discordIcon} alt="DiscordIcon" />
        </a>
        <a href="mailto:jaskaransingh.official7@gmail.com" target="_blank">
          <img src={mailIcon} alt="EmailIcon" />
        </a>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Intro />
      <Contribute />
    </>
  );
};

export default Home;
