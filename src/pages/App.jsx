import { Router, Route } from "@solidjs/router";

import styles from "../stylesheets/App.module.scss";
import Navbar from "../components/Navbar";
import Home from "./Home";
import Segment from "./Segment";
import Models from "./Models";
// import About from "./About";

const App = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main}>
        <Router>
          <Route end component={Home} />
          <Route path="/models" component={Models} />
          <Route path="/segment" component={Segment} />
          {/* <Route path="/about" component={About} /> */}
        </Router>
      </div>
    </div>
  );
};

export default App;
