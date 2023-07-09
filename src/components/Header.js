import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { ReactComponent as GithubSVG } from "../images/github.svg";

const handlePageNavigation = (nav_page, cur_page, nav_allowed, setPage) => {
  if (cur_page === nav_page) return;

  if (nav_allowed) {
    setPage(nav_page);
  } else {
    alert(
      "Rubik's cube has blank sqaures, make sure you color the remaining squares or reset cube to continue."
    );
  }
};

export default function Header({ curPage, setPage, navAllowed }) {
  return (
    <nav className={styles["header"]}>
      <ul className={styles["header-text"]}>
        <Link
          to={navAllowed ? "/Scramble" : "#"}
          className={styles["section"]}
          onClick={() =>
            handlePageNavigation("Scramble", curPage, navAllowed, setPage)
          }
        >
          Scramble
        </Link>

        <Link
          to={navAllowed ? "/Customize" : "#"}
          className={styles["section"]}
          onClick={() =>
            handlePageNavigation("Customize", curPage, navAllowed, setPage)
          }
        >
          Customize
        </Link>

        <Link
          to={navAllowed ? "/Solve" : "#"}
          className={styles["section"]}
          onClick={() =>
            handlePageNavigation("Solve", curPage, navAllowed, setPage)
          }
        >
          Solve
        </Link>
      </ul>
      <a
        href="https://github.com/lhill5/Rubiks-Cube-Solver"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubSVG className={styles["github-logo"]} />
      </a>
    </nav>
  );
}
