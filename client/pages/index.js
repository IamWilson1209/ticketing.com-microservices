import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id} className="hover">
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div className="overflow-x-auto">
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr className="hover">
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log('STRIPE_PUBLIC_KEY:', process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
