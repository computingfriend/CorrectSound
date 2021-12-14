import Sentence from "../Sentence";
import serializeSentence from "../serializeSentence";

const deepEqual = (a: Sentence, b: Sentence): boolean => {
  return serializeSentence(a) === serializeSentence(b);
};
