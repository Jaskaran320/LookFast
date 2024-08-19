import { Router, Route } from "@solidjs/router";

import styles from "../stylesheets/App.module.scss";
import Navbar from "../components/Navbar";
import Home from "./Home";
import Test from "./Test";
// import Display from "./Display";
// import About from "./About";

const App = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main}>
        <Router>
          <Route end component={Home} />
          <Route path="/Test" component={Test} />
        </Router>
      </div>
    </div>
  );
};

export default App;
