const PublicTickets = ({ currentUser, tickets }) => {
  // const ticketList = tickets.map((ticket) => {
  //   return (
  //     <tr key={ticket.id}>
  //       <td>{ticket.title}</td>
  //       <td>{ticket.price}</td>
  //       <td>
  //         <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
  //           View
  //         </Link>
  //       </td>
  //     </tr>
  //   );
  // });

  return (
    <div>not yet</div>
    // <div>
    //   <h1>Tickets</h1>
    //   <table className="table">
    //     <thead>
    //       <tr>
    //         <th>Title</th>
    //         <th>Price</th>
    //         <th>Link</th>
    //       </tr>
    //     </thead>
    //     <tbody>{ticketList}</tbody>
    //   </table>
    // </div>
  );
};

// PublicTickets.getInitialProps = async (context, client) => {
//   const { ticketId } = context.query;
//   const { data } = await client.get(`/api/tickets/${ticketId}`);
//   return { ticket: data };
// };

export default PublicTickets;
