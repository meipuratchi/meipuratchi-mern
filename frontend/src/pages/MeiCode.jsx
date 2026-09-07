import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaTimes, FaExternalLinkAlt, FaCheckCircle, FaCircle } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';
import './MeiCode.css';

// ── DSA Roadmap data with LeetCode links ─────────────────────
const TOPICS = [
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    desc: 'Foundation of every interview. Learn frequency maps, prefix sums and anagram detection.',
    color: '#192441',
    problems: [
      { name: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', diff: 'Easy' },
      { name: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', diff: 'Easy' },
      { name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', diff: 'Easy' },
      { name: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', diff: 'Medium' },
      { name: 'Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/', diff: 'Medium' },
      { name: 'Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/', diff: 'Medium' },
      { name: 'Longest Consecutive Sequence', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', diff: 'Medium' },
      { name: 'Valid Sudoku', url: 'https://leetcode.com/problems/valid-sudoku/', diff: 'Medium' },
      { name: 'Encode and Decode Strings', url: 'https://leetcode.com/problems/encode-and-decode-strings/', diff: 'Medium' },
    ],
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    desc: 'Opposite-end and fast/slow pointer patterns for sorted arrays and strings.',
    color: '#263d70',
    problems: [
      { name: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', diff: 'Easy' },
      { name: 'Two Sum II - Sorted Array', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', diff: 'Medium' },
      { name: '3Sum', url: 'https://leetcode.com/problems/3sum/', diff: 'Medium' },
      { name: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', diff: 'Medium' },
      { name: 'Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/', diff: 'Hard' },
    ],
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    desc: 'Optimise subarray problems from O(n²) to O(n) with expanding/shrinking windows.',
    color: '#315d78',
    problems: [
      { name: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', diff: 'Easy' },
      { name: 'Longest Substring Without Repeating', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', diff: 'Medium' },
      { name: 'Longest Repeating Character Replacement', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', diff: 'Medium' },
      { name: 'Permutation in String', url: 'https://leetcode.com/problems/permutation-in-string/', diff: 'Medium' },
      { name: 'Minimum Window Substring', url: 'https://leetcode.com/problems/minimum-window-substring/', diff: 'Hard' },
      { name: 'Sliding Window Maximum', url: 'https://leetcode.com/problems/sliding-window-maximum/', diff: 'Hard' },
    ],
  },
  {
    id: 'stack',
    title: 'Stack',
    desc: 'LIFO structure for bracket matching, monotonic stacks and expression evaluation.',
    color: '#192441',
    problems: [
      { name: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', diff: 'Easy' },
      { name: 'Min Stack', url: 'https://leetcode.com/problems/min-stack/', diff: 'Medium' },
      { name: 'Evaluate Reverse Polish Notation', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', diff: 'Medium' },
      { name: 'Generate Parentheses', url: 'https://leetcode.com/problems/generate-parentheses/', diff: 'Medium' },
      { name: 'Daily Temperatures', url: 'https://leetcode.com/problems/daily-temperatures/', diff: 'Medium' },
      { name: 'Car Fleet', url: 'https://leetcode.com/problems/car-fleet/', diff: 'Medium' },
      { name: 'Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', diff: 'Hard' },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    desc: 'Halve the search space every step. Works on sorted arrays, rotated arrays and answer spaces.',
    color: '#263d70',
    problems: [
      { name: 'Binary Search', url: 'https://leetcode.com/problems/binary-search/', diff: 'Easy' },
      { name: 'Search a 2D Matrix', url: 'https://leetcode.com/problems/search-a-2d-matrix/', diff: 'Medium' },
      { name: 'Koko Eating Bananas', url: 'https://leetcode.com/problems/koko-eating-bananas/', diff: 'Medium' },
      { name: 'Find Minimum in Rotated Sorted Array', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', diff: 'Medium' },
      { name: 'Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', diff: 'Medium' },
      { name: 'Time Based Key-Value Store', url: 'https://leetcode.com/problems/time-based-key-value-store/', diff: 'Medium' },
      { name: 'Median of Two Sorted Arrays', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', diff: 'Hard' },
    ],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    desc: "Pointer manipulation, dummy nodes, Floyd's cycle detection and merge patterns.",
    color: '#315d78',
    problems: [
      { name: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', diff: 'Easy' },
      { name: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', diff: 'Easy' },
      { name: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', diff: 'Easy' },
      { name: 'Reorder List', url: 'https://leetcode.com/problems/reorder-list/', diff: 'Medium' },
      { name: 'Remove Nth Node From End', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', diff: 'Medium' },
      { name: 'Copy List with Random Pointer', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', diff: 'Medium' },
      { name: 'Add Two Numbers', url: 'https://leetcode.com/problems/add-two-numbers/', diff: 'Medium' },
      { name: 'Find the Duplicate Number', url: 'https://leetcode.com/problems/find-the-duplicate-number/', diff: 'Medium' },
      { name: 'LRU Cache', url: 'https://leetcode.com/problems/lru-cache/', diff: 'Medium' },
      { name: 'Merge K Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', diff: 'Hard' },
      { name: 'Reverse Nodes in K-Group', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', diff: 'Hard' },
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    desc: 'DFS, BFS, BST properties, diameter and path-sum patterns on binary trees.',
    color: '#192441',
    problems: [
      { name: 'Invert Binary Tree', url: 'https://leetcode.com/problems/invert-binary-tree/', diff: 'Easy' },
      { name: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', diff: 'Easy' },
      { name: 'Diameter of Binary Tree', url: 'https://leetcode.com/problems/diameter-of-binary-tree/', diff: 'Easy' },
      { name: 'Balanced Binary Tree', url: 'https://leetcode.com/problems/balanced-binary-tree/', diff: 'Easy' },
      { name: 'Same Tree', url: 'https://leetcode.com/problems/same-tree/', diff: 'Easy' },
      { name: 'Subtree of Another Tree', url: 'https://leetcode.com/problems/subtree-of-another-tree/', diff: 'Easy' },
      { name: 'Lowest Common Ancestor of BST', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', diff: 'Medium' },
      { name: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', diff: 'Medium' },
      { name: 'Binary Tree Right Side View', url: 'https://leetcode.com/problems/binary-tree-right-side-view/', diff: 'Medium' },
      { name: 'Count Good Nodes in Binary Tree', url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', diff: 'Medium' },
      { name: 'Validate Binary Search Tree', url: 'https://leetcode.com/problems/validate-binary-search-tree/', diff: 'Medium' },
      { name: 'Kth Smallest Element in BST', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', diff: 'Medium' },
      { name: 'Construct BT from Preorder & Inorder', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', diff: 'Medium' },
      { name: 'Binary Tree Maximum Path Sum', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', diff: 'Hard' },
      { name: 'Serialize and Deserialize Binary Tree', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', diff: 'Hard' },
    ],
  },
  {
    id: 'heap',
    title: 'Heap / Priority Queue',
    desc: 'Min/max heaps for k-th largest, top-k elements and scheduling problems.',
    color: '#263d70',
    problems: [
      { name: 'Kth Largest Element in a Stream', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', diff: 'Easy' },
      { name: 'Last Stone Weight', url: 'https://leetcode.com/problems/last-stone-weight/', diff: 'Easy' },
      { name: 'K Closest Points to Origin', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', diff: 'Medium' },
      { name: 'Kth Largest Element in an Array', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', diff: 'Medium' },
      { name: 'Task Scheduler', url: 'https://leetcode.com/problems/task-scheduler/', diff: 'Medium' },
      { name: 'Design Twitter', url: 'https://leetcode.com/problems/design-twitter/', diff: 'Medium' },
      { name: 'Find Median from Data Stream', url: 'https://leetcode.com/problems/find-median-from-data-stream/', diff: 'Hard' },
    ],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    desc: 'Explore all options, backtrack on dead ends. Subsets, permutations, N-Queens.',
    color: '#315d78',
    problems: [
      { name: 'Subsets', url: 'https://leetcode.com/problems/subsets/', diff: 'Medium' },
      { name: 'Combination Sum', url: 'https://leetcode.com/problems/combination-sum/', diff: 'Medium' },
      { name: 'Permutations', url: 'https://leetcode.com/problems/permutations/', diff: 'Medium' },
      { name: 'Subsets II', url: 'https://leetcode.com/problems/subsets-ii/', diff: 'Medium' },
      { name: 'Combination Sum II', url: 'https://leetcode.com/problems/combination-sum-ii/', diff: 'Medium' },
      { name: 'Word Search', url: 'https://leetcode.com/problems/word-search/', diff: 'Medium' },
      { name: 'Palindrome Partitioning', url: 'https://leetcode.com/problems/palindrome-partitioning/', diff: 'Medium' },
      { name: 'Letter Combinations of Phone Number', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', diff: 'Medium' },
      { name: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/', diff: 'Hard' },
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    desc: 'BFS/DFS on grids, adjacency lists, connected components and topological sort.',
    color: '#192441',
    problems: [
      { name: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', diff: 'Medium' },
      { name: 'Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', diff: 'Medium' },
      { name: 'Max Area of Island', url: 'https://leetcode.com/problems/max-area-of-island/', diff: 'Medium' },
      { name: 'Pacific Atlantic Water Flow', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', diff: 'Medium' },
      { name: 'Surrounded Regions', url: 'https://leetcode.com/problems/surrounded-regions/', diff: 'Medium' },
      { name: 'Rotting Oranges', url: 'https://leetcode.com/problems/rotting-oranges/', diff: 'Medium' },
      { name: 'Walls and Gates', url: 'https://leetcode.com/problems/walls-and-gates/', diff: 'Medium' },
      { name: 'Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', diff: 'Medium' },
      { name: 'Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/', diff: 'Medium' },
      { name: 'Redundant Connection', url: 'https://leetcode.com/problems/redundant-connection/', diff: 'Medium' },
      { name: 'Number of Connected Components', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', diff: 'Medium' },
      { name: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder/', diff: 'Hard' },
    ],
  },
  {
    id: 'tries',
    title: 'Tries',
    desc: 'Prefix trees for autocomplete, word search and dictionary lookups.',
    color: '#263d70',
    problems: [
      { name: 'Implement Trie (Prefix Tree)', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', diff: 'Medium' },
      { name: 'Design Add and Search Words DS', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', diff: 'Medium' },
      { name: 'Word Search II', url: 'https://leetcode.com/problems/word-search-ii/', diff: 'Hard' },
    ],
  },
  {
    id: 'dp-1d',
    title: '1-D Dynamic Programming',
    desc: 'Memoisation and tabulation for classic 1D sequences: Fibonacci, House Robber, Climbing Stairs.',
    color: '#315d78',
    problems: [
      { name: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', diff: 'Easy' },
      { name: 'Min Cost Climbing Stairs', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/', diff: 'Easy' },
      { name: 'House Robber', url: 'https://leetcode.com/problems/house-robber/', diff: 'Medium' },
      { name: 'House Robber II', url: 'https://leetcode.com/problems/house-robber-ii/', diff: 'Medium' },
      { name: 'Longest Palindromic Substring', url: 'https://leetcode.com/problems/longest-palindromic-substring/', diff: 'Medium' },
      { name: 'Palindromic Substrings', url: 'https://leetcode.com/problems/palindromic-substrings/', diff: 'Medium' },
      { name: 'Decode Ways', url: 'https://leetcode.com/problems/decode-ways/', diff: 'Medium' },
      { name: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', diff: 'Medium' },
      { name: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', diff: 'Medium' },
      { name: 'Word Break', url: 'https://leetcode.com/problems/word-break/', diff: 'Medium' },
      { name: 'Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', diff: 'Medium' },
      { name: 'Partition Equal Subset Sum', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', diff: 'Medium' },
    ],
  },
  {
    id: 'dp-2d',
    title: '2-D Dynamic Programming',
    desc: 'Grid-based DP, edit distance, knapsack and interval DP patterns.',
    color: '#192441',
    problems: [
      { name: 'Unique Paths', url: 'https://leetcode.com/problems/unique-paths/', diff: 'Medium' },
      { name: 'Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/', diff: 'Medium' },
      { name: 'Best Time to Buy/Sell Stock with Cooldown', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', diff: 'Medium' },
      { name: 'Coin Change II', url: 'https://leetcode.com/problems/coin-change-ii/', diff: 'Medium' },
      { name: 'Target Sum', url: 'https://leetcode.com/problems/target-sum/', diff: 'Medium' },
      { name: 'Interleaving String', url: 'https://leetcode.com/problems/interleaving-string/', diff: 'Medium' },
      { name: 'Longest Increasing Path in Matrix', url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/', diff: 'Hard' },
      { name: 'Distinct Subsequences', url: 'https://leetcode.com/problems/distinct-subsequences/', diff: 'Hard' },
      { name: 'Edit Distance', url: 'https://leetcode.com/problems/edit-distance/', diff: 'Hard' },
      { name: 'Burst Balloons', url: 'https://leetcode.com/problems/burst-balloons/', diff: 'Hard' },
      { name: 'Regular Expression Matching', url: 'https://leetcode.com/problems/regular-expression-matching/', diff: 'Hard' },
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy',
    desc: 'Make locally optimal choices. Interval scheduling, jump game and gas station.',
    color: '#263d70',
    problems: [
      { name: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', diff: 'Medium' },
      { name: 'Jump Game', url: 'https://leetcode.com/problems/jump-game/', diff: 'Medium' },
      { name: 'Jump Game II', url: 'https://leetcode.com/problems/jump-game-ii/', diff: 'Medium' },
      { name: 'Gas Station', url: 'https://leetcode.com/problems/gas-station/', diff: 'Medium' },
      { name: 'Hand of Straights', url: 'https://leetcode.com/problems/hand-of-straights/', diff: 'Medium' },
      { name: 'Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/', diff: 'Medium' },
      { name: 'Insert Interval', url: 'https://leetcode.com/problems/insert-interval/', diff: 'Medium' },
      { name: 'Non-overlapping Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/', diff: 'Medium' },
      { name: 'Minimum Interval to Include Each Query', url: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', diff: 'Hard' },
    ],
  },
  {
    id: 'intervals',
    title: 'Intervals',
    desc: 'Sort by start, sweep-line and merge-overlap techniques.',
    color: '#315d78',
    problems: [
      { name: 'Insert Interval', url: 'https://leetcode.com/problems/insert-interval/', diff: 'Medium' },
      { name: 'Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/', diff: 'Medium' },
      { name: 'Non-overlapping Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/', diff: 'Medium' },
      { name: 'Meeting Rooms', url: 'https://leetcode.com/problems/meeting-rooms/', diff: 'Easy' },
      { name: 'Meeting Rooms II', url: 'https://leetcode.com/problems/meeting-rooms-ii/', diff: 'Medium' },
    ],
  },
  {
    id: 'advanced-graphs',
    title: 'Advanced Graphs',
    desc: "Dijkstra's, Bellman-Ford, Prim's, Union-Find and shortest-path algorithms.",
    color: '#192441',
    problems: [
      { name: 'Reconstruct Itinerary', url: 'https://leetcode.com/problems/reconstruct-itinerary/', diff: 'Hard' },
      { name: 'Min Cost to Connect All Points', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', diff: 'Medium' },
      { name: 'Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', diff: 'Medium' },
      { name: 'Swim in Rising Water', url: 'https://leetcode.com/problems/swim-in-rising-water/', diff: 'Hard' },
      { name: 'Alien Dictionary', url: 'https://leetcode.com/problems/alien-dictionary/', diff: 'Hard' },
      { name: 'Cheapest Flights Within K Stops', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', diff: 'Medium' },
    ],
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    desc: 'AND, OR, XOR tricks for single-number, power-of-two and subset enumeration.',
    color: '#263d70',
    problems: [
      { name: 'Single Number', url: 'https://leetcode.com/problems/single-number/', diff: 'Easy' },
      { name: 'Number of 1 Bits', url: 'https://leetcode.com/problems/number-of-1-bits/', diff: 'Easy' },
      { name: 'Counting Bits', url: 'https://leetcode.com/problems/counting-bits/', diff: 'Easy' },
      { name: 'Reverse Bits', url: 'https://leetcode.com/problems/reverse-bits/', diff: 'Easy' },
      { name: 'Missing Number', url: 'https://leetcode.com/problems/missing-number/', diff: 'Easy' },
      { name: 'Sum of Two Integers', url: 'https://leetcode.com/problems/sum-of-two-integers/', diff: 'Medium' },
      { name: 'Reverse Integer', url: 'https://leetcode.com/problems/reverse-integer/', diff: 'Medium' },
    ],
  },
  {
    id: 'math-geometry',
    title: 'Math & Geometry',
    desc: 'Rotate matrix, spiral order, happy number and GCD-based tricks.',
    color: '#315d78',
    problems: [
      { name: 'Rotate Image', url: 'https://leetcode.com/problems/rotate-image/', diff: 'Medium' },
      { name: 'Spiral Matrix', url: 'https://leetcode.com/problems/spiral-matrix/', diff: 'Medium' },
      { name: 'Set Matrix Zeroes', url: 'https://leetcode.com/problems/set-matrix-zeroes/', diff: 'Medium' },
      { name: 'Happy Number', url: 'https://leetcode.com/problems/happy-number/', diff: 'Easy' },
      { name: 'Plus One', url: 'https://leetcode.com/problems/plus-one/', diff: 'Easy' },
      { name: 'Pow(x, n)', url: 'https://leetcode.com/problems/powx-n/', diff: 'Medium' },
      { name: 'Multiply Strings', url: 'https://leetcode.com/problems/multiply-strings/', diff: 'Medium' },
      { name: 'Detect Squares', url: 'https://leetcode.com/problems/detect-squares/', diff: 'Medium' },
    ],
  },
];

const DIFF_COLOR = { Easy: '#48c78e', Medium: '#f5a623', Hard: '#f87171' };

// ── Track localStorage for solved ──
function getSolved() {
  try { return new Set(JSON.parse(localStorage.getItem('meicode-solved') || '[]')); }
  catch { return new Set(); }
}
function toggleSolved(key) {
  const s = getSolved();
  s.has(key) ? s.delete(key) : s.add(key);
  localStorage.setItem('meicode-solved', JSON.stringify([...s]));
}

export default function MeiCode() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [solved, setSolved] = useState(getSolved);

  const topic = activeTopic ? TOPICS.find(t => t.id === activeTopic) : null;

  const handleToggle = (key) => {
    toggleSolved(key);
    setSolved(getSolved());
  };

  const totalProblems = TOPICS.reduce((s, t) => s + t.problems.length, 0);
  const solvedCount = solved.size;

  return (
    <main className="meicode-page">
      {/* Hero */}
      <section className="meicode-hero">
        <div className="container meicode-hero-inner">
          <AnimatedSection variant="fadeInLeft" className="meicode-hero-copy">
            <span className="meicode-eyebrow">மெய் புரட்சி — DSA உலகம்</span>
            <h1>MeiCode <span className="meicode-accent">Roadmap</span></h1>
            <p className="meicode-hero-sub">
              Coding interview preparation — Data Structures & Algorithms with direct LeetCode links. Click any topic to start practising.
            </p>
            <div className="meicode-progress-wrap">
              <div className="meicode-progress-bar">
                <div
                  className="meicode-progress-fill"
                  style={{ width: `${Math.round((solvedCount / totalProblems) * 100)}%` }}
                />
              </div>
              <span className="meicode-progress-label">
                {solvedCount} / {totalProblems} solved ({Math.round((solvedCount / totalProblems) * 100)}%)
              </span>
            </div>
          </AnimatedSection>
          <motion.div
            className="meicode-hero-icon"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            aria-hidden="true"
          >
            <FaCode />
          </motion.div>
        </div>
      </section>

      {/* Roadmap SVG Map — pixel-perfect recreation of original layout */}
      <section className="meicode-map-section container">
        <AnimatedSection variant="fadeInUp" className="meicode-map-header">
          <span className="meicode-section-kicker">பாதை வரைபடம்</span>
          <h2>Learning Roadmap</h2>
          <p>Follow the connections — each topic builds on the previous ones. Click a node to see problems.</p>
        </AnimatedSection>

        <div className="meicode-map-scroll">
          <svg
            viewBox="0 0 541 546"
            className="meicode-svg"
            aria-label="DSA Roadmap"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.6)" />
              </filter>
              <filter id="node-glow" x="-30%" y="-30%" width="160%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f5a623" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* ── CONNECTIONS (exact paths from dsa.html) ── */}
            {[
              /* Arrays → Two Pointers */    "M304 67 C304 84, 250 87, 250 105",
              /* Arrays → Stack */           "M304 67 C304 80, 339 80, 339 96",
              /* Two Pointers → Binary */    "M250 131 C250 138, 167 136, 167 145",
              /* Two Pointers → Sliding */   "M250 131 C250 138, 262 138, 262 145",
              /* Two Pointers → Linked */    "M250 131 C250 139, 362 136, 362 145",
              /* Binary → Trees */           "M167 172 C167 203, 258 196, 258 230",
              /* Sliding → Trees */          "M262 172 C262 195, 258 201, 258 230",
              /* Linked → Trees */           "M362 172 C362 199, 258 194, 258 230",
              /* Trees → Tries */            "M258 256 C258 274, 175 271, 175 291",
              /* Trees → Backtracking */     "M258 256 C258 273, 341 270, 341 289",
              /* Trees → Heap */             "M258 256 C258 291, 230 302, 230 335",
              /* Trees → Graphs */           "M258 256 C258 299, 337 316, 337 355",
              /* Backtracking → Graphs */    "M341 316 C341 330, 337 341, 337 355",
              /* Backtracking → 1-D DP */    "M341 316 C341 333, 441 331, 441 352",
              /* Heap → Intervals */         "M230 374 C230 389, 76 390, 76 404",
              /* Heap → Greedy */            "M230 374 C230 400, 178 401, 178 428",
              /* Heap → Advanced Graphs */   "M230 374 C230 394, 269 398, 269 417",
              /* Graphs → Advanced Graphs */ "M337 382 C337 397, 269 399, 269 417",
              /* Graphs → 2-D DP */          "M337 382 C337 405, 377 409, 377 431",
              /* 1-D DP → 2-D DP */          "M441 392 C441 410, 377 408, 377 431",
              /* 1-D DP → Bit Manipulation */"M441 392 C441 411, 485 411, 485 430",
              /* 2-D DP → Math & Geometry */ "M377 471 C377 482, 447 481, 447 493",
              /* Bit → Math & Geometry */    "M485 457 C485 477, 447 476, 447 493",
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(245,166,35,0.35)"
                strokeWidth="1.4"
                strokeDasharray="5 3"
                opacity="0.85"
              />
            ))}

            {/* ── NODES (exact positions from dsa.html) ── */}
            {[
              { id: 'arrays-hashing',    x: 264, y: 42,  w: 80,  h: 25, label: 'Arrays & Hashing',         green: true  },
              { id: 'two-pointers',      x: 209, y: 105, w: 81,  h: 26, label: 'Two Pointers',              green: true  },
              { id: 'stack',             x: 299, y: 96,  w: 80,  h: 27, label: 'Stack',                     green: true  },
              { id: 'binary-search',     x: 127, y: 145, w: 80,  h: 27, label: 'Binary Search',             green: false },
              { id: 'sliding-window',    x: 221, y: 145, w: 82,  h: 27, label: 'Sliding Window',            green: false },
              { id: 'linked-list',       x: 322, y: 145, w: 81,  h: 27, label: 'Linked List',               green: false },
              { id: 'trees',             x: 218, y: 230, w: 81,  h: 26, label: 'Trees',                     green: false },
              { id: 'tries',             x: 135, y: 291, w: 81,  h: 27, label: 'Tries',                     green: false },
              { id: 'backtracking',      x: 300, y: 289, w: 83,  h: 27, label: 'Backtracking',              green: false },
              { id: 'heap',              x: 190, y: 335, w: 80,  h: 39, label: 'Heap / Priority\nQueue',    green: false },
              { id: 'graphs',            x: 296, y: 355, w: 81,  h: 27, label: 'Graphs',                    green: false },
              { id: 'dp-1d',             x: 400, y: 352, w: 82,  h: 40, label: '1-D Dynamic\nProgramming', green: false },
              { id: 'intervals',         x: 35,  y: 404, w: 81,  h: 27, label: 'Intervals',                 green: false },
              { id: 'greedy',            x: 138, y: 428, w: 80,  h: 27, label: 'Greedy',                    green: false },
              { id: 'advanced-graphs',   x: 228, y: 417, w: 81,  h: 27, label: 'Advanced Graphs',           green: false },
              { id: 'dp-2d',             x: 336, y: 431, w: 81,  h: 40, label: '2-D Dynamic\nProgramming', green: false },
              { id: 'bit-manipulation',  x: 445, y: 430, w: 81,  h: 27, label: 'Bit Manipulation',          green: false },
              { id: 'math-geometry',     x: 407, y: 493, w: 80,  h: 27, label: 'Math & Geometry',           green: false },
            ].map(node => {
              const topicSolved = (TOPICS.find(t => t.id === node.id)?.problems || [])
                .filter(p => solved.has(`${node.id}::${p.name}`)).length;
              const totalP = TOPICS.find(t => t.id === node.id)?.problems.length || 1;
              const pct = topicSolved / totalP;
              const isActive = activeTopic === node.id;

              // Colours
              const fill   = isActive ? '#f5a623'
                           : pct === 1 ? '#10b981'
                           : node.green ? '#23775e'
                           : '#505785';
              const underlineColor = isActive ? '#0d1b2a'
                           : pct === 1 ? '#a7f3d0'
                           : node.green ? '#4ebf99'
                           : '#9ea8e0';
              const textColor = '#ffffff';

              // Split label at \n for multi-line nodes
              const lines = node.label.split('\n');
              const lineH = 12;
              const totalTextH = lines.length * lineH;
              const textY = node.y + (node.h - totalTextH) / 2 + 1;

              return (
                <g
                  key={node.id}
                  onClick={() => setActiveTopic(activeTopic === node.id ? null : node.id)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  aria-label={node.label}
                  filter={isActive ? 'url(#node-glow)' : 'url(#node-shadow)'}
                >
                  {/* Node rect */}
                  <rect
                    x={node.x} y={node.y}
                    width={node.w} height={node.h}
                    rx={4}
                    fill={fill}
                    stroke={isActive ? '#f5a623' : 'rgba(255,255,255,0.12)'}
                    strokeWidth={isActive ? 1.5 : 0.8}
                  />
                  {/* Underline bar */}
                  <rect
                    x={node.x + 5} y={node.y + node.h - 4}
                    width={node.w - 10} height={2}
                    rx={1}
                    fill={underlineColor}
                    opacity={0.9}
                  />
                  {/* Progress fill over underline */}
                  {pct > 0 && pct < 1 && (
                    <rect
                      x={node.x + 5} y={node.y + node.h - 4}
                      width={(node.w - 10) * pct} height={2}
                      rx={1}
                      fill="#f5a623"
                    />
                  )}
                  {/* Label text */}
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={node.x + node.w / 2}
                      y={textY + li * lineH + lineH / 2 - 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10}
                      fontWeight={isActive ? '700' : '500'}
                      fill={isActive ? '#0d1b2a' : textColor}
                      fontFamily="Inter, Arial, sans-serif"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* Problem Drawer */}
      <AnimatePresence>
        {topic && (
          <motion.div
            className="meicode-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTopic(null)}
          >
            <motion.aside
              className="meicode-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 35 }}
              onClick={e => e.stopPropagation()}
              aria-label={`${topic.title} problems`}
            >
              {/* Drawer header */}
              <div className="meicode-drawer-head" style={{ background: topic.color }}>
                <div>
                  <h3>{topic.title}</h3>
                  <p>{topic.desc}</p>
                  <span className="meicode-drawer-count">
                    {topic.problems.filter(p => solved.has(`${topic.id}::${p.name}`)).length} / {topic.problems.length} solved
                  </span>
                </div>
                <button
                  className="meicode-drawer-close"
                  onClick={() => setActiveTopic(null)}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Problem list */}
              <ul className="meicode-problem-list">
                {topic.problems.map((p, i) => {
                  const key = `${topic.id}::${p.name}`;
                  const done = solved.has(key);
                  return (
                    <li key={i} className={`meicode-problem-item ${done ? 'done' : ''}`}>
                      <button
                        className="meicode-check-btn"
                        onClick={() => handleToggle(key)}
                        aria-label={done ? 'Mark unsolved' : 'Mark solved'}
                        title={done ? 'Mark unsolved' : 'Mark solved'}
                      >
                        {done
                          ? <FaCheckCircle style={{ color: '#48c78e' }} />
                          : <FaCircle style={{ color: '#d0d5dd' }} />
                        }
                      </button>
                      <span
                        className="meicode-diff-dot"
                        style={{ background: DIFF_COLOR[p.diff] || '#ccc' }}
                        title={p.diff}
                      />
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meicode-problem-link"
                      >
                        {p.name}
                        <FaExternalLinkAlt className="meicode-ext-icon" />
                      </a>
                      <span
                        className="meicode-diff-badge"
                        style={{ color: DIFF_COLOR[p.diff], borderColor: DIFF_COLOR[p.diff] + '44' }}
                      >
                        {p.diff}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Legend */}
              <div className="meicode-drawer-legend">
                {Object.entries(DIFF_COLOR).map(([label, color]) => (
                  <span key={label} className="meicode-legend-item">
                    <span className="meicode-legend-dot" style={{ background: color }} />
                    {label}
                  </span>
                ))}
                <span className="meicode-legend-note">Progress saved locally in your browser</span>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Topics Grid */}
      <section className="meicode-topics-section container">
        <AnimatedSection variant="fadeInUp" className="meicode-topics-header">
          <span className="meicode-section-kicker">அனைத்து தலைப்புகளும்</span>
          <h2>All Topics</h2>
          <p>{TOPICS.length} topics · {totalProblems} problems — all linked to LeetCode</p>
        </AnimatedSection>

        <div className="meicode-topics-grid">
          {TOPICS.map((t, i) => {
            const topicSolved = t.problems.filter(p => solved.has(`${t.id}::${p.name}`)).length;
            const pct = Math.round((topicSolved / t.problems.length) * 100);
            return (
              <AnimatedSection
                key={t.id}
                variant="fadeInUp"
                delay={i * 0.03}
                className="meicode-topic-card card"
                onClick={() => setActiveTopic(activeTopic === t.id ? null : t.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="meicode-topic-top">
                  <div className="meicode-topic-dot" style={{ background: t.color }} />
                  <span className="meicode-topic-count">{topicSolved}/{t.problems.length}</span>
                </div>
                <h3 className="meicode-topic-title">{t.title}</h3>
                <p className="meicode-topic-desc">{t.desc}</p>
                <div className="meicode-topic-bar-wrap">
                  <div className="meicode-topic-bar-track">
                    <div
                      className="meicode-topic-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 ? '#48c78e' : t.color,
                      }}
                    />
                  </div>
                  <span className="meicode-topic-pct">{pct}%</span>
                </div>
                <span className="meicode-topic-cta">
                  {activeTopic === t.id ? 'Close ↑' : 'Practice →'}
                </span>
              </AnimatedSection>
            );
          })}
        </div>
      </section>
    </main>
  );
}
