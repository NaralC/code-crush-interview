type Payload<T> = {
  type: string;
  event: string;
  payload?: T;
};

type UsersList = {
  [key: string]: [
    {
      name: string;
      presence_ref: string;
      online_at: string;
    }
  ];
};
