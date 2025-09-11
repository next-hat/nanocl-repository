import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {statefileToMarkdown} from "../../../lib/statefileToMarkdown";
import type { Metadata, ResolvingMetadata } from 'next'

type PageProps = {
  params: Promise<{ version: string, statefile: string }>
  searchParams: Promise<{ entry: string }>
}

export async function generateMetadata(
  { searchParams }: PageProps,
): Promise<Metadata> {
  const sParams = await searchParams;
  const entry = JSON.parse(sParams.entry);
  if (!entry) return {};
  return {
    title: `${entry.name} - Next Hat - Nanocl Registry`,
    description: entry.description
      || `Statefile for ${entry.name} version ${entry.version}`,
  }
}

export default async function StatefilePage({ params, searchParams }: PageProps) {
  const { version, statefile } = await params;
  const sParams = await searchParams;
  const entry = JSON.parse(sParams.entry);
  if (!entry) return notFound();
  const markdown = statefileToMarkdown(entry, `nr.next-hat.com/${version}/${statefile}`);
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}
      components={{
        h1: ({node, ...props}) => <h1 className="text-3xl text-red-800 text-center font-bold my-4" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-2xl text-red-800 font-semibold my-4" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-xl text-red-800 font-semibold my-4 text-wrap" {...props} />,
        h4: ({node, ...props}) => <h4 className="text-lg text-red-800 font-semibold my-4" {...props} />,
        h5: ({node, ...props}) => <h5 className="text-md text-red-800 font-semibold my-4" {...props} />,
        h6: ({node, ...props}) => <h6 className="text-sm text-red-800 font-semibold my-4" {...props} />,
        a: ({node, ...props}) => <a className="text-blue-600 hover:underline break-all" {...props} />,
        p: ({node, ...props}) => <p className="my-2 pl-2 leading-7 text-wrap" {...props} />,
        li: ({node, ...props}) => <li className="ml-6 list-disc" {...props} />,
        ul: ({node, ...props}) => <ul className="my-2" {...props} />,
        ol: ({node, ...props}) => <ol className="my-2" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground" {...props} />,
        code(props) {
          const {children, className, node, ...rest} = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
          <div className="pl-2 max-w-[1024px] overflow-x-auto my-4">
              <SyntaxHighlighter
                PreTag="div"
                customStyle={{ maxWidth: "1024px", overflowY: 'auto' }}
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={docco}
              />
            </div>
          ) : (
            <code {...rest} className={`pl-2 ${className}`}>
              {children}
            </code>
          )
        }
      }}
    >
      {markdown}
    </Markdown>
  );
}
