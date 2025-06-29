// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin", // Fixed: lowercase 'admin' instead of 'ADMIN'
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("✅ Admin user created");

  // Create Hero Sections for all pages
  const heroSections = [
    {
      page: "home",
      backgroundImage: "/images/backgrounds/home-hero.jpg",
      theme: "dark",
      welcomeText: "Welcome Red Zone",
      titleLines: ["We generate", "creative &", "innovation ideas"],
      descriptionLines: [
        "XOXO fam brunch",
        "retro intelligentsia",
        "live-edge vegan",
      ],
      buttonText: "Read more",
      buttonLink: "#about",
    },
    {
      page: "about",
      backgroundImage: "/images/backgrounds/about-hero.jpg",
      theme: "dark",
      welcomeText: "About Red Zone",
      titleLines: ["Creative Agency", "With Passion", "For Excellence"],
      descriptionLines: [
        "We are a team of creative professionals",
        "dedicated to bringing your vision to life",
      ],
      buttonText: "Learn More",
      buttonLink: "#team",
    },
    {
      page: "portfolio",
      backgroundImage: "/images/backgrounds/portfolio-hero.jpg",
      theme: "dark",
      welcomeText: "Our Portfolio",
      titleLines: [
        "Amazing Projects",
        "Creative Solutions",
        "Outstanding Results",
      ],
      descriptionLines: ["Discover our latest work", "and creative solutions"],
      buttonText: "View Projects",
      buttonLink: "#projects",
    },
    {
      page: "blog",
      backgroundImage: "/images/backgrounds/blog-hero.jpg",
      theme: "dark",
      welcomeText: "Our Blog",
      titleLines: ["Latest Insights", "Creative Tips", "Industry News"],
      descriptionLines: [
        "Stay updated with our latest",
        "thoughts and insights",
      ],
      buttonText: "Read Articles",
      buttonLink: "#articles",
    },
    {
      page: "contact",
      backgroundImage: "/images/backgrounds/contact-hero.jpg",
      theme: "dark",
      welcomeText: "Contact Us",
      titleLines: ["Let's Work", "Together", "Contact Red Zone"],
      descriptionLines: [
        "Ready to start your project?",
        "Get in touch with us today",
      ],
      buttonText: "Get Started",
      buttonLink: "#contact-form",
    },
  ];

  for (const heroData of heroSections) {
    await prisma.heroSection.upsert({
      where: { page: heroData.page },
      update: heroData,
      create: heroData,
    });
  }
  console.log("✅ Hero sections created");

  // Create Hero Sliders for demonstration
  const heroSliders = [
    {
      page: "home",
      autoplay: true,
      autoplaySpeed: 5,
      showDots: true,
      showArrows: true,
      isActive: true,
      slides: [
        {
          backgroundImage: "/images/backgrounds/home-hero-1.jpg",
          welcomeText: "Welcome to Red Zone",
          titleLines: ["We Create", "Amazing Digital", "Experiences"],
          description:
            "XOXO fam brunch retro intelligentsia live-edge vegan. Copper mug vexillologist sustainable retro ethical.",
          buttonText: "Discover More",
          buttonLink: "#about",
          buttonType: "anchor",
          isActive: true,
          sortOrder: 0,
        },
        {
          backgroundImage: "/images/backgrounds/home-hero-2.jpg",
          welcomeText: "Creative Solutions",
          titleLines: ["Innovation Meets", "Creative Design", "Excellence"],
          description:
            "Green juice roof party kombucha mixtape chartreuse. Tofu retro cold-pressed letterpress coloring book.",
          buttonText: "View Portfolio",
          buttonLink: "/portfolio",
          buttonType: "internal",
          isActive: true,
          sortOrder: 1,
        },
        {
          backgroundImage: "/images/backgrounds/home-hero-3.jpg",
          welcomeText: "Let's Work Together",
          titleLines: ["Ready to Start", "Your Next", "Project?"],
          description:
            "Blog shoreditch food truck aesthetic. Artisan wolf copper mug raw denim, green juice cardigan listicle.",
          buttonText: "Contact Us",
          buttonLink: "/contact",
          buttonType: "internal",
          isActive: true,
          sortOrder: 2,
        },
      ],
    },
    {
      page: "portfolio",
      autoplay: true,
      autoplaySpeed: 7,
      showDots: true,
      showArrows: false,
      isActive: false, // Disabled for now
      slides: [
        {
          backgroundImage: "/images/backgrounds/portfolio-hero-1.jpg",
          welcomeText: "Our Work",
          titleLines: ["Featured", "Projects &", "Case Studies"],
          description:
            "Discover our latest creative projects and see how we bring ideas to life through innovative design.",
          buttonText: "Browse All",
          buttonLink: "#projects",
          buttonType: "anchor",
          isActive: true,
          sortOrder: 0,
        },
        {
          backgroundImage: "/images/backgrounds/portfolio-hero-2.jpg",
          welcomeText: "Creative Excellence",
          titleLines: ["Award Winning", "Design &", "Development"],
          description:
            "From concept to completion, we deliver exceptional results that exceed expectations.",
          buttonText: "Learn More",
          buttonLink: "/about",
          buttonType: "internal",
          isActive: true,
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const sliderData of heroSliders) {
    const { slides, ...sliderInfo } = sliderData;

    await prisma.heroSlider.upsert({
      where: { page: sliderData.page },
      update: {
        ...sliderInfo,
        slides: {
          deleteMany: {},
          create: slides,
        },
      },
      create: {
        ...sliderInfo,
        slides: {
          create: slides,
        },
      },
    });
  }
  console.log("✅ Hero sliders created");

  // Create About Us Section (Home page)
  await prisma.aboutUsSection.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      titleLines: ["WE ARE CREATIVE", "WE ARE RED ZONE"],
      contentLines: [
        "Affogato thundercats quinoa, godard slow-carb chartreuse.",
        "Brooklyn sustainable church-key shabby chic.",
      ],
      closeLine: "GODARD SLOW-CARB",
    },
  });
  console.log("✅ About Us section created");

  // Create Projects
  const projects = [
    {
      id: "1",
      category: "Commercial",
      title: "Bushwick Selfies Pork Belly Lyft Brooklyn Messenger",
      description:
        "Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit. Austin fam chia cold-pressed raw denim. Glossier drinking vinegar portland lo-fi, polaroid bespoke lomo. Banjo art party XOXO, fashion axe sustainable retro ethical gentrify.",
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      slug: "bushwick-selfies-project",
      link: "/project/1",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: "2",
      category: "Branding",
      title: "Craft Beer Artisan Wolf Copper Mug Raw Denim",
      description:
        "Green juice roof party kombucha mixtape chartreuse. Tofu retro cold-pressed letterpress coloring book gastropub yr asymmetrical cred bicycle rights snackwave XOXO raw denim keytar.",
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      slug: "craft-beer-branding",
      link: "/project/2",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      id: "3",
      category: "Web Design",
      title: "Intelligentsia Wolf Gastropub Twee Lomo",
      description:
        "Scenester semiotics plaid, vegan four loko vinyl twee bicycle rights letterpress you probably haven't heard of them before they sold out. Activated charcoal master cleanse.",
      image:
        "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      slug: "intelligentsia-web-design",
      link: "/project/3",
      sortOrder: 3,
    },
  ];

  for (const projectData of projects) {
    await prisma.project.upsert({
      where: { id: projectData.id },
      update: projectData,
      create: projectData,
    });
  }
  console.log("✅ Projects created");

  // Create Clients
  const clients = [
    {
      id: "1",
      name: "Client One",
      logo: "/images/clients/client-1.png",
      sortOrder: 1,
    },
    {
      id: "2",
      name: "Client Two",
      logo: "/images/clients/client-2.png",
      sortOrder: 2,
    },
    {
      id: "3",
      name: "Client Three",
      logo: "/images/clients/client-3.png",
      sortOrder: 3,
    },
    {
      id: "4",
      name: "Client Four",
      logo: "/images/clients/client-4.png",
      sortOrder: 4,
    },
    {
      id: "5",
      name: "Client Five",
      logo: "/images/clients/client-5.png",
      sortOrder: 5,
    },
  ];

  for (const clientData of clients) {
    await prisma.client.upsert({
      where: { id: clientData.id },
      update: clientData,
      create: clientData,
    });
  }
  console.log("✅ Clients created");

  // Create Blog Categories
  const categories = [
    { name: "Art", slug: "art" },
    { name: "Culture", slug: "culture" },
    { name: "Design", slug: "design" },
    { name: "Production", slug: "production" },
    { name: "Management", slug: "management" },
    { name: "Illustration", slug: "illustration" },
  ];

  for (const categoryData of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    });
  }
  console.log("✅ Blog categories created");

  // Create Blog Posts
  const blogPosts = [
    {
      id: "1",
      title: "Subway Tile Brooklyn Bun Pickled Bespoke",
      slug: "subway-tile-brooklyn-bun",
      excerpt:
        "Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit.",
      content:
        "<p>Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit. Austin fam chia cold-pressed raw denim. Glossier drinking vinegar portland lo-fi, polaroid bespoke lomo.</p><p>Banjo art party XOXO, fashion axe sustainable retro ethical gentrify. Copper mug vexillologist +1 prism iPhone fashion axe portland. Hella quinoa woke blog af umami tacos freegan vinyl snackwave microdosing.</p>",
      image: "/images/blog/blog-1.jpg",
      author: "Balanchaev Balancha",
      publishedAt: new Date("2025-03-20"),
      categories: ["art", "design"], // Fixed: using lowercase category names
      tags: ["template", "post formats"],
      isPublished: true,
      isFeatured: true,
    },
    {
      id: "2",
      title: "Shaman Lumbersexual YR Portland Pub",
      slug: "shaman-lumbersexual-yr-portland",
      excerpt:
        "Green juice roof party kombucha mixtape chartreuse. Tofu retro cold-pressed letterpress coloring book gastropub yr asymmetrical.",
      content:
        "<p>Green juice roof party kombucha mixtape chartreuse. Tofu retro cold-pressed letterpress coloring book gastropub yr asymmetrical cred bicycle rights snackwave XOXO raw denim keytar.</p><p>Intelligentsia crucifix next level butcher hexagon, drinking vinegar cray food truck venmo slow-carb vexillologist. Intelligentsia wolf gastropub, twee lomo small batch slow-carb.</p>",
      image: "/images/blog/blog-2.jpg",
      author: "Jane Doe",
      publishedAt: new Date("2024-12-28"),
      categories: ["culture", "design"],
      tags: ["lifestyle", "photography"],
      isPublished: true,
    },
    {
      id: "3",
      title: "Chambray Enamel Pin Synth Shabby",
      slug: "chambray-enamel-pin-synth",
      excerpt:
        "Blog shoreditch food truck aesthetic. Artisan wolf copper mug raw denim, green juice cardigan listicle paleo la croix.",
      content:
        "<p>Blog shoreditch food truck aesthetic. Artisan wolf copper mug raw denim, green juice cardigan listicle paleo la croix live-edge four dollar toast sartorial mustache banh mi mlkshk.</p><p>Hexagon hella four dollar toast +1 gentrify farm-to-table. iPhone franzen portland cardigan fixie blog. Brunch vinyl DIY crucifix taxidermy affogato cred selvage quinoa direct trade keytar sustainable.</p>",
      image: "/images/blog/blog-3.jpg",
      author: "John Smith",
      publishedAt: new Date("2024-12-18"),
      categories: ["production", "management"],
      tags: ["business", "strategy"],
      isPublished: true,
    },
  ];

  const category1 = await prisma.blogCategory.findUnique({
    where: { name: "Art" },
  });
  const category2 = await prisma.blogCategory.findUnique({
    where: { name: "Culture" },
  });
  const tag1 = await prisma.blogTag.findUnique({ where: { name: "template" } });
  const tag2 = await prisma.blogTag.findUnique({
    where: { name: "post formats" },
  });

  for (const postData of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: postData.id },
      update: {
        ...postData,
        categories: {
          connect: [
            { id: category1?.id },
            { id: category2?.id },
            // Add more categories as needed
          ],
        },
        tags: {
          connect: [
            { id: tag1?.id },
            { id: tag2?.id },
            // Add more tags as needed
          ],
        },
        author: {
          connect: {
            id: "1", // Make sure this user exists
          },
        },
      },
      // In your create operation, update the tags structure to:
      create: {
        ...postData,
        categories: {
          connect: [{ id: category1?.id }, { id: category2?.id }],
        },
        tags: {
          connect: [{ id: tag1?.id }, { id: tag2?.id }],
        },
        author: {
          connect: {
            id: "1",
          },
        },
      },
    });
  }
  console.log("✅ Blog posts created");

  // Create Testimonials
  const testimonials = [
    {
      id: "1",
      name: "Balanchaev Balancha",
      role: "Investor",
      content:
        "Copper mug vexillologist +1 prism iPhone fashion axe portland. Hella quinoa woke blog af umami tacos freegan vinyl snackwave microdosing. Fanny pack direct trade XOXO drinking vinegar.",
      avatar: "/images/testimonials/testimonial-1.jpg",
      rating: 5,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content:
        "Amazing work quality and professional service. The team delivered exactly what we needed on time and within budget. Highly recommend their creative solutions.",
      avatar: "/images/testimonials/testimonial-2.jpg",
      rating: 5,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "Creative Director",
      content:
        "Outstanding creativity and attention to detail. They transformed our brand identity completely and exceeded all our expectations. Professional team with great communication.",
      avatar: "/images/testimonials/testimonial-3.jpg",
      rating: 5,
      sortOrder: 3,
    },
  ];

  for (const testimonialData of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonialData.id },
      update: testimonialData,
      create: testimonialData,
    });
  }
  console.log("✅ Testimonials created");

  // Create Team Section
  await prisma.teamSection.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      smallTitle: "Our Team",
      titleLines: ["Team You", "Want to", "Work with"],
    },
  });

  // Create Team Members
  const teamMembers = [
    {
      id: "1",
      name: "John Doe",
      designation: "Creative Director",
      image: "/images/team/team-1.jpg",
      bio: "Creative director with 10+ years of experience in brand development.",
      sortOrder: 1,
    },
    {
      id: "2",
      name: "Jane Smith",
      designation: "Lead Designer",
      image: "/images/team/team-2.jpg",
      bio: "Passionate designer specializing in digital experiences and user interfaces.",
      sortOrder: 2,
    },
    {
      id: "3",
      name: "Mike Johnson",
      designation: "Developer",
      image: "/images/team/team-3.jpg",
      bio: "Full-stack developer focused on creating performant web applications.",
      sortOrder: 3,
    },
  ];

  for (const memberData of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: memberData.id },
      update: memberData,
      create: memberData,
    });
  }
  console.log("✅ Team members created");

  // Create "Who We Are" Section
  await prisma.whoWeAreSection.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      title: "Who We Are",
      description:
        "We are a creative agency focused on delivering exceptional digital experiences. Our team combines artistic vision with technical expertise to bring your ideas to life.",
      extras: [
        {
          title: "Our Services",
          list: [
            "Brand Identity",
            "Web Design",
            "Digital Marketing",
            "Content Creation",
          ],
        },
        {
          title: "Our Approach",
          list: [
            "Research & Strategy",
            "Creative Development",
            "Implementation",
            "Optimization",
          ],
        },
        {
          title: "Our Values",
          list: ["Innovation", "Quality", "Collaboration", "Excellence"],
        },
      ],
    },
  });
  console.log("✅ Who We Are section created");

  // Create "We Are Creative" Section
  await prisma.weAreCreativeSection.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      title: "We Are Creative",
      description:
        "Creativity is at the heart of everything we do. From concept to execution, we bring fresh perspectives and innovative solutions to every project.",
      images: [
        "/images/creative/creative-1.jpg",
        "/images/creative/creative-2.jpg",
        "/images/creative/creative-3.jpg",
        "/images/creative/creative-4.jpg",
      ],
    },
  });
  console.log("✅ We Are Creative section created");

  // Create Contact Details
  await prisma.contactDetails.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      title: "Contact Us",
      description:
        "Ready to start your next project? Get in touch with us today and let's create something amazing together.",
      contacts: [
        {
          title: "Email Us",
          items: ["hello@redzone.com", "info@redzone.com"],
        },
        {
          title: "Call Us",
          items: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
        },
        {
          title: "Visit Us",
          items: ["123 Creative Street", "Design City, DC 12345"],
        },
      ],
    },
  });
  console.log("✅ Contact details created");

  // Create some sample contact submissions
  const contactSubmissions = [
    {
      firstName: "Alice",
      lastName: "Williams",
      email: "alice@example.com",
      message:
        "I would like to discuss a potential project for my startup. We need a complete brand identity and website.",
      isRead: false,
      createdAt: new Date("2025-01-20"),
    },
    {
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@company.com",
      message:
        "Interested in your web design services. Can we schedule a consultation?",
      isRead: true,
      createdAt: new Date("2025-01-18"),
    },
    {
      firstName: "Carol",
      lastName: "Davis",
      email: "carol@business.com",
      message:
        "Need help with rebranding our existing company. What services do you offer?",
      isRead: false,
      createdAt: new Date("2025-01-15"),
    },
  ];

  for (const submissionData of contactSubmissions) {
    await prisma.contactSubmission.create({
      data: submissionData,
    });
  }
  console.log("✅ Contact submissions created");

  // Update blog category post counts
  const artPosts = await prisma.blogPost.count({
    where: { categories: { some: { slug: "art" } } },
  });
  const culturePosts = await prisma.blogPost.count({
    where: { categories: { some: { slug: "culture" } } },
  });
  const designPosts = await prisma.blogPost.count({
    where: { categories: { some: { slug: "design" } } },
  });
  const productionPosts = await prisma.blogPost.count({
    where: { categories: { some: { slug: "production" } } },
  });
  const managementPosts = await prisma.blogPost.count({
    where: { categories: { some: { slug: "management" } } },
  });
  const illustrationPosts = await prisma.blogPost.count({
    where: { categories: { some: { slug: "illustration" } } },
  });

  await prisma.blogCategory.update({
    where: { slug: "art" },
    data: { postCount: artPosts },
  });
  await prisma.blogCategory.update({
    where: { slug: "culture" },
    data: { postCount: culturePosts },
  });
  await prisma.blogCategory.update({
    where: { slug: "design" },
    data: { postCount: designPosts },
  });
  await prisma.blogCategory.update({
    where: { slug: "production" },
    data: { postCount: productionPosts },
  });
  await prisma.blogCategory.update({
    where: { slug: "management" },
    data: { postCount: managementPosts },
  });
  await prisma.blogCategory.update({
    where: { slug: "illustration" },
    data: { postCount: illustrationPosts },
  });

  console.log("✅ Blog category counts updated");

  // Create some site settings
  const siteSettings = [
    { key: "site_name", value: "Red Zone Creative", type: "text" },
    {
      key: "site_description",
      value:
        "Creative agency focused on delivering exceptional digital experiences",
      type: "text",
    },
    { key: "contact_email", value: "hello@redzone.com", type: "text" },
    { key: "contact_phone", value: "+1 (555) 123-4567", type: "text" },
    {
      key: "social_links",
      value: JSON.stringify({
        facebook: "https://facebook.com/redzone",
        twitter: "https://twitter.com/redzone",
        instagram: "https://instagram.com/redzone",
        linkedin: "https://linkedin.com/company/redzone",
      }),
      type: "json",
    },
    { key: "google_analytics_id", value: "GA-XXXXXXXXX", type: "text" },
    { key: "maintenance_mode", value: "false", type: "boolean" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
  console.log("✅ Site settings created");

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
