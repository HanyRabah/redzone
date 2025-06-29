import { ContactDetails } from "@prisma/client";

export interface ContactItem {
  title: string;
  items: string[];
}

export type ContactDetailsTypes = Omit<ContactDetails, 'contacts'> & {
  contacts: ContactItem[];
};
