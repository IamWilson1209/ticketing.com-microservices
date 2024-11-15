import React, { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'), // 成功就會 callback
  });

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <h1 className="text-3xl hero-content text-center font-bold">
        Sell Anything
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="form-group">
          <label className="input input-bordered flex items-center gap-2 mb-2">
            Title
            <input
              type="text"
              placeholder="your tickets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="grow"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="input input-bordered flex items-center gap-2 mb-2">
            Price
            <input
              type="text"
              placeholder="set a price"
              onBlur={onBlur}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="grow"
            />
          </label>
        </div>
        {errors}
        <button className="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
