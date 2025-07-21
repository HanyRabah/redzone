import { Project } from "@prisma/client";

const ContentRenderer = ({ content }: { content: Project["content"] }) => {


  return (
    <div className="space-y-8">
      <div
        dangerouslySetInnerHTML={{ __html: content || "" }}
        className="text-xl tracking-wider"
      />
    </div>
  );
};

export default ContentRenderer;
