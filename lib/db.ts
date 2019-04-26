// Shared libraries
import * as Storage from '@terrencecrowley/storage';
import * as FSM from '@terrencecrowley/fsm';

// Custom DB state codes
export const FSM_CREATING: number = FSM.FSM_CUSTOM1;
export const FSM_NEEDRELEASE: number = FSM.FSM_CUSTOM2;
export const FSM_RELEASING: number = FSM.FSM_CUSTOM3;
export const FSM_READING: number = FSM.FSM_CUSTOM4;

type CollectionIndex = { [key: string]: DBCollection };

export class DBClient extends FSM.Fsm
{
  storageManager: Storage.StorageManager;

  constructor(typeName: string, storageManager: Storage.StorageManager)
    {
      super(typeName);
      this.storageManager = storageManager;
    }

  createCollection(name: string, options: any): DBCollection {  return new DBCollection('DBCollection', this, name, options); }
  createUpdate(col: DBCollection, query: any, values: any): DBUpdate { return new DBUpdate('DBUpdate', col, query, values); }
  createDelete(col: DBCollection, query: any): DBDelete { return new DBDelete('DBDelete', col, query); }
  createFind(col: DBCollection, filter: any): DBFind { return new DBFind('DBFind', col, filter); }
  createQuery(col: DBCollection, filter: any): DBQuery { return new DBQuery('DBQuery', col, filter); }
  createIndex(col: DBCollection, uid: string): DBIndex { return new DBIndex('DBIndex', col, uid); }
  createClose(): DBClose { return new DBClose('DBClose', this); }

  close(): void
    {
      if (this.state == FSM.FSM_DONE)
        this.setState(FSM_NEEDRELEASE);
    }
}

export class DBCollection extends FSM.Fsm
{
  name: string;
  options: any;
  col: any;
  client: DBClient;

  constructor(typeName: string, client: DBClient, name: string, options: any)
    {
      super(typeName);
      this.waitOn(client);
      this.client = client;
      this.name = name;
      this.options = options;
      this.col = null;
    }

  get isChildError(): boolean
    {
      return (this.client && this.client.iserror);
    }
}

export class DBUpdate extends FSM.Fsm
{
  col: DBCollection;
  query: any;
  values: any;
  result: any;

  constructor(typeName: string, col: DBCollection, query: any, values: any)
    {
      super(typeName);
      this.waitOn(col);
      this.col = col;
      this.query = query;
      this.values = values;
      this.result = undefined;
    }

  get isChildError(): boolean
    {
      return (this.col && this.col.iserror);
    }
}

export class DBDelete extends FSM.Fsm
{
  col: DBCollection;
  query: any;
  result: any;

  constructor(typeName: string, col: DBCollection, query: any)
    {
      super(typeName);
      this.waitOn(col);
      this.col = col;
      this.query = query;
      this.result = null;
    }

  get isChildError(): boolean
    {
      return (this.col && this.col.iserror);
    }
}

export class DBFind extends FSM.Fsm
{
  col: DBCollection;
  filter: any;
  result: any;

  constructor(typeName: string, col: DBCollection, filter: any)
    {
      super(typeName);
      this.waitOn(col);
      this.col = col;
      this.filter = filter;
      this.result = null;
    }

  get isChildError(): boolean
    {
      return (this.col && this.col.iserror);
    }
}

export class DBQuery extends FSM.Fsm
{
  col: DBCollection;
  filter: any;
  result: any[];

  constructor(typeName: string, col: DBCollection, filter: any)
    {
      super(typeName);
      this.waitOn(col);
      this.col = col;
      this.filter = filter;
      this.result = [];
    }

  get isChildError(): boolean
    {
      return (this.col && this.col.iserror);
    }
}

export class DBIndex extends FSM.Fsm
{
  col: DBCollection;
  uid: string;

  constructor(typeName: string, col: DBCollection, uid: string)
    {
      super(typeName);
      this.waitOn(col);
      this.col = col;
      this.uid = uid;
    }

  get isChildError(): boolean
    {
      return (this.col && this.col.iserror);
    }
}

export class DBClose extends FSM.Fsm
{
  client: DBClient;

  constructor(typeName: string, client: DBClient)
    {
      super(typeName);
      this.client = client;
    }

  get isChildError(): boolean
    {
      return (this.client && this.client.iserror);
    }

  tick(): void
    {
      if (this.ready && this.isChildError)
        this.setState(FSM.FSM_ERROR);
      else if (this.ready && this.state == FSM.FSM_STARTING)
      {
        this.client.close();
        this.setState(FSM.FSM_DONE);
      }
    }
}
