import Works from "./Cards/Works";
import { projects } from "./Cards/constants";
import Search from "./Search/Search";
import { useEffect, useState, useRef } from "react";
import { Box, Heading } from "@chakra-ui/react";

function jaroWinkler(s, t) {
  // Calculate length of both strings
  s = s.toLowerCase();
  t = t.toLowerCase();
  const n = s.length;
  const m = t.length;

  if (n === 0 || m === 0) {
    return 0;
  }

  // Set matching window size
  const windowSize = Math.floor(Math.max(n, m) / 2) - 1;

  // Initialize arrays for matches and transpositions
  const sMatches = new Array(n).fill(false);
  const tMatches = new Array(m).fill(false);
  let matches = 0;
  let transpositions = 0;

  // Find matches and transpositions within the matching window
  for (let i = 0; i < n; i++) {
    let start = Math.max(0, i - windowSize);
    let end = Math.min(i + windowSize + 1, m);

    for (let j = start; j < end; j++) {
      if (!tMatches[j] && s[i] === t[j]) {
        sMatches[i] = true;
        tMatches[j] = true;
        matches++;
        break;
      }
    }
  }

  // If no matches were found, return 0
  if (matches === 0) {
    return 0;
  }

  // Count transpositions
  let k = 0;

  for (let i = 0; i < n; i++) {
    if (sMatches[i]) {
      while (!tMatches[k]) {
        k++;
      }

      if (s[i] !== t[k]) {
        transpositions++;
      }

      k++;
    }
  }

  // Calculate similarity ratio and prefix scale
  const similarity =
    (matches / n + matches / m + (matches - transpositions / 2) / matches) / 3;
  const prefixScale = Math.min(4, getCommonPrefixLength(s, t)) / 10;

  // Calculate Jaro-Winkler similarity
  return similarity + prefixScale * (1 - similarity);
}

function getCommonPrefixLength(s, t) {
  let i = 0;

  while (i < s.length && i < t.length && s[i] === t[i]) {
    i++;
  }

  return i;
}

function jaroWinklerSimilarity(s1, s2) {
  const s = s1.split(" ");
  const t = s2.split(" ");
  let cummax = 0;

  if (
    s1.toLowerCase().includes(s2.toLowerCase()) ||
    s2.toLowerCase().includes(s1.toLowerCase())
  ) {
    return 1;
  }

  for (let i = 0; i < s.length; i++) {
    let maxscore = 0;

    for (let j = 0; j < t.length; j++) {
      maxscore = Math.max(maxscore, jaroWinkler(s[i], t[j]));
    }

    cummax += maxscore;
  }

  return cummax / s.length;
}

const Dashboard = () => {
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const [input, setInput] = useState("");
  const THRESHOLD = 0.7;

  return (
    <>
      {/* <SearchHeading /> */}
      <Box paddingBottom={10} paddingLeft={10}>
        {/* <Heading fontSize={'8vh'} align='center' justify='center' p={8}>SEARCH and DASHBOARD</Heading> */}

        <Search
          onChange={handleInputChange}
          input={input}
          setInput={setInput}
        />

        <Works
          data={projects.filter(
            (data) =>
              jaroWinklerSimilarity(data.name, input) >= THRESHOLD ||
              jaroWinklerSimilarity(data.description, input) >= THRESHOLD ||
              input === ""
          )}
        />
      </Box>
    </>
  );
};

export default Dashboard;
