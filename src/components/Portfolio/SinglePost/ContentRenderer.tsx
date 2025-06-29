import { Project } from "@prisma/client";

const ContentRenderer = ({ content }: { content: Project["content"] }) => {


  return (
    <div className="space-y-8">
      <div
        dangerouslySetInnerHTML={{ __html: content || "" }}
        className="text-gray-500 text-lg font-['Oswald'] tracking-wider"
      />
    </div>
  );
};

export default ContentRenderer;
