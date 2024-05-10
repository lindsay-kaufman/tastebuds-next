import { Map } from "./../components/map";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Tastebuds</h1>
        <Map />
      </div>
    </main>
  );
}
