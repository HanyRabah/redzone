const Newsletter = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-8">Stay Updated</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive the latest insights and updates
          directly in your inbox.
        </p>
        <form className="max-w-lg mx-auto">
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
