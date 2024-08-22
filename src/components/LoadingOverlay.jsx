import { VsLoading } from 'solid-icons/vs'
import styles from '../stylesheets/Test.module.scss';

const LoadingOverlay = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingIconWrapper}>
        <VsLoading size={48} className={styles.loadingIcon} />
      </div>
    </div>
  );
};

export default LoadingOverlay;