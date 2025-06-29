export interface NavItem {
    label: string;
    href: string;
    bgImage: string;
  }
  
  export interface Project {
    id: string;
    category: string;
    title: string[];
    description: string;
    image: string;
    href: string;
  }
  
  export interface BlogPost {
    id: string;
    title: string[];
    image: string;
    categories: string[];
    tags: string[];
    author: string;
    date: string;
    href: string;
  }
  
  export interface Testimonial {
    id: string;
    name: string;
    role: string;
    image: string;
    content: string;
  }

  export interface NavigationItem {
    href: string;
    label: string;
    bgImage?: string;
  }
  
  export interface SlideData {
    id: number | string;
    content: {
      title: string[];
      subtitle?: string;
      description?: string[];
      buttonText: string;
      buttonLink: string;
      welcomeText?: string;
    };
    backgroundImage: string;
    theme?: 'dark' | 'light';
  }
  
  export interface ProjectData {
    id: number | string;
    title: string;
    category: string;
    description: string;
    image: string;
    link: string;
  }