import * as Storage from '@terrencecrowley/storage';
import * as FSM from '@terrencecrowley/fsm';
export declare const FSM_CREATING: number;
export declare const FSM_NEEDRELEASE: number;
export declare const FSM_RELEASING: number;
export declare const FSM_READING: number;
export declare class DBClient extends FSM.Fsm {
    storageManager: Storage.StorageManager;
    constructor(typeName: string, storageManager: Storage.StorageManager);
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
    constructor(typeName: string, client: DBClient, name: string, options: any);
    readonly isChildError: boolean;
}
export declare class DBUpdate extends FSM.Fsm {
    col: DBCollection;
    query: any;
    values: any;
    result: any;
    constructor(typeName: string, col: DBCollection, query: any, values: any);
    readonly isChildError: boolean;
}
export declare class DBDelete extends FSM.Fsm {
    col: DBCollection;
    query: any;
    result: any;
    constructor(typeName: string, col: DBCollection, query: any);
    readonly isChildError: boolean;
}
export declare class DBFind extends FSM.Fsm {
    col: DBCollection;
    filter: any;
    result: any;
    constructor(typeName: string, col: DBCollection, filter: any);
    readonly isChildError: boolean;
}
export declare class DBQuery extends FSM.Fsm {
    col: DBCollection;
    filter: any;
    result: any[];
    constructor(typeName: string, col: DBCollection, filter: any);
    readonly isChildError: boolean;
}
export declare class DBIndex extends FSM.Fsm {
    col: DBCollection;
    uid: string;
    constructor(typeName: string, col: DBCollection, uid: string);
    readonly isChildError: boolean;
}
export declare class DBClose extends FSM.Fsm {
    client: DBClient;
    constructor(typeName: string, client: DBClient);
    readonly isChildError: boolean;
    tick(): void;
}
