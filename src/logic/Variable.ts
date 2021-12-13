type Variable =
  | {
      // A free variable is a variable already present in the current context.
      type: "free";
      indexInContext: bigint;
    }
  | {
      // A bound variable is a variable created by a quantifier.
      type: "bound";
      // This field uses de Bruijn indexing.
      // For example: ∀ x, ∀ y, ∃ z, x ∈ y is represented as
      // ∀ _, ∀ _, ∃ _, 2 ∈ 1
      // Names aren't necessary anymore.
      // They are replaced with _ in this example.
      // We count from the location the variables are referenced to the left.
      // We start from zero, not one.
      // Here is another example.
      // ∀ x, ∀ y, ∃ z, x ∈ y ∨ ∀ z, ∀ t, z ∈ x is represented as
      // ∀ _, ∀ _, ∃ _, 2 ∈ 1 ∨ ∀ _, ∀ _, 1 ∈ 4
      // Another example:
      // ∀ x, ∀ y, ∃ z, x ∈ y ∨ ∀ z, ∀ t, t ∈ x is represented as
      // ∀ _, ∀ _, ∃ _, 2 ∈ 1 ∨ ∀ _, ∀ _, 0 ∈ 4
      // Indices are count from 0.
      relativeIndex: bigint;
    };

export default Variable;
