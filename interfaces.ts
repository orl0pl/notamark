export interface Account {
  name: string;
  password: string;
  roles: Array<'editor' | 'admin' | 'user'>;
  id: number;
}
export interface SessionsArray {
  [key: string]: number
};
export interface Changeset {
  id: number;
  summary: string;
  old: Changeset['id'];
  new: string;
  madeBy: Account["id"],
  madeAt: number;
  changes: [
    {
      count: number,
      added: boolean | undefined,
      removed: boolean | undefined,
      value: string
    }
  ];
  verified: boolean;
}

