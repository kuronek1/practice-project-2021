import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';
import Spinner from '../Spinner/Spinner';

export default function PrivateRoute({ roles, ...rest }) {
  const { data, isFetching } = useSelector((state) => state.userStore);

  if (isFetching) {
    return <Spinner />;
  }

  if (data) {
    if (roles && !roles.includes(data.role)) {
      return <Redirect to="/"></Redirect>;
    }
  } else {
    return <Redirect to="/login"></Redirect>;
  }

  return <Route {...rest} />;
}
