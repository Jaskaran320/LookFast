import { createSignal } from 'solid-js';
import { For } from 'solid-js/web';
import ModelCard from '../components/ModelCard';
import styles from '../stylesheets/Models.module.scss';
import modelIcon from '../assets/Images/sam2.png'

const Models = () => {
  const [models] = createSignal([
    {
      id: 1,
      name: 'SAM2 Demo',
      description: 'A simple demonstration of SAM2 on images',
      image: modelIcon,
      usageURL: '/segment',
    },
    {
      id: 2,
      name: 'Understanding SAM2',
      description: 'Deep dive into the SAM2 model',
      image: modelIcon,
      usageURL: '/sam2',
    },
  ]);

  return (
    <div class={styles.container}>
      <p class={styles.title}>Check out some interesting models and blogs:</p>
      <div class={styles.catalogueGrid}>
        <For each={models()}>
          {(model) => <ModelCard model={model} />}
        </For>
      </div>
    </div>
  );
};

export default Models;