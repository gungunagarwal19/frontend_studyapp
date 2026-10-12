import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatMarkdownContent(raw) {
  if (!raw || typeof raw !== "string") return "";
  let text = raw;

  // 1. Replace bullet dots (•, ●) with markdown bullet lists when squished inline or following dash
  text = text.replace(/(?:^|\n|[-–—\s])\s*[•●]\s+/g, "\n\n- ");

  // 2. Add newlines before squished numbered list items (e.g. "**Title** 1. **" or "seconds. 2. **")
  text = text.replace(/([.!?:*])\s+(\d+\.\s+[*A-Z])/g, "$1\n\n$2");

  // 3. Ensure markdown headings have preceding blank lines
  text = text.replace(/([^\n])\s*(#{1,6}\s+)/g, "$1\n\n$2");

  return text.trim();
}

const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const displayLang = language || "code";

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-block-lang">{displayLang}</span>
        <button
          type="button"
          className="code-copy-btn"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ color: "#2DD4BF" }}>Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code className={language ? `language-${language}` : ""}>{code}</code>
      </pre>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const formattedContent = formatMarkdownContent(content);

  return (
    <div className="chat-markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isBlock = match || codeString.includes("\n");

            if (isBlock) {
              return (
                <CodeBlock
                  language={match ? match[1] : ""}
                  code={codeString}
                />
              );
            }
            return (
              <code className="chat-inline-code" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="table-responsive-wrapper">
                <table className="chat-markdown-table">{children}</table>
              </div>
            );
          },
          blockquote({ children }) {
            return <blockquote className="chat-blockquote">{children}</blockquote>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-markdown-link"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
