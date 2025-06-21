'use client';

const posts = [
  {
    title: 'The Future of Digital Marketing',
    excerpt: 'Explore the latest trends and technologies shaping the future of digital marketing.',
    image: '/images/blog/post1.jpg',
    author: 'James Basinski',
    date: 'March 10, 2025',
    category: 'Digital Marketing'
  },
  {
    title: 'Building a Strong Brand Identity',
    excerpt: 'Learn the key elements of creating a memorable and effective brand identity.',
    image: '/images/blog/post2.jpg',
    author: 'Sarah Johnson',
    date: 'March 8, 2025',
    category: 'Branding'
  },
  {
    title: 'SEO Strategies for 2025',
    excerpt: 'Stay ahead of the competition with these effective SEO strategies for the new year.',
    image: '/images/blog/post3.jpg',
    author: 'Michael Chen',
    date: 'March 5, 2025',
    category: 'SEO'
  }
];

export default function BlogSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Latest News</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest insights, news, and trends in the digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 hover:text-red-600 transition-colors">
                  <a href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`}>
                    {post.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <a
                  href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`}
                  className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/blog"
            className="inline-block px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
}
