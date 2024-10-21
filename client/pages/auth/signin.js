import React from 'react';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'), // 成功就會 callback
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Input email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Passowrd</label>
        <input
          type="password"
          placeholder="Input password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign in</button>
    </form>
  );
};

export default signup;
