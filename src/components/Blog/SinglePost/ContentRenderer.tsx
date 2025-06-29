import { BlogPost } from "@prisma/client";


//example of blog content
//<p>Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit. Austin fam chia cold-pressed raw denim. Glossier drinking vinegar portland lo-fi, polaroid bespoke lomo.</p><p>Banjo art party XOXO, fashion axe sustainable retro ethical gentrify. Copper mug vexillologist +1 prism iPhone fashion axe portland. Hella quinoa woke blog af umami tacos freegan vinyl snackwave microdosing.</p>
const ContentRenderer = ({ content }: { content: BlogPost['content'] }) => {
    return (
      <div className="space-y-8">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };

  export default ContentRenderer;