import React from 'react';

const OrderIndex = ({ orders }) => {
  return (
    <div className="flex flex-col space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="card bg-base-100 w-96 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{order.ticket.title}</h2>
            <p>Status: {order.status}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Order</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default OrderIndex;
