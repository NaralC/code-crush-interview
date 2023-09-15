const listOfAlgoQuestions: Question[] = [
    {
      id: "1",
      title: "Palindrome",
      body: {
        time: 1687509833191,
        blocks: [
          {
            id: "uH2t70Hrgc",
            type: "header",
            data: {
              text: "A phrase is a palindrome if it reads the same forward and backward. ",
              level: 6,
            },
          },
          {
            id: "F6QqgbyawC",
            type: "paragraph",
            data: {
              text: 'For example - <i><b>"racecar"</b></i> reads the same whether forward or backward.',
            },
          },
          {
            id: "Cq9TtWXOgg",
            type: "header",
            data: { text: "Examples", level: 3 },
          },
          {
            id: "kY1AOzqX_J",
            type: "code",
            data: {
              code:
                "# Example 1\n" +
                'Input: s = "A man, a plan, a canal: Panama"\n' +
                "Output: true\n" +
                'Explanation: "amanaplanacanalpanama" is a palindrome.\n' +
                "\n" +
                "# Example 2\n" +
                'Input: s = "i love mom"\n' +
                "Output: false\n" +
                'Explanation: "i love mom" != "mom evol i".\n' +
                "\n" +
                "# Example 3\n" +
                'Input: s = " "\n' +
                "Output: true\n" +
                "Explanation: An empty string reads the same regardless of direction.",
            },
          },
        ],
        version: "2.27.0",
      },
      hints: "So what's a palindrome - any programmatic way to check for that?",
      solution: "return string[::-1] == string"
    },
    {
      id: "2",
      title: "Two Sum",
      body: {
        time: 1687509833191,
        blocks: [
          {
            id: "uH2t70Hrgc",
            type: "header",
            data: {
              text:
                "\n" +
                "\n" +
                "Given an array of integers and an integer target, return&nbsp;indices of the two numbers such that they add up to the target.\n" +
                "\n" +
                " ",
              level: 6,
            },
          },
          {
            id: "F6QqgbyawC",
            type: "paragraph",
            data: {
              text: 'For example,&nbsp;<i><b>"arr = [</b></i><i><b>1, 5, 6, 8]</b></i><i><b>" and "target = 7"</b></i>&nbsp;should return [0, 2]',
            },
          },
          {
            id: "Cq9TtWXOgg",
            type: "header",
            data: { text: "Examples", level: 3 },
          },
          {
            id: "kY1AOzqX_J",
            type: "code",
            data: {
              code:
                "# Example 1\n" +
                "Input: nums = [2,7,11,15], target = 9\n" +
                "Output: [0,1]\n" +
                "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].# Example 2\n" +
                'Input: s = "i love mom"\n' +
                "Output: false\n" +
                'Explanation: "i love mom" != "mom evol i".\n' +
                "\n" +
                "# Example 2\n" +
                "Input: nums = [3,2,4], target = 6\n" +
                "Output: [1,2]\n" +
                "\n" +
                "# Example 3\n" +
                "Input: nums = [3,3], target = 6\n" +
                "Output: [0,1]",
            },
          },
        ],
        version: "2.27.0",
      },
      hints: "You got O(n^2)? Awesome - you are on the right track!",
      solution: "Sort the array, use the two pointers to look for the target value."
    },
    {
      id: "3",
      title: "Unique Paths",
      body: {
        time: 1687817983538,
        blocks: [
          {
            id: "uH2t70Hrgc",
            type: "header",
            data: {
              text: "\n\n\n\nThere is a robot on an&nbsp;m x n&nbsp;grid. ",
              level: 6,
            },
          },
          {
            id: "I-PQVNyXHH",
            type: "list",
            data: {
              style: "unordered",
              items: [
                "The robot is initially located at the&nbsp;top-left corner&nbsp;(i.e.,&nbsp;grid[0][0]). ",
                "The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]).<br>",
                "The robot can only move either down or right at any point in time.<br>",
              ],
            },
          },
          {
            id: "S-1_XCOjL1",
            type: "paragraph",
            data: {
              text: "Given the two integers&nbsp;<code>m</code>&nbsp;and&nbsp;<code>n</code>, return&nbsp;the number of possible unique paths that the robot can take to reach the bottom-right corner.&nbsp;",
            },
          },
          {
            id: "Cq9TtWXOgg",
            type: "header",
            data: { text: "Examples", level: 3 },
          },
          {
            id: "kY1AOzqX_J",
            type: "code",
            data: {
              code:
                "Input: m = 3, n = 2\n" +
                "Output: 3\n" +
                "Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n" +
                "1. Right -> Down -> Down\n" +
                "2. Down -> Down -> Right\n" +
                "3. Down -> Right -> Down",
            },
          },
        ],
        version: "2.27.0",
        title: "Unique Paths",
      },
      hints: "Dynamic programming.",
      solution: "Check the cell to the left and to the top."
    },
  ];
  
  export const getAlgoQuestionById = (id: string): Question | undefined =>
    listOfAlgoQuestions.find((question) => id === question.id);
  
  export const getAllAlgoQuestions = (): Question[] => listOfAlgoQuestions;
  