export const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive search
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-300">
        {part}
      </span>
    ) : (
      part
    )
  );
};
