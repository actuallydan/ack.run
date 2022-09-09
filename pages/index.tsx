import { useEffect, useState, useCallback } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";
import { start } from "repl";

const arraysOfDays = Array(20).fill(Array(5).fill(0));

type AckValue = -1 | 0 | 1;

function getColor(value: AckValue) {
  const colors = {
    [-1]: "bg-red-600",
    [0]: "bg-white",
    [1]: "bg-green-600",
  };
  return colors[value];
}

const formatter = new Intl.RelativeTimeFormat("en");

export default function Home() {
  const [data, setData] = useState<AckValue[]>(Array(100).fill(0));
  const [cursor, setCursor] = useState<number>(0);
  const [start, setStart] = useState(new Date().getTime());

  const getOnlineStatus = useCallback(async () => {
    try {
      const res = await fetch("/this").then((res) => res.json());

      if (res.data === "👍") {
        setData((state) => {
          state[cursor] = 1;
          return [...state];
        });
      } else {
        throw "You're offline";
      }
    } catch (e) {
      setData((state) => {
        state[cursor] = -1;
        return [...state];
      });
    } finally {
      setCursor((newCursor) => (newCursor >= 99 ? 0 : newCursor + 1));
    }
  }, [cursor, data]);

  useEffect(() => {
    const interval = setInterval(getOnlineStatus, 1000 * 60);

    return () => clearInterval(interval);
  }, [getOnlineStatus]);

  const timeSinceStart = formatter.format(
    (new Date().getTime() - start) / 1000 / 60 / 60,
    "hours"
  );

  const dataWithResults = data.filter((d) => d !== 0);

  const uptimePercent =
    (dataWithResults.filter((d) => d === 1).length /
      (dataWithResults.length || 1)) *
    100;

  console.log(timeSinceStart, uptimePercent);
  return (
    <div className={styles.container}>
      <Head>
        <title>ack.run</title>
        <meta name="description" content="Can you fetch this?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h3 className={styles.title}>
        <a href="https://ack.run/this">ack.run</a>
      </h3>

      <p className={styles.description}>
        try sending a GET request to{" "}
        <code className={styles.code}>https://ack.run/this</code>
      </p>

      <h1 className="mt-3 p-2 border-2 color bg-gray-700 rounded text-white">
        {uptimePercent.toFixed(2)}% uptime in the last{" "}
        {timeSinceStart.replace("in", "")}
      </h1>

      <div className="flex flex-row mt-4">
        {arraysOfDays.map((hour, i) => (
          <div className="flex flex-col" key={"hour-" + i}>
            {hour.map((hasAck: AckValue, j: number) => {
              const currentBorderStyle =
                cursor === i * 5 + j
                  ? " border-4 border-purple-400 animate-spin"
                  : "";
              const style =
                "w-6 h-6 border rounded m-2 p-2 " +
                getColor(data[i * 5 + j]) +
                currentBorderStyle;
              return (
                <div className={style} key={"hour-chunk-" + j}>
                  {" "}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button
        className="mt-3 p-2 border-2 color border-purple-400 rounded"
        onClick={getOnlineStatus}
      >
        Check Again
      </button>
    </div>
  );
}
