export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ItemEdge = {
  __typename?: 'ItemEdge';
  /**
   *
   *       Represents this location in the query use it in `before` and `after` args
   *       to query before and after this location.
   */
  cursor: Scalars['String'];
  /** The data of the record that goes along with this edge. */
  node: UserType;
};

export type Mutation = {
  __typename?: 'Mutation';
  upsertUser?: Maybe<UserType>;
};


export type MutationUpsertUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  permissionSetId?: InputMaybe<Scalars['String']>;
  salt?: InputMaybe<Scalars['String']>;
};

/**
 *
 *   PageInfo is information about the paging/cursoring happening on the server.
 *   You can use this information to request either the next or previous pages.
 *   Use it in conjunction with the `ForwardPaginationArgs` and `BackwardPaginationArgs`.
 *
 */
export type PageInfo = {
  __typename?: 'PageInfo';
  /**
   *
   *     The cursor representing the last record from the returned query.
   *     Can be used to query before or after this record.
   */
  endCursor?: Maybe<Scalars['String']>;
  /** Whether the query has more records after the end cursor. */
  hasNextPage: Scalars['Boolean'];
  /** Whether the query has more records before the start cursor. */
  hasPreviousPage: Scalars['Boolean'];
  /**
   *
   *     The cursor representing the first record from the returned query.
   *     Can be used to query before or after this record.
   */
  startCursor?: Maybe<Scalars['String']>;
};

export type PermissionSet = {
  __typename?: 'PermissionSet';
  name: Scalars['String'];
  permissionSetId: Scalars['ID'];
  roles?: Maybe<Array<Roles>>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<UserType>;
  users?: Maybe<UserConnection>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Float']>;
};

/** All available roles */
export enum Roles {
  ReadUsers = 'READ_USERS',
  WriteUsers = 'WRITE_USERS'
}

export type UserConnection = {
  __typename?: 'UserConnection';
  /** A list of objects with a record data (node) and its corresponding cursor from the query. */
  edges: Array<ItemEdge>;
  nodes: Array<UserType>;
  /**
   *
   *       PageInfo is information about the paging/cursoring happening on the server.
   *       You can use this information to request either the next or previous pages.
   *       Use it in conjunction with the `ForwardPaginationArgs` and `BackwardPaginationArgs`.
   *
   */
  pageInfo: PageInfo;
  /** The estimated total count of records that may be returned across multiple queries. */
  totalCount: Scalars['Float'];
};

export type UserType = {
  __typename?: 'UserType';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  permissionSet?: Maybe<PermissionSet>;
  userId: Scalars['ID'];
};
