import { useEffect, useState, FC } from 'react';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';

const withAuth = (WrappedComponent: NextPage) => {
  const WithAuth: FC = (props) => {
    const Router = useRouter();
    const [loading, setLoading] = useState(true);
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('__tmc_token__')
        : null;

    useEffect(() => {
      if (!token || token === '') {
        Router.replace('/login');
      } else {
        setLoading(false);
      }
    }, [token]);

    if (loading) {
      return <div />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
