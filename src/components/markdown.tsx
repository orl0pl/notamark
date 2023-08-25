import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown';


const Markdown = ({children}:{children: string})=>(
    <ReactMarkdown
    remarkPlugins={[ remarkMath ]}
    rehypePlugins={[ rehypeKatex ]}
>
    {children}
</ReactMarkdown>

)

export default Markdown;