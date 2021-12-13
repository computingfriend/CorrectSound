import Variable from "./Variable";

type Sentence =
  | {
      type: "and" | "or" | "imply";
      left: Sentence;
      right: Sentence;
    }
  | {
      type: "forall" | "exists";
      content: Sentence;
    }
  | {
      type: "member";
      variable1: Variable;
      variable2: Variable;
    };

export default Sentence;
