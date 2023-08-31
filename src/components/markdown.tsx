import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown';
import { Roboto_Slab } from 'next/font/google'
import remarkGfm from 'remark-gfm';
import rehypeSlug from "rehype-slug";

const slab = Roboto_Slab({subsets: ['latin'], weight: "variable", })

const Markdown = ({children}:{children: string})=>(
    <ReactMarkdown
    className={`${slab.className} `}
    remarkPlugins={[ remarkMath, remarkGfm ]}
    rehypePlugins={[ rehypeKatex, rehypeSlug ]}
>
    {children}
</ReactMarkdown>

)

export default Markdown;