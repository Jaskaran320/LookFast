import styles from "../stylesheets/Models.module.scss";

const ModelCard = (props) => {
  return (
    <a href={props.model.usageURL} class={styles.modelCard}>
      <img src={props.model.image} alt={props.model.name} />
      <h2>{props.model.name}</h2>
      <p>{props.model.description}</p>
    </a>
  );
};

export default ModelCard;
