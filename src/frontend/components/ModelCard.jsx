import styles from "../stylesheets/Models.module.scss";

const ModelCard = (props) => {
  const handleClick = () => {
    window.location.href = props.model.usageURL;
  };

  return (
    <div class={styles.modelCard} onClick={handleClick}>
      <img src={props.model.image} alt={props.model.name} />
      <h2>{props.model.name}</h2>
      <p>{props.model.description}</p>
    </div>
  );
};

export default ModelCard;
