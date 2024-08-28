import { createSignal } from 'solid-js';
import { For } from 'solid-js/web';
import ModelCard from '../components/ModelCard';
import styles from '../stylesheets/Models.module.scss';
import modelIcon from '../assets/model.svg';

const Models = () => {
  const [models] = createSignal([
    {
      id: 1,
      name: 'Segmentation Model',
      description: 'Advanced model to segment images given an input point',
      image: modelIcon,
      usageURL: '/segment',
    },
  ]);

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Our Model Catalogue</h1>
      <div class={styles.catalogueGrid}>
        <For each={models()}>
          {(model) => <ModelCard model={model} />}
        </For>
      </div>
    </div>
  );
};

export default Models;