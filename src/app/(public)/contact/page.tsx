
import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactForm from '@/components/Contact/ContactForm';
import { prisma } from '@/lib/prisma';
import type { ContactItem } from '@/components/Contact/types';
import { unstable_noStore as noStore } from 'next/cache';

// Type guard to check if an object is a valid ContactItem
const isContactItem = (item: unknown): item is ContactItem => {
  if (typeof item !== 'object' || item === null) return false;
  
  const contact = item as Record<string, unknown>;
  return (
    'title' in contact &&
    'items' in contact &&
    Array.isArray(contact.items)
  );
};

// Helper function to safely parse contacts
const parseContacts = (contacts: unknown): ContactItem[] => {
  if (!Array.isArray(contacts)) return [];
  
  return contacts
    .filter(item => {
      if (!isContactItem(item)) return false;
      const contact = item as ContactItem;
      return Boolean(contact.title && Array.isArray(contact.items));
    })
    .map(contact => ({
      title: String(contact.title || ''),
      items: contact.items.map(item => String(item || ''))
    }));
};

const getPageData = async () => {
  noStore();
  const [heroSlider, contactDetails] = await Promise.all([
    prisma.heroSlider.findUnique({ 
      where: { page: 'contact' }, 
      include: { slides: true } 
    }),
    prisma.contactDetails.findFirst({
      select: {
        id: true,
        title: true,
        description: true,
        contacts: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  ]);

  // Parse and validate the contacts data
  const parsedContacts = contactDetails?.contacts 
    ? parseContacts(contactDetails.contacts) 
    : [];

  const parsedContactDetails = contactDetails ? {
    ...contactDetails,
    contacts: parsedContacts
  } : null;

  return {
    heroSlider,
    contactDetails: parsedContactDetails
  };
};

export default async function Contact() {
  const { heroSlider, contactDetails } = await getPageData();
  
  return (
    <main className="relative mb-100">
      <HeroSlider pageSlides={heroSlider} />
      <ContactInfo contactDetails={contactDetails} />
      <ContactForm />
    </main>
  );
}

