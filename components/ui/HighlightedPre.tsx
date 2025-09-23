"use client"

import React from "react"
import { codeToTokens, bundledLanguages } from "shiki"

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
  children: string
  language: string
}

export async function HighlightedPre({
  children,
  language,
  ...props
}: HighlightedPreProps) {
  if (!(language in bundledLanguages)) {
    return <pre {...props}>{children}</pre>
  }

  const { tokens } = await codeToTokens(children, {
    lang: language as keyof typeof bundledLanguages,
    defaultColor: false,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  })

  return (
    <pre {...props}>
      <code>
        {tokens.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line.map((token, tokenIndex) => {
              const style =
                typeof token.htmlStyle === "string" ? undefined : token.htmlStyle

              return (
                <span
                  key={tokenIndex}
                  className="text-shiki-light bg-shiki-light-bg dark:text-shiki-dark dark:bg-shiki-dark-bg"
                  style={style}
                >
                  {token.content}
                </span>
              )
            })}
            {lineIndex !== tokens.length - 1 && "\n"}
          </React.Fragment>
        ))}
      </code>
    </pre>
  )
}
