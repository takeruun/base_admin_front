import { useState, useCallback } from 'react';
import request from 'src/hooks/useRequest';
import type { User } from 'src/models/user';

export const useGetUser = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  const getUser = useCallback((userId: number) => {
    setLoading(true);
    try {
      request({
        url: `/v1/users/${userId}`,
        method: 'GET'
      })
        .then((response) => {
          setUser(response.data.user);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getUser, user, loading };
};

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const getUsers = useCallback((params) => {
    try {
      request({
        url: `/v1/users`,
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setUsers(response.data.users);
          setTotalCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { getUsers, totalCount, users };
};

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  const getUsers = useCallback((params) => {
    try {
      request({
        url: `/v1/users`,
        method: 'GET',
        reqParams: {
          params
        }
      })
        .then((response) => {
          setUsers(response.data.users);
          setTotalCount(response.data.totalCount);
        })
        .finally(() => {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getUser = useCallback((userId: number) => {
    setLoading(true);
    try {
      request({
        url: `/v1/users/${userId}`,
        method: 'GET'
      })
        .then((response) => {
          setUser(response.data.user);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    getUser,
    getUsers,

    user,
    users,
    totalCount,
    loading
  };
};
