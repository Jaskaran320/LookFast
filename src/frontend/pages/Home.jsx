import styles from "../stylesheets/App.module.scss";
import discordIcon from "../assets/discord.svg";
import githubIcon from "../assets/github.svg";
import mailIcon from "../assets/mail.svg";

const Intro = () => {
  return (
    <div>
      <h1 className={styles.title}>Hi There!</h1>
      <h2 className={styles.subtitle}>
        Welcome to <span className={styles.mid_link}>LookFast</span>
      </h2>
      <p className={styles.description}>
        Breaking down latest Computer Vision research into easy-to-understand 
        <br />
        summaries, and occasionally showcasing innovative models.
      </p>
      <p className={styles.check}>
        Explore our summaries and models{" "}
        <a href="/models" className={styles.highlight}>
          here
        </a>
        .
      </p>
    </div>
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
    <div className={styles.home}>
      <Intro />
      <Contribute />
    </div>
  );
};

export default Home;