import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { ReactComponent as GithubSVG } from "../images/github.svg";

export default function Header({ setPage }) {
  return (
    <nav className={styles["header"]}>
      <ul className={styles["header-text"]}>
        <Link
          to="/Scramble"
          className={styles["section"]}
          onClick={() => setPage("Scramble")}
        >
          Scramble
        </Link>

        <Link
          to="/Customize"
          className={styles["section"]}
          onClick={() => setPage("Customize")}
        >
          Customize
        </Link>

        <Link
          to="/Solve"
          className={styles["section"]}
          onClick={() => setPage("Solve")}
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
