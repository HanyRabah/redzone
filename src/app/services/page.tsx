import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    title: "Digital Strategy",
    description: "We develop comprehensive digital strategies that align with your business goals and target audience. Our approach combines data-driven insights with creative thinking to deliver measurable results.",
    features: [
      "Market Research & Analysis",
      "Competitor Analysis",
      "Digital Channel Strategy",
      "Performance Metrics & KPIs",
      "ROI Optimization"
    ],
    icon: "🎯",
    image: "/images/services/digital-strategy.jpg"
  },
  {
    title: "Brand Identity",
    description: "Create a unique and memorable brand identity that resonates with your customers and stands out in the market. We help you build a strong brand foundation that communicates your values and vision.",
    features: [
      "Logo Design",
      "Visual Identity Systems",
      "Brand Guidelines",
      "Brand Voice & Messaging",
      "Brand Strategy"
    ],
    icon: "🎨",
    image: "/images/services/brand-identity.jpg"
  },
  {
    title: "Web Development",
    description: "Build responsive, user-friendly websites that provide an exceptional user experience and drive conversions. Our development team uses the latest technologies to create fast, secure, and scalable web solutions.",
    features: [
      "Custom Website Development",
      "E-commerce Solutions",
      "Content Management Systems",
      "Website Maintenance",
      "Performance Optimization"
    ],
    icon: "💻",
    image: "/images/services/web-development.jpg"
  },
  {
    title: "Social Media Management",
    description: "Engage your audience and grow your brand presence across all major social media platforms. We create and execute social media strategies that build community and drive engagement.",
    features: [
      "Content Strategy",
      "Social Media Marketing",
      "Community Management",
      "Influencer Partnerships",
      "Social Analytics"
    ],
    icon: "📱",
    image: "/images/services/social-media.jpg"
  },
  {
    title: "SEO & Analytics",
    description: "Improve your online visibility and track your digital performance with our comprehensive SEO and analytics services. We help you understand and optimize your digital presence.",
    features: [
      "Keyword Research",
      "On-Page SEO",
      "Technical SEO",
      "Analytics Setup",
      "Performance Reporting"
    ],
    icon: "📊",
    image: "/images/services/seo-analytics.jpg"
  },
  {
    title: "Content Creation",
    description: "Produce engaging content that tells your brand story and connects with your target audience. From blog posts to video content, we create compelling content that drives results.",
    features: [
      "Content Strategy",
      "Copywriting",
      "Video Production",
      "Photography",
      "Animation"
    ],
    icon: "🎬",
    image: "/images/services/content-creation.jpg"
  }
];

