'use client';

import Link from 'next/link';
import FlipText from './FlipText';

type FlipLinkProps = {
  text: string;
  href: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  target?: '_blank' | '_self';
  rel?: string;
  className?: string;
};

export default function FlipLink({
  text,
  href,
  size = 'md',
  target = '_self',
  rel,
  className,
}: FlipLinkProps) {
  return (
    <Link href={href} target={target} rel={rel} className='inline-block overflow-hidden pointer-small' >
        <FlipText text={text} size={size} className={className} />
    </Link>
  );
}
