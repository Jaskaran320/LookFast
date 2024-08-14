import { Router, Route } from "@solidjs/router";

import styles from "./style/App.module.scss";
import Navbar from "./Navbar";
import Home from "./Home";
import Test from "./Test";
// import Display from "./Display";
// import About from "./About";

// const App = () => {
//   return (
//     <div class={styles.container}>
//       <Navbar />
//       <div class={styles.main}>
//         <Intro />
//         <Contribute />
//       </div>
//     </div>
//   );
// };

const App = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main}>
        <Router>
          <Route end component={Home} />
          <Route path="/Test" component={Test} />
          {/* <Route path="/Display" component={Display} /> */}
          {/* <Route path="/About" component={About} /> */}
        </Router>
      </div>
    </div>
  );
};

export default App;
