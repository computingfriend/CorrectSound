import Sentence from "../Sentence";

const excludedMiddle = (sentence: Sentence): Sentence => ({
  type: "or",
  left: sentence,
  right: {
    type: "not",
    content: sentence,
  },
});

export default excludedMiddle;
