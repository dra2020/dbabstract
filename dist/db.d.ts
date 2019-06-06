import * as LogAbstract from '@terrencecrowley/logabstract';
import * as Context from '@terrencecrowley/context';
import * as Storage from '@terrencecrowley/storage';
import * as FSM from '@terrencecrowley/fsm';
export declare const FSM_CREATING: number;
export declare const FSM_NEEDRELEASE: number;
export declare const FSM_RELEASING: number;
export declare const FSM_READING: number;
export interface DBEnvironment {
    context: Context.IContext;
    log: LogAbstract.ILog;
    fsmManager: FSM.FsmManager;
    storageManager: Storage.StorageManager;
}
export declare class DBClient extends FSM.Fsm {
    constructor(env: DBEnvironment);
    readonly env: DBEnvironment;
    createCollection(name: string, options: any): DBCollection;
    createUpdate(col: DBCollection, query: any, values: any): DBUpdate;
    createDelete(col: DBCollection, query: any): DBDelete;
    createFind(col: DBCollection, filter: any): DBFind;
    createQuery(col: DBCollection, filter: any): DBQuery;
    createIndex(col: DBCollection, uid: string): DBIndex;
    createClose(): DBClose;
    close(): void;
}
export declare class DBCollection extends FSM.Fsm {
    name: string;
    options: any;
    col: any;
    client: DBClient;
    constructor(env: DBEnvironment, client: DBClient, name: string, options: any);
}
export declare class DBUpdate extends FSM.Fsm {
    col: DBCollection;
    query: any;
    values: any;
    result: any;
    constructor(env: DBEnvironment, col: DBCollection, query: any, values: any);
}
export declare class DBDelete extends FSM.Fsm {
    col: DBCollection;
    query: any;
    result: any;
    constructor(env: DBEnvironment, col: DBCollection, query: any);
}
export declare class DBFind extends FSM.Fsm {
    col: DBCollection;
    filter: any;
    result: any;
    constructor(env: DBEnvironment, col: DBCollection, filter: any);
}
export declare class DBQuery extends FSM.Fsm {
    col: DBCollection;
    filter: any;
    result: any[];
    constructor(env: DBEnvironment, col: DBCollection, filter: any);
}
export declare class DBIndex extends FSM.Fsm {
    col: DBCollection;
    uid: string;
    constructor(env: DBEnvironment, col: DBCollection, uid: string);
}
export declare class DBClose extends FSM.Fsm {
    client: DBClient;
    constructor(env: DBEnvironment, client: DBClient);
    tick(): void;
}