export default function Services() {
  return (
    <main className="animsition-overlay" data-animsition-overlay="true">
      {/* page-head start */}
      <section id="up" className="page-head flex-min-height-box dark-bg-2">
        {/* page-head-bg */}
        <div className="page-head-bg overlay-loading2" style={{ 
          backgroundImage: 'url(/assets/images/backgrounds/adult-brainstorming-businesswoman-515169.jpg)'
        }}></div>

        {/* flex-min-height-inner start */}
        <div className="flex-min-height-inner">
          {/* container start */}
          <div className="container top-bottom-padding-120">
            {/* flex-container start */}
            <div className="flex-container">
              {/* column start */}
              <div className="six-columns">
                <div className="content-left-margin-40">
                  <h2 className="large-title-bold">
                    <span className="load-title-fill tr-delay01" data-text="Our">Our</span><br/>
                    <span className="load-title-fill tr-delay02" data-text="Services">Services</span>
                  </h2>
                  <p className="p-style-bold-up text-color-5">
                    <span className="load-title-fill tr-delay03" data-text="We">We</span><br/>
                    <span className="load-title-fill tr-delay04" data-text="Create Digital">Create Digital</span>
                  </p>
                </div>
              </div>{/* column end */}
            </div>{/* flex-container end */}
          </div>{/* container end */}
        </div>{/* flex-min-height-inner end */}

        {/* scroll-btn start */}
        <a href="#down" className="scroll-btn pointer-large">
          <div className="scroll-arrow-box">
            <span className="scroll-arrow"></span>
          </div>
          <div className="scroll-btn-flip-box">
            <span className="scroll-btn-flip" data-text="Scroll">Scroll</span>
          </div>
        </a>{/* scroll-btn end */}
      </section>{/* page-head end */}

      {/* flex-min-height-box start */}
      <section id="down" className="bg-black flex-min-height-box">
        {/* flex-min-height-inner start */}
        <div className="flex-min-height-inner">
          {/* container start */}
          <div className="container top-bottom-padding-120">
            {/* services-slider start */}
            <div className="services-slider">
              {/* swiper-wrapper start */}
              <div className="swiper-wrapper">
                {/* swiper-slide start */}
                <div className="swiper-slide">
                  <div className="flex-container">
                    {/* column start */}
                    <div className="six-columns">
                      <div className="content-right-margin-20">
                        <h3 className="title-style text-color-4">
                          <span className="text-color-3">Web</span><br/>
                          Development
                        </h3>
                        <p className="p-style-medium text-color-4 fade-loading tr-delay01">Custom websites and web applications built with the latest technologies</p>
                      </div>
                    </div>{/* column end */}
                    {/* column start */}
                    <div className="six-columns">
                      <div className="content-left-margin-20">
                        <ul className="list-dots">
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Custom Web Development</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">E-commerce Solutions</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">CMS Integration</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Web Maintenance</p>
                          </li>
                        </ul>
                      </div>
                    </div>{/* column end */}
                  </div>
                </div>{/* swiper-slide end */}
                {/* swiper-slide start */}
                <div className="swiper-slide">
                  <div className="flex-container">
                    {/* column start */}
                    <div className="six-columns">
                      <div className="content-right-margin-20">
                        <h3 className="title-style text-color-4">
                          <span className="text-color-3">Digital</span><br/>
                          Marketing
                        </h3>
                        <p className="p-style-medium text-color-4 fade-loading tr-delay01">Strategic marketing campaigns to grow your online presence</p>
                      </div>
                    </div>{/* column end */}
                    {/* column start */}
                    <div className="six-columns">
                      <div className="content-left-margin-20">
                        <ul className="list-dots">
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">SEO Optimization</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Content Marketing</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Email Marketing</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">PPC Campaigns</p>
                          </li>
                        </ul>
                      </div>
                    </div>{/* column end */}
                  </div>
                </div>{/* swiper-slide end */}
                {/* swiper-slide start */}
                <div className="swiper-slide">
                  <div className="flex-container">
                    {/* column start */}
                    <div className="six-columns">
                      <div className="content-right-margin-20">
                        <h3 className="title-style text-color-4">
                          <span className="text-color-3">Brand</span><br/>
                          Strategy
                        </h3>
                        <p className="p-style-medium text-color-4 fade-loading tr-delay01">Develop a strong brand identity that resonates with your audience</p>
                      </div>
                    </div>{/* column end */}
                    {/* column start */}
                    <div className="six-columns">
                      <div className="content-left-margin-20">
                        <ul className="list-dots">
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Brand Identity</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Logo Design</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Brand Guidelines</p>
                          </li>
                          <li className="list-dots-item text-color-4">
                            <p className="p-letter-style">Brand Strategy</p>
                          </li>
                        </ul>
                      </div>
                    </div>{/* column end */}
                  </div>
                </div>{/* swiper-slide end */}
              </div>{/* swiper-wrapper end */}

              {/* swiper-button-prev start */}
              <div className="swiper-button-prev">
                <div className="swiper-button-prev-box">
                  <span className="swiper-button-line"></span>
                </div>
              </div>{/* swiper-button-prev end */}
              {/* swiper-button-next start */}
              <div className="swiper-button-next">
                <div className="swiper-button-next-box">
                  <span className="swiper-button-line"></span>
                </div>
              </div>{/* swiper-button-next end */}
            </div>{/* services-slider end */}
          </div>{/* container end */}
        </div>{/* flex-min-height-inner end */}
      </section>{/* flex-min-height-box end */}

      {/* light-bg-2 start */}
      <section className="light-bg-2">
        {/* container start */}
        <div className="container small top-bottom-padding-120">
          {/* text-center start */}
          <div className="text-center">
            <h2 className="large-title text-color-1">
              <span className="text-color-2">Our</span><br/>
              Process
            </h2>
            <p className="p-style-large text-color-2 fade-loading tr-delay02">How we bring your ideas to life</p>
          </div>{/* text-center end */}

          {/* flex-container start */}
          <div className="flex-container top-padding-90">
            {/* column start */}
            <div className="three-columns">
              <div className="content-right-margin-10">
                <div className="text-center">
                  <span className="small-title-oswald text-color-2">01</span>
                  <h3 className="small-title-oswald text-color-1">Discovery</h3>
                  <p className="p-style-small text-color-2 fade-loading tr-delay01">We learn about your business, goals, and vision</p>
                </div>
              </div>
            </div>{/* column end */}
            {/* column start */}
            <div className="three-columns">
              <div className="content-left-right-margin-5">
                <div className="text-center">
                  <span className="small-title-oswald text-color-2">02</span>
                  <h3 className="small-title-oswald text-color-1">Strategy</h3>
                  <p className="p-style-small text-color-2 fade-loading tr-delay02">We develop a comprehensive plan to achieve your objectives</p>
                </div>
              </div>
            </div>{/* column end */}
            {/* column start */}
            <div className="three-columns">
              <div className="content-left-right-margin-5">
                <div className="text-center">
                  <span className="small-title-oswald text-color-2">03</span>
                  <h3 className="small-title-oswald text-color-1">Creation</h3>
                  <p className="p-style-small text-color-2 fade-loading tr-delay03">We bring your vision to life with expert execution</p>
                </div>
              </div>
            </div>{/* column end */}
            {/* column start */}
            <div className="three-columns">
              <div className="content-left-margin-10">
                <div className="text-center">
                  <span className="small-title-oswald text-color-2">04</span>
                  <h3 className="small-title-oswald text-color-1">Launch</h3>
                  <p className="p-style-small text-color-2 fade-loading tr-delay04">We ensure a smooth launch and continued success</p>
                </div>
              </div>
            </div>{/* column end */}
          </div>{/* flex-container end */}
        </div>{/* container end */}
      </section>{/* light-bg-2 end */}

      {/* dark-bg-2 start */}
      <section className="dark-bg-2">
        {/* container start */}
        <div className="container top-bottom-padding-120">
          {/* text-center start */}
          <div className="text-center">
            <h2 className="large-title text-color-4">
              <span className="text-color-3">Ready to</span><br/>
              Start Your Project?
            </h2>
            <p className="p-style-large text-color-4 fade-loading tr-delay02">Let's work together to create something amazing</p>
            <div className="top-margin-30">
              <a href="/contact" className="button-style pointer-large">
                <span className="button-style-inner">
                  Get in Touch
                </span>
              </a>
            </div>
          </div>{/* text-center end */}
        </div>{/* container end */}
      </section>{/* dark-bg-2 end */}
      <Footer />
    </main>
  );
}
