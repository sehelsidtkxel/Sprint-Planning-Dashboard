function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index}>
          {part.replaceAll("**", "")}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function RichTextDisplay({
  text,
}: {
  text?: string;
}) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1 whitespace-pre-wrap">
      {lines.map((line, index) => {
        const isBullet = line.trim().startsWith("•");

        if (isBullet) {
          return (
            <div key={index} className="flex gap-2">
              <span>•</span>
              <span>
                {renderBold(line.replace(/^•\s*/, ""))}
              </span>
            </div>
          );
        }

        return (
          <p key={index}>
            {renderBold(line)}
          </p>
        );
      })}
    </div>
  );
}