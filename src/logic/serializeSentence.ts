import Sentence from "./Sentence";
import Variable from "./Variable";

const serializeSentence = (sentence: Sentence): string => {
  if (sentence.type === "and") {
    const serializeChild = (child: Sentence) => {
      if (child.type !== "and") return "(" + serializeSentence(child) + ")";
      return serializeSentence(child);
    };

    return (
      serializeChild(sentence.left) + " ∧ " + serializeChild(sentence.right)
    );
  }

  if (sentence.type === "or") {
    const serializeChild = (child: Sentence) => {
      if (child.type !== "or") return "(" + serializeSentence(child) + ")";
      return serializeSentence(child);
    };

    return (
      serializeChild(sentence.left) + " ∨ " + serializeChild(sentence.right)
    );
  }

  if (sentence.type === "imply") {
    const { left, right } = sentence;
    const serializedLeft = (() => {
      if (left.type !== "member") return "(" + serializeSentence(left) + ")";
      return serializeSentence(left);
    })();

    const serializedRight = (() => {
      if (right.type !== "member" && right.type !== "imply")
        return "(" + serializeSentence(right) + ")";
      return serializeSentence(right);
    })();

    return serializedLeft + " → " + serializedRight;
  }

  if (sentence.type === "forall") {
    return "∀ _, " + serializeSentence(sentence.content);
  }

  if (sentence.type === "exists") {
    return "∃ _, " + serializeSentence(sentence.content);
  }

  if (sentence.type === "member") {
    const serializeVariable = (variable: Variable) => {
      if (variable.type === "bound") return variable.relativeIndex.toString();
      return "[" + variable.indexInContext + "]";
    };

    const serializedVariable1 = serializeVariable(sentence.variable1);
    const serializedVariable2 = serializeVariable(sentence.variable2);

    return serializedVariable1 + " ∈ " + serializedVariable2;
  }
};

export default serializeSentence