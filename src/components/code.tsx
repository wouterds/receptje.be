import { useEffect, useState } from 'react';
import { BundledLanguage, codeToHtml } from 'shiki';

export interface CodeProps {
  children?: string;
  lang: BundledLanguage;
}

export const Code = (props: CodeProps) => {
  const { children: code, lang } = props;

  const [highlightedCode, setHighlightedCode] = useState<string>();
  useEffect(() => {
    if (!code) {
      return;
    }

    codeToHtml(code, { lang, theme: 'github-light' }).then(setHighlightedCode);
  }, [code, lang]);

  if (!code) {
    return null;
  }

  return (
    <pre className="bg-white text-slate-600 p-4 rounded-lg overflow-x-auto text-sm border inline-block">
      {highlightedCode ? (
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
};
