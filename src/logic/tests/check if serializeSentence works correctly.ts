import Sentence from "../Sentence";
import Variable from "../Variable";
import serializeSentence from "../serializeSentence";
import test from "ava";

// The generate function generates a random sentence.
// This function uses recursion bounded by a depth factor.
// The depth factor is decremented on every recursive call.
// When the depth factor reaches 0, the function returns a leaf node.

type Config = {
  depthUpperBound: bigint;
  indexUpperBound: bigint;
  setSize: bigint;
  iterationCount: bigint;
};

const performTest = ({
  depthUpperBound,
  indexUpperBound,
  setSize,
  iterationCount,
}: Config) => {
  const generate = () => {
    let depth = BigInt((Math.random() * Number(depthUpperBound)) | 0);
    const generate = (): Sentence => {
      const generateVariable = (): Variable => {
        const variant = BigInt((Math.random() * 2) | 0);

        if (variant === 0n)
          return {
            type: "bound",
            relativeIndex: BigInt(
              (Math.random() * Number(indexUpperBound)) | 0
            ),
          };

        if (variant === 1n)
          return {
            type: "free",
            indexInContext: BigInt(
              (Math.random() * Number(indexUpperBound)) | 0
            ),
          };
      };

      if (depth === 0n)
        return {
          type: "member",
          variable1: generateVariable(),
          variable2: generateVariable(),
        };

      depth--;

      const variant = BigInt((Math.random() * 7) | 0);

      if (variant === 0n)
        return {
          type: "and",
          left: generate(),
          right: generate(),
        };

      if (variant === 1n)
        return {
          type: "or",
          left: generate(),
          right: generate(),
        };

      if (variant === 2n)
        return {
          type: "imply",
          left: generate(),
          right: generate(),
        };

      if (variant === 3n)
        return {
          type: "forall",
          content: generate(),
        };

      if (variant === 4n)
        return {
          type: "exists",
          content: generate(),
        };

      if (variant === 5n)
        return {
          type: "not",
          content: generate(),
        };

      if (variant === 6n)
        return {
          type: "member",
          variable1: generateVariable(),
          variable2: generateVariable(),
        };
    };

    return generate();
  };

  // The generateAndCheck function generates a lot of sentences.
  // Then the function deduplicates the sentences.
  // Then it checks whether there exists two sentences with the same serializeSentence output.
  // If not, the serializeSentence function works correctly.
  // Using two nested for loops to check is slow.
  // This function just deduplicates the sentences one more time with a different criterion.
  // If something is removed, there are two sentences with the same serializeSentence output.
  // Otherwise, serializeSentence works perfectly.

  const generateAndCheck = () => {
    const generated = new Set<Sentence>();

    for (let i = 0n; i < setSize; i++) {
      generated.add(generate());
    }

    {
      const seen = new Set<string>();

      for (const sentence of generated) {
        const jsonSerialization = JSON.stringify(sentence, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        );
        if (seen.has(jsonSerialization)) {
          generated.delete(sentence);
          continue;
        }

        seen.add(jsonSerialization);
      }
    }

    const firstPassLength = BigInt(generated.size);

    {
      const seen = new Set<string>();

      for (const sentence of generated) {
        const jsonSerialization = serializeSentence(sentence);
        if (seen.has(jsonSerialization)) {
          generated.delete(sentence);
          continue;
        }

        seen.add(jsonSerialization);
      }
    }

    const secondPassLength = BigInt(generated.size);

    if (firstPassLength !== secondPassLength) {
      throw new Error("Nasty thing happened");
    }
  };

  for (let i = 0n; i < iterationCount; i++) {
    generateAndCheck();
  }
};

// All these tests are identical but the parameters are different.

test("check if serializeSentence works correctly (1)", (t) => {
  t.timeout(60000);

  performTest({
    depthUpperBound: 32n,
    indexUpperBound: 32n,
    setSize: 2000n,
    iterationCount: 25n,
  });

  t.pass();
});

test("check if serializeSentence works correctly (2)", (t) => {
  t.timeout(60000);

  performTest({
    depthUpperBound: 5n,
    indexUpperBound: 5n,
    setSize: 200n,
    iterationCount: 200n,
  });

  t.pass();
});

test("check if serializeSentence works correctly (3)", (t) => {
  t.timeout(60000);

  performTest({
    depthUpperBound: 20n,
    indexUpperBound: 15n,
    setSize: 1000n,
    iterationCount: 200n,
  });

  t.pass();
});

test("check if serializeSentence works correctly (4)", (t) => {
  t.timeout(60000);

  performTest({
    depthUpperBound: 3n,
    indexUpperBound: 2n,
    setSize: 2000n,
    iterationCount: 200n,
  });

  t.pass();
});
