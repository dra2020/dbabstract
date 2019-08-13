// Shared libraries
import * as LogAbstract from '@dra2020/logabstract';
import * as Context from '@dra2020/context';
import * as Storage from '@dra2020/storage';
import * as FSM from '@dra2020/fsm';

// Custom DB state codes
export const FSM_CREATING: number = FSM.FSM_CUSTOM1;
export const FSM_NEEDRELEASE: number = FSM.FSM_CUSTOM2;
export const FSM_RELEASING: number = FSM.FSM_CUSTOM3;
export const FSM_READING: number = FSM.FSM_CUSTOM4;

type CollectionIndex = { [key: string]: DBCollection };

export interface DBEnvironment
{
  context: Context.IContext;
  log: LogAbstract.ILog;
  fsmManager: FSM.FsmManager;
  storageManager: Storage.StorageManager;
}

export class DBClient extends FSM.Fsm
{
  constructor(env: DBEnvironment)
  {
    super(env);
  }

  get env(): DBEnvironment { return this._env as DBEnvironment; }

  createCollection(name: string, options: any): DBCollection {  return new DBCollection(this.env, this, name, options); }
  createUpdate(col: DBCollection, query: any, values: any): DBUpdate { return new DBUpdate(this.env, col, query, values); }
  createDelete(col: DBCollection, query: any): DBDelete { return new DBDelete(this.env, col, query); }
  createFind(col: DBCollection, filter: any): DBFind { return new DBFind(this.env, col, filter); }
  createQuery(col: DBCollection, filter: any): DBQuery { return new DBQuery(this.env, col, filter); }
  createIndex(col: DBCollection, uid: string): DBIndex { return new DBIndex(this.env, col, uid); }
  createClose(): DBClose { return new DBClose(this.env, this); }

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

  constructor(env: DBEnvironment, client: DBClient, name: string, options: any)
    {
      super(env);
      this.waitOn(client);
      this.client = client;
      this.name = name;
      this.options = options;
      this.col = null;
    }
}

export class DBUpdate extends FSM.Fsm
{
  col: DBCollection;
  query: any;
  values: any;
  result: any;

  constructor(env: DBEnvironment, col: DBCollection, query: any, values: any)
    {
      super(env);
      this.waitOn(col);
      this.col = col;
      this.query = query;
      this.values = values;
      this.result = undefined;
    }
}

export class DBDelete extends FSM.Fsm
{
  col: DBCollection;
  query: any;
  result: any;

  constructor(env: DBEnvironment, col: DBCollection, query: any)
    {
      super(env);
      this.waitOn(col);
      this.col = col;
      this.query = query;
      this.result = null;
    }
}

export class DBFind extends FSM.Fsm
{
  col: DBCollection;
  filter: any;
  result: any;

  constructor(env: DBEnvironment, col: DBCollection, filter: any)
    {
      super(env);
      this.waitOn(col);
      this.col = col;
      this.filter = filter;
      this.result = null;
    }
}

export class DBQuery extends FSM.Fsm
{
  col: DBCollection;
  filter: any;
  result: any[];

  constructor(env: DBEnvironment, col: DBCollection, filter: any)
    {
      super(env);
      this.waitOn(col);
      this.col = col;
      this.filter = filter;
      this.result = [];
    }
}

export class DBIndex extends FSM.Fsm
{
  col: DBCollection;
  uid: string;

  constructor(env: DBEnvironment, col: DBCollection, uid: string)
    {
      super(env);
      this.waitOn(col);
      this.col = col;
      this.uid = uid;
    }
}

export class DBClose extends FSM.Fsm
{
  client: DBClient;

  constructor(env: DBEnvironment, client: DBClient)
    {
      super(env);
      this.client = client;
    }

  tick(): void
    {
      if (this.ready && this.isDependentError)
        this.setState(FSM.FSM_ERROR);
      else if (this.ready && this.state == FSM.FSM_STARTING)
      {
        this.client.close();
        this.setState(FSM.FSM_DONE);
      }
    }
}
