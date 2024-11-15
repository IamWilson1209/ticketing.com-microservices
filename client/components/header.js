import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tockets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
    // currentUser && { label: 'Subscription', href: '/subscribe' },
  ]
    .filter((linkConfig) => linkConfig) // filter out null or undefined values
    .map(({ label, href }) => {
      return (
        <li key={href} className="">
          <Link className="btn btn-ghost text-xl" href={href}>
            {label}
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar bg-base-100">
      <Link className="btn glass" href="/">
        E-Commerce
      </Link>
      <div className="flex-none">
        <ul className="menu menu-horizontal space-x-4">{links}</ul>
      </div>
    </nav>
  );
};
